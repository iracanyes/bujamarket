<?php


namespace App\Controller\User;

use App\Service\MemberHandler;

class UpdateProfileAction
{
    private $memberHandler;

    public function __construct(MemberHandler $memberHandler)
    {
        $this->memberHandler = $memberHandler;
    }

    public function __invoke()
    {
        return $this->memberHandler->updateProfile();
    }
}
