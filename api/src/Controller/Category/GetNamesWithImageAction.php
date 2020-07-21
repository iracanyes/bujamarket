<?php


namespace App\Controller\Category;

use App\Service\CategoryHandler;

class GetNamesWithImageAction
{
    private $categoryHandler;

    public function __construct(CategoryHandler $categoryHandler)
    {
        $this->categoryHandler = $categoryHandler;
    }

    public function __invoke()
    {
        return $this->categoryHandler->getNamesWithImage();
    }
}
