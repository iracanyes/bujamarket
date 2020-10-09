<?php


namespace App\Action\Product;

use App\Domain\SupplierProductHandler;

class GetProductSuppliersAction
{
    private $supplierProductHandler;

    public function __construct(SupplierProductHandler $supplierProductHandler)
    {
        $this->supplierProductHandler = $supplierProductHandler;
    }

    public function __invoke()
    {
        return $this->supplierProductHandler->getProductSuppliers();
    }
}
