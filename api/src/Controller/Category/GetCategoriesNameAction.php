<?php


namespace App\Controller\Category;

use App\Service\CategoryHandler;

class GetCategoriesNameAction
{
    private $categoryHandler;

    public function __construct(CategoryHandler $categoryHandler)
    {
        $this->categoryHandler = $categoryHandler;
    }

    public function __invoke()
    {
        return $this->categoryHandler->getNames();
    }
}
