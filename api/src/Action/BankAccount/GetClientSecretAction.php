<?php


namespace App\Action\BankAccount;


use App\Domain\BankAccountHandler;

class GetClientSecretAction
{
    /**
     * @var BankAccountHandler $bankAccountHandler
     */
    private $bankAccountHandler;

    public function __construct(BankAccountHandler $bankAccountHandler){
        $this->bankAccountHandler = $bankAccountHandler;
    }

    /**
     * @return string|null
     * @throws \Stripe\Exception\ApiErrorException
     */
    public function __invoke(){
        return $this->bankAccountHandler->getClientSecret();
    }
}
