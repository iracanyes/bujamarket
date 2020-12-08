<?php


namespace App\Action\User;

use App\Domain\GoogleUserHandler;

class GoogleUserAuthenticationAction
{
    private $googleUserHandler;

    public function __construct(GoogleUserHandler $googleUserHandler)
    {
        $this->googleUserHandler =$googleUserHandler;
    }

    public function __invoke()
    {
        return $this->googleUserHandler->authentication();
    }
}
