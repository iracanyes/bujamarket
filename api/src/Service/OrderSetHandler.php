<?php


namespace App\Service;

use App\Entity\DeliverySet;
use App\Entity\OrderDetail;
use App\Entity\OrderSet;
use App\Entity\Customer;
use Doctrine\DBAL\Driver\PDOException;
use Doctrine\ORM\EntityNotFoundException;
use App\Exception\OrderSet\OrderSetNotFoundException;
use Lexik\Bundle\JWTAuthenticationBundle\Exception\UserNotFoundException;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\Security;
use Doctrine\ORM\EntityManagerInterface;
use App\Exception\OrderSet\RetrieveUserOrdersException;

class OrderSetHandler
{
    /**
     * @var Security $security
     */
    private $security;

    /**
     * @var \Symfony\Component\HttpFoundation\Request|null $request
     */
    private $request;

    /**
     * @var EntityManagerInterface $em
     */
    private $em;

    /**
     * @var LoggerInterface
     */
    private $logger;

    /**
     * @var AddressHandler $addressHandler
     */
    private $addressHandler;

    /**
     * @var ShoppingCartHandler $shoppingCardHandler
     */
    private $shoppingCardHandler;

    /**
     * @var ShipperHandler $shipperHandler
     */
    private $shipperHandler;

    public function __construct(Security $security, RequestStack $requestStack, EntityManagerInterface $em, LoggerInterface $logger, AddressHandler $addressHandler, ShoppingCartHandler $shoppingCardHandler, ShipperHandler $shipperHandler)
    {
        $this->security = $security;
        $this->request = $requestStack->getCurrentRequest();
        $this->em = $em;
        $this->logger = $logger;
        $this->addressHandler = $addressHandler;
        $this->shoppingCardHandler = $shoppingCardHandler;
        $this->shipperHandler = $shipperHandler;
    }

    public function createOrderSet()
    {
        /* Ouverture d'une transaction ac la db */
        $this->em->getConnection()->beginTransaction();

        /* Récupération du body de la requête POST */
        $data = json_decode($this->request->getContent());

        /* Gestion de l'adresse de livraison  */
        $address = $this->addressHandler->getDeliveryAddress($data);

        /* Création de l'ensemble de commande */
        $orderSet = new OrderSet();
        /* Date de création de l'ensemble de commande */
        $orderSet->setDateCreated(new \DateTime());
        /* Ajout de l'adresse de livraison à la commande */
        $orderSet->setAddress($address);



        /* Récupération du panier de commande */
        $shoppingCard = $this->shoppingCardHandler->getShoppingCard();

        /* Pour chaque élément du panier de commande, on crée un détail de commande qui sera ensuite intégré à l'ensemble de la commande */
        foreach($shoppingCard->getShoppingCardSupplierProducts() as $item)
        {
            $orderDetail = new OrderDetail();

            $orderDetail->setStatus('pending');
            $orderDetail->setQuantity($item->getQuantity());
            $orderDetail->setUnitCost($item->getSupplierProduct()->getFinalPrice());
            $orderDetail->setTotalCost();
            /* Ajout de la relation au product */
            $orderDetail->setSupplierProduct($item->getSupplierProduct());

            /* Nombre de packet dans l'ensemble de commande */
            $orderSet->setNbPackage($orderSet->getNbPackage() + 1);
            /* Calcul du poids total de l'ensemble de commande */
            $orderSet->setTotalWeight($orderSet->getTotalWeight() + $item->getSupplierProduct()->getProduct()->getWeight());
            $orderSet->addOrderDetail($orderDetail);



        }

        /**/

        /* Récupération de l'expéditeur */
        $shipper = $this->shipperHandler->getShipper($data);
        /* Création d'un ensemble de livraison */
        $deliverySet = new DeliverySet();
        $deliverySet->setDateCreated(new \DateTime());
        /* Calcul du coût d'expédition  */
        $totalShippingCost = 0;


        $deliverySet->setShippingCost($totalShippingCost);

        /* Ajout de l'expéditeur responsable à l'ensemble de commande */
        $deliverySet->setShipper($shipper);
        /* Association de l'ensemble de commande à son ensemble de livraison correspondant */
        $orderSet->setDeliverySet($deliverySet);

        /* Définition de l'ID de session checkout, par défaut "Not started" qui sera modifié lorsqu'une session d'achat sera lancé */
        $orderSet->setSessionId('Not started');

        try{
            $customer = $this->em->getRepository(Customer::class)
                ->findOneBy(['email' => $this->security->getUser()->getUsername()]);

            $orderSet->setCustomer($customer);

            $this->em->persist($orderSet);
            $this->em->flush();

            $this->em->getConnection()->commit();
        }catch (PDOException $exception){
            $this->em->getConnection()->rollBack();
            throw new UserNotFoundException('email', $this->security->getUser()->getUsername());
        }

        return $orderSet;


    }

    public function getOrderSet($data = null)
    {
        if( $data === null)
        {
            $data = json_decode($this->request->getContent());
        }

        dump($data);
        dump($data->sessionId);

        try{
            if($data !== null && isset($data->orderSet))
            {
                $orderSet = $this->em->getRepository(OrderSet::class)
                    ->find($data->orderSet);

                dump($orderSet);
            }


            if($data !== null && isset($data->sessionId) )
            {
                $orderSet = $this->em->getRepository(OrderSet::class)
                    ->findOneBy([ "sessionId" => $data->sessionId ]);

                dump($orderSet);
            }
        }catch (PDOException $exception){
            throw new OrderSetNotFoundException("La commande n'existe pas!");
        }

        return $orderSet;
    }

    public function getOrderSetBySessionId($sessionId): OrderSet
    {
        try{
            $orderSet = $this->em->getRepository(OrderSet::class)
                ->findOneBy(['sessionId'=> $sessionId ]);

            if(!$orderSet)
            {
                throw new OrderSetNotFoundException(sprintf("The order set associated to the checkout session %s does not exist!", $sessionId));
            }

        } catch(PDOException $exception){

            throw new OrderSetNotFoundException(sprintf("The order set associated to the checkout session %s can't be retrieved!", $sessionId));
        }

        dump($orderSet);

        return $orderSet;

    }

    public function getMyOrders()
    {
        $orders = null;
        $user = $this->security->getUser();

        try{
            if($user->getUserType() === 'customer')
            {
                $orders = $this->em->getRepository(OrderSet::class)
                    ->getCustomerOrders($user->getUsername());
            }else {
                $orders = $this->em->getRepository(OrderDetail::class)
                    ->getSupplierOrders($user->getUsername());
            }
        }catch (\Exception $exception){
            $this->logger->error(sprintf("Error while retrieving the user's (%s) order history", $user->getUsername()), ['context' => $exception]);
            throw new RetrieveUserOrdersException(sprintf("Error while retrieving the user's (%s) order history", $user->getUsername()));
        }

        return $orders;
    }
}
