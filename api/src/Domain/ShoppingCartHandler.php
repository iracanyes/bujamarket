<?php


namespace App\Domain;


use App\Entity\Customer;
use App\Entity\ShoppingCartDetail;
use App\Entity\SupplierProduct;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityNotFoundException;
use Lexik\Bundle\JWTAuthenticationBundle\Exception\UserNotFoundException;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\Security;

class ShoppingCartHandler
{
    /**
     * @var EntityManagerInterface $em
     */
    private $em;

    /**
     * @var \Symfony\Component\HttpFoundation\Request|null
     */
    private $request;

    /**
     * @var Security
     */
    private $security;

    /**
     * @var LoggerInterface $logger
     */
    private $logger;

    public function __construct(EntityManagerInterface $em, RequestStack $requestStack, Security $security, LoggerInterface $logger)
    {
        $this->em = $em;
        $this->security = $security;
        $this->request = $requestStack->getCurrentRequest();
        $this->logger = $logger;

    }

    public function create()
    {
        /* Récupération des données de la requête */
        $data = $this->request->getContent();

        /* Utilisateur authentifié */
        $customer = $this->security->getUser();


        $data = json_decode($data);

        // Avant création du panier de commande on supprime le panier de commande précédent
        if($customer instanceof Customer){
            foreach($customer->getShoppingCartDetails() as $shoppingCartDetail){
                $this->em->remove($shoppingCartDetail);
            }
            $customer->getShoppingCartDetails()->clear();
            $this->em->persist($customer);
            $this->em->flush();
        }else{
            throw new UserNotFoundException(`Customer (username=${$this->security->getUser()->getUsername()}) doesn't exist.`, 404);
        }

        try{
            foreach ($data as $item)
            {
                /* Récupération du produit  */
                $supplier_product =  $this->em->getRepository(SupplierProduct::class)
                    ->getSupplierProductWithProductInfo((int) $item->productId);


                if($supplier_product instanceof SupplierProduct )
                {
                    // Ajout du produit en tant que nouvel élément du panier de commande
                    $shopping_cart_supplier_product = new ShoppingCartDetail();
                    $shopping_cart_supplier_product->setDateCreated(new \DateTime())
                        ->setSupplierProduct($supplier_product)
                        ->setQuantity($item->quantity);
                    // Relation shopping cart supplier product - customer
                    $shopping_cart_supplier_product->setCustomer($customer);
                    // Sauvegarde
                    $this->em->persist($shopping_cart_supplier_product);
                    $this->em->flush();

                    // Ajout dans le panier de commande du client
                    $customer->addShoppingCartDetail($shopping_cart_supplier_product);

                }else{
                    throw new EntityNotFoundException(`Supplier product (id=${$item->productId}) doesn't exist.`, 404);
                }
            }

        }catch (\Exception $exception){
            $this->logger->error($exception->getMessage(), ['context' => $exception]);
        }


        return $customer->getShoppingCartDetails();

    }

    public function getShoppingCartDetails()
    {
        $customer = $this->security->getUser();

        try{
            if($customer instanceof Customer){
                $shoppingCartDetails = $this->em->getRepository(ShoppingCartDetail::class)
                    ->findBy(['customer' => $customer]);
            }

        }catch (\Exception $exception){
            throw new UserNotFoundException("email", $this->security->getUser()->getUsername() );
        }


        return $customer->getShoppingCartDetails();
    }

}
