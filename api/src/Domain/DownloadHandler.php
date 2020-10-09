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

    public function __construct(FilesystemInterface $privateBillCustomerFilesystem, BinaryFileResponder $binaryFileResponder)
    {
        $this->privateBillCustomerFilesystem = $privateBillCustomerFilesystem;
        $this->binaryFileResponder = $binaryFileResponder;
    }

    public function movePdfToDirectory(string $filename, $pdf)
    {
        try{
            if(!$this->privateBillCustomerFilesystem->write('./'.$filename, $pdf))
            {
                throw new \Exception("Error while moving a bill customer to directory!");
            }
        }catch (\Exception $e){

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
