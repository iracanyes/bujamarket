<?php
/**
 * Description: Get the profile image (in private directory) of the user authenticated
 * Date: 15/06/2020
 */

namespace App\Action\Image;

use App\Entity\Image;
use App\Domain\ImageHandler;
use Symfony\Component\HttpFoundation\StreamedResponse;

class GetProfileImageAction
{
    private $imageHandler;

    public function __construct(ImageHandler $imageHandler)
    {
        $this->imageHandler = $imageHandler;
    }

    /**
     * @return StreamedResponse
     * @throws \App\Exception\User\MemberNotFoundException
     */
    public function __invoke(): StreamedResponse
    {
        return $this->imageHandler->getProfileImage();
    }
}
