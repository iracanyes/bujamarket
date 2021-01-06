<?php


namespace App\Action\Supplier;

use App\Domain\SupplierHandler;
use App\Entity\Supplier;

class SearchSuppliersAction
{
    private $supplierHandler;

    public function __construct(SupplierHandler $supplierHandler)
    {
        $this->supplierHandler = $supplierHandler;
    }

    public function __invoke()
    {
        return $this->supplierHandler->searchSuppliers();
    }
}
