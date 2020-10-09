<?php


namespace App\Action\User;

use App\Entity\User;
use App\Domain\MemberHandler;


class SubscribeMemberAction
{
    private $memberHandler;

    public function __construct(MemberHandler $memberHandler)
    {
        $this->memberHandler = $memberHandler;
    }

    public function __invoke()
    {
        /* Enregistrement du nouveau membre */
        $user = $this->memberHandler->subscribe();

        /* Retourner le nouvel utilisateur */
        return $user;
    }
}
