<?php


namespace App\Service;

use App\Entity\OrderDetail;
use App\Entity\OrderSet;
use App\Entity\Customer;
use Doctrine\DBAL\Driver\PDOException;
use Lexik\Bundle\JWTAuthenticationBundle\Exception\UserNotFoundException;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\Security;
use Doctrine\ORM\EntityManagerInterface;

class OrderSetHandler
{
    private $security;

    private $request;

    private $em;

    private $addressHandler;

    private $shoppingCardHandler;

    public function __construct(Security $security, RequestStack $requestStack, EntityManagerInterface $em, AddressHandler $addressHandler, ShoppingCardHandler $shoppingCardHandler)
    {
        $this->security = $security;
        $this->request = $requestStack->getCurrentRequest();
        $this->em = $em;
        $this->addressHandler = $addressHandler;
        $this->shoppingCardHandler = $shoppingCardHandler;
    }

    public function createOrderSet()
    {
        /* Ouverture d'une transaction ac la db */
        $this->em->getConnection()->beginTransaction();

        /* Gestion de l'adresse de livraison  */
        $address = $this->addressHandler->handleDeliveryAddress();

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
}
