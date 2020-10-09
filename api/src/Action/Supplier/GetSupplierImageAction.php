<?php


namespace App\Action\Supplier;

use App\Domain\SupplierHandler;
use App\Entity\Supplier;

class GetSupplierImageAction
{
    private $supplierHandler;

    public function __construct(SupplierHandler $supplierHandler)
    {
        $this->supplierHandler = $supplierHandler;
    }

    public function __invoke(Supplier $supplier)
    {
        return $this->supplierHandler->getSupplierImage($supplier);
    }
}
