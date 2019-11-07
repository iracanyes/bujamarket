<?php


namespace App\Controller\SupplierProduct;

use App\Service\SupplierProductHandler;

class CreateSupplierProductAction
{
    private $supplierProductHandler;

    public function __construct(SupplierProductHandler $supplierProductHandler)
    {
        $this->supplierProductHandler = $supplierProductHandler;
    }

    public function __invoke()
    {
        return $this->supplierProductHandler->createSupplierProduct();
    }
}
