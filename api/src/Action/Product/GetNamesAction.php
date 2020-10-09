<?php


namespace App\Action\Product;

use App\Domain\ProductHandler;

class GetNamesAction
{

    private $productHandler;

    public function __construct(ProductHandler $productHandler)
    {
        $this->productHandler = $productHandler;
    }

    public function __invoke()
    {
        return $this->productHandler->getNames();

    }
}
