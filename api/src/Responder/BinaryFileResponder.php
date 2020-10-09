<?php


namespace App\Responder;


use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;

class BinaryFileResponder
{
    public function downloadBillCustomer(string $url): BinaryFileResponse
    {
        $response = new BinaryFileResponse(getenv('DOCUMENT_ROOT').'/../'.getenv('DOWNLOAD_BILL_CUSTOMER_DIRECTORY').'/'.$url);

        $response->headers->set('Content-Type', 'application/pdf');

        $response->setContentDisposition(
            ResponseHeaderBag::DISPOSITION_ATTACHMENT,
            $url
        );

        return $response;
    }
}
