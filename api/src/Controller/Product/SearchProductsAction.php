<?php


namespace App\Controller\Product;


use App\Service\ProductHandler;

class SearchProductsAction
{
    private $productHandler;

    public function __construct(ProductHandler $productHandler)
    {
        $this->productHandler = $productHandler;
    }

    public function __invoke()
    {
        return $this->productHandler->searchProducts();
    }
}