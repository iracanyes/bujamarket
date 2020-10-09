<?php


namespace App\Action\BankAccount;

use App\Domain\BankAccountHandler;

class CreateBankAccountAction
{
    private $bankAccountHandler;

    public function __construct(BankAccountHandler $bankAccountHandler)
    {
        $this->bankAccountHandler = $bankAccountHandler;
    }

    public function __invoke()
    {
        return $this->bankAccountHandler->createBankAccount();
    }
}
