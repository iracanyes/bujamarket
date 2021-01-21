<?php


namespace App\Domain;

use App\Entity\Bill;
use App\Responder\BinaryFileResponder;
use League\Flysystem\FilesystemInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\HttpFoundation\StreamedResponse;


class DownloadHandler
{
    /**
     * @var FilesystemInterface
     */
    private $privateBillCustomerFilesystem;

    /**
     * @var BinaryFileResponder
     */
    private $binaryFileResponder;


    /**
     * @var LoggerInterface $logger
     */
    private $logger;

    public function __construct(FilesystemInterface $privateBillCustomerFilesystem, BinaryFileResponder $binaryFileResponder, LoggerInterface $logger)
    {
        $this->privateBillCustomerFilesystem = $privateBillCustomerFilesystem;
        $this->binaryFileResponder = $binaryFileResponder;
        $this->logger = $logger;
    }

    public function movePdfToDirectory(string $filename, $pdf)
    {
        try{
            if(!$this->privateBillCustomerFilesystem->write('./'.$filename, $pdf))
            {
                throw new \Exception("Error while moving a bill customer to directory!");
            }
        }catch (\Exception $e){
            $this->logger->error(
                "Error while writing the pdf to directory",
                [
                    'code' => $e->getCode(),
                    'message' => $e->getMessage(),
                    'line' => $e->getLine(),
                    'trace' => $e->getTraceAsString()
                ]
            );
        }
    }

    /**
     * @param Bill $bill
     * @return BinaryFileResponse
     */
    public function getBillCustomer(Bill $bill)
    {
        return $this->binaryFileResponder->downloadBillCustomer($bill->getUrl());
    }
}
