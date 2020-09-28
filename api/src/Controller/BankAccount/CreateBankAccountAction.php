<?php


namespace App\Controller\BankAccount;

use App\Service\BankAccountHandler;

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
