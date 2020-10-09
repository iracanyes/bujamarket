<?php


namespace App\Action\SupplierProduct;

use App\Domain\SupplierProductHandler;

class UpdateSupplierProductAction
{
    private $supplierProductHandler;

    public function __construct(SupplierProductHandler $supplierProductHandler)
    {
        $this->supplierProductHandler = $supplierProductHandler;
    }

    public function __invoke()
    {
        return $this->supplierProductHandler->updateSupplierProduct();
    }
}
