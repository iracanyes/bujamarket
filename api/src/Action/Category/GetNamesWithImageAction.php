<?php


namespace App\Action\Category;

use App\Domain\CategoryHandler;

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
