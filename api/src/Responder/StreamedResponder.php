<?php


namespace App\Responder;


use App\Domain\UploadHandler;
use App\Entity\Image;
use App\Entity\User;
use Symfony\Component\HttpFoundation\HeaderUtils;
use Symfony\Component\HttpFoundation\StreamedResponse;

class StreamedResponder
{
    private $uploadHandler;

    public function __construct(UploadHandler $uploadHandler)
    {
        $this->uploadHandler = $uploadHandler;
    }

    public function getSupplierImage(User $user, Image $image)
    {
        $uploadHandler = $this->uploadHandler;
        dump($image);

        $response =  new StreamedResponse(function () use ($image, $user, $uploadHandler) {
            $outputStream = fopen('php://output', 'wb');
            $fileStream = $uploadHandler->readStreamProfileImage($user, $image->getUrl());

            stream_copy_to_stream($fileStream, $outputStream);
        });

        $response->headers->set('Content-Type', $image->getMimeType());

        $disposition = HeaderUtils::makeDisposition(HeaderUtils::DISPOSITION_ATTACHMENT, $image->getUrl());

        dump($disposition);

        $response->headers->set('Content-Disposition', $disposition);

        dump($response);

        return $response;
    }
}
