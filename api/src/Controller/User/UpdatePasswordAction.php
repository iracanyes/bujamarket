<?php

namespace App\Controller\User;

use App\Service\MemberHandler;

class UpdatePasswordAction
{
    private $memberHandler;

    public function __construct(MemberHandler $memberHandler)
    {
        $this->memberHandler = $memberHandler;
    }

    public function __invoke()
    {
        $this->memberHandler->updatePassword();
    }

}