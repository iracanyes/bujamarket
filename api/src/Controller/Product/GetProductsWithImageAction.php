<?php


namespace App\Controller\Product;

use App\Service\ProductHandler;

class GetProductsWithImageAction
{
    private $productHandler;

    public function __construct(ProductHandler $productHandler)
    {
        $this->productHandler = $productHandler;
    }

    public function __invoke()
    {
        return $this->productHandler->getProductsWithImages();
    }

}
