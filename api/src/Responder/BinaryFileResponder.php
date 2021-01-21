<?php


namespace App\Responder;

use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;

class BinaryFileResponder
{
    /**
     * @var LoggerInterface $logger
     */
    private $logger;

    public function __construct(LoggerInterface $logger){
        $this->logger = $logger;
    }

    public function downloadBillCustomer(string $url): BinaryFileResponse
    {
        try{
            $response = new BinaryFileResponse(getenv('PWD').'/'.getenv('DOWNLOAD_BILL_CUSTOMER_DIRECTORY').'/'.$url);

            $response->headers->set('Content-Type', 'application/pdf');

            $response->setContentDisposition(
                ResponseHeaderBag::DISPOSITION_ATTACHMENT,
                $url
            );

            return $response;
        }catch (\Exception $e){
            $this->logger->error("Error while creating binary file response", ['context' => serialize($e)]);
        }
    }
}
