<?php


namespace App\Action\User;

use App\Domain\MemberHandler;

class DeleteUserAction
{
    /**
     * @var MemberHandler
     */
    private $memberHandler;

    public function __construct(MemberHandler $memberHandler)
    {
        $this->memberHandler = $memberHandler;
    }

    /**
     * @return array
     * @throws \App\Exception\User\DeleteUserException
     * @throws \App\Exception\User\MemberNotFoundException
     */
    public function __invoke()
    {
        return $this->memberHandler->deleteUser();
    }
}
