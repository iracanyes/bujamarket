<?php


namespace App\Action\User;

use App\Domain\MemberHandler;

class UnsubscribeAction
{
    private $memberHandler;

    public function __construct(MemberHandler $memberHandler)
    {
        $this->memberHandler = $memberHandler;
    }

    /**
     * Unsubscribe from this platform
     * @return \Symfony\Component\Security\Core\User\UserInterface
     * @throws \App\Exception\User\MemberNotFoundException
     */
    public function __invoke()
    {
        return $this->memberHandler->unsubscribe();
    }
}
