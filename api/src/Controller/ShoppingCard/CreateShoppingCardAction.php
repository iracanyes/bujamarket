<?php


namespace App\Controller\ShoppingCard;

use App\Service\ShoppingCardHandler;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;

class CreateShoppingCardAction
{
    private $shoppingCardHandler;

    public function __construct(ShoppingCardHandler $shoppingCardHandler)
    {
        $this->shoppingCardHandler = $shoppingCardHandler;
    }

    /**
     * @IsGranted("ROLE_CUSTOMER")
     * @return \App\Entity\ShoppingCard
     */
    public function __invoke()
    {

        // Création du panier de commande
        $result = $this->shoppingCardHandler->create();

        return $result;


    }
}
