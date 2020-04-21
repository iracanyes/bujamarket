<?php


namespace App\Controller\ShoppingCart;

use App\Service\ShoppingCartHandler;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;

class CreateShoppingCartAction
{
    private $shoppingCartHandler;

    public function __construct(ShoppingCartHandler $shoppingCartHandler)
    {
        $this->shoppingCartHandler = $shoppingCartHandler;
    }

    /**
     * @IsGranted("ROLE_CUSTOMER")
     * @return \App\Entity\ShoppingCart
     */
    public function __invoke()
    {

        // Création du panier de commande
        $result = $this->shoppingCartHandler->create();

        return $result;


    }
}
