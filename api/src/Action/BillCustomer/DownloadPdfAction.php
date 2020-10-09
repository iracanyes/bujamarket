<?php


namespace App\Action\BillCustomer;

use App\Domain\BillCustomerHandler;

class DownloadPdfAction
{
    private $billCustomerHandler;

    public function __construct(BillCustomerHandler $billCustomerHandler)
    {
        $this->billCustomerHandler = $billCustomerHandler;
    }

    public function __invoke()
    {
        return $this->billCustomerHandler->downloadPdf();
    }
}
