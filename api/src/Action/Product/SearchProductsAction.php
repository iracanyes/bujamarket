<?php

namespace App\Action\Product;

use App\Entity\Product;
use App\Domain\ProductHandler;

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
