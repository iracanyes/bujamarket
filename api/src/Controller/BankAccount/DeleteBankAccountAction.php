<?php


namespace App\Controller\BankAccount;

use App\Service\BankAccountHandler;

class DeleteBankAccountAction
{
    /**
     * @var BankAccountHandler
     */
    private $bankAccountHandler;

    public function __construct(BankAccountHandler $bankAccountHandler){
        $this->bankAccountHandler = $bankAccountHandler;
    }

    public function __invoke()
    {
        return $this->bankAccountHandler->deleteBankAccount();
    }
}
