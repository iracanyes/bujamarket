<?php


namespace App\Action\User;

use App\Domain\GoogleUserHandler;
use Symfony\Component\HttpFoundation\JsonResponse;

class GoogleUserRegisterAction
{
    private $googleUserHandler;

    public function __construct(GoogleUserHandler $googleUserHandler)
    {
        $this->googleUserHandler =$googleUserHandler;
    }

    public function __invoke(): JsonResponse
    {
        return $this->googleUserHandler->register();
    }
}
