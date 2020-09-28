<?php


namespace App\Controller\Product;

use App\Service\SupplierProductHandler;

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
