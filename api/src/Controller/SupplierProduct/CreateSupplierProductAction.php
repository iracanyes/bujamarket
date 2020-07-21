<?php


namespace App\Controller\SupplierProduct;


use App\Service\SupplierProductHandler;

ini_set('upload_max_filesize', '2M');
ini_set('post_max_size', '15M');

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
