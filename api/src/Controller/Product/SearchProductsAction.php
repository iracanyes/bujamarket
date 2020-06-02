<?php

namespace App\Controller\Product;

use App\Entity\Product;
use App\Service\ProductHandler;

class SearchProductsAction
{
    private $productHandler;

    public function __construct(ProductHandler $productHandler)
    {
        $this->productHandler = $productHandler;
    }

    /**
     * @return Product[]|array
     */
    public function __invoke()
    {
        return $this->productHandler->searchProducts();
    }
}
