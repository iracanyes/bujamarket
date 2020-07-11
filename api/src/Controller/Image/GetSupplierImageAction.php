<?php
/**
 * Description: Get the profile image (in private directory) of the user authenticated
 * Date: 15/06/2020
 */

namespace App\Controller\Image;

use App\Entity\Image;
use App\Service\ImageHandler;
use Symfony\Component\HttpFoundation\StreamedResponse;

class GetSupplierImageAction
{
    /**
     * @var ImageHandler
     */
    private $imageHandler;

    public function __construct(ImageHandler $imageHandler)
    {
        $this->imageHandler = $imageHandler;
    }

    /**
     * @return StreamedResponse
     */
    public function __invoke(): StreamedResponse
    {
        return $this->imageHandler->getSupplierImage();
    }
}
