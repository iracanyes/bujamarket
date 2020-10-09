<?php


namespace App\Action\Image;

use App\Domain\ImageHandler;

class GetCommentCustomerImageAction
{
    private $imageHandler;

    public function __construct(ImageHandler $imageHandler)
    {
        $this->imageHandler = $imageHandler;
    }

    public function __invoke()
    {
        return $this->imageHandler->getCommentCustomerImage();
    }
}
