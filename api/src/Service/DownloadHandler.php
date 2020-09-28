<?php


namespace App\Service;

use App\Entity\Bill;
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

    public function __construct(FilesystemInterface $privateBillCustomerFilesystem)
    {
        $this->privateBillCustomerFilesystem = $privateBillCustomerFilesystem;
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
        $response = new BinaryFileResponse(getenv('DOCUMENT_ROOT').'/../'.getenv('DOWNLOAD_BILL_CUSTOMER_DIRECTORY').'/'.$bill->getUrl());

        $response->headers->set('Content-Type', 'application/pdf');

        $response->setContentDisposition(
            ResponseHeaderBag::DISPOSITION_ATTACHMENT,
            $bill->getUrl()
        );

        return $response;
    }
}
