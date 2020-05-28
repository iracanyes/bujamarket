<?php


namespace App\Service;


use App\Entity\Customer;
use App\Entity\ShoppingCartDetail;
use App\Entity\SupplierProduct;
use App\Entity\User;
use Doctrine\DBAL\Driver\PDOException;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityNotFoundException;
use Lexik\Bundle\JWTAuthenticationBundle\Exception\UserNotFoundException;
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

    public function __construct(EntityManagerInterface $em, RequestStack $requestStack, Security $security)
    {
        $this->em = $em;
        $this->security = $security;
        $this->request = $requestStack->getCurrentRequest();

    }

    public function create()
    {
        /* Récupération des données de la requête */
        $data = $this->request->getContent();
        dump($data);
        $data = json_decode($data);



        try{
            foreach ($data as $item)
            {
                /* Récupération du produit  */
                $supplier_product =  $this->em->getRepository(SupplierProduct::class)
                    ->find($item->productId);

                /* Récupération du client */
                $customer = $this->em->getRepository(Customer::class)
                    ->findOneBy(['email' => $this->security->getUser()->getUsername()]);

                dump($customer);



                if($supplier_product !== null )
                {
                    /* Ajout du produit en tant que nouvel élément du panier de commande */
                    $shopping_cart_supplier_product = new ShoppingCartDetail();
                    $shopping_cart_supplier_product->setSupplierProduct($supplier_product);
                    $shopping_cart_supplier_product->setQuantity($item->quantity);

                    if($customer !== null)
                    {
                        $customer->addShoppingCartDetail($shopping_cart_supplier_product);
                        $this->em->persist($customer);
                    }else{
                        throw new UserNotFoundException(`Customer (username=${$this->security->getUser()->getUsername()}) doesn't exist.`, 404);
                    }
                }else{
                    throw new EntityNotFoundException(`Supplier product (id=${$item->productId}) doesn't exist.`, 404);
                }

            }


            $this->em->flush();

        }catch (\Exception $exception){
            ;
        }


        return $customer->getShoppingCart();

    }

    public function getShoppingCart()
    {
        try{
            $customer = $this->em->getRepository(Customer::class)
                ->findOneBy(['email' => $this->security->getUser()->getUsername()]);
        }catch (PDOException $exception){
            throw new UserNotFoundException("email", $this->security->getUser()->getUsername() );
        }


        return $customer->getShoppingCartDetails();
    }

}