<?php


namespace App\Action\User;

use App\Entity\UserTemp;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use App\Domain\MemberHandler;

class GetUserTempAction
{
    private $memberHandler;

    public function __construct(MemberHandler $memberHandler)
    {
        $this->memberHandler = $memberHandler;
    }

    public function __invoke()
    {
        // Récupération de l'entité UserTemp par son token
        $user =  $this->memberHandler->getUserTemp();

        /* On retourne l'objet pour qu'il passe dans le system d'Event */
        return $user;
    }
}
