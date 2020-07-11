<?php


namespace App\Controller\SupplierProduct;

use App\Service\SupplierProductHandler;

class DeleteAction
{
    private $supplierProductHandler;

    public function __construct(SupplierProductHandler $supplierProductHandler)
    {
        $this->supplierProductHandler = $supplierProductHandler;
    }

    public function __invoke()
    {
        $this->supplierProductHandler->deleteSupplierProduct();
    }
}
