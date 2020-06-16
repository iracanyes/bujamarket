<?php


namespace App\Service;


use App\Entity\Admin;
use App\Entity\Customer;
use App\Entity\Supplier;
use App\Entity\User;
use League\Flysystem\FilesystemInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\StreamedResponse;

class UploadHandler
{
    private $imageProductFilesystem;

    private $imageCategoryFilesystem;

    private $imageCustomerFilesystem;

    private $imageSupplierFilesystem;

    private $imageAdminFilesystem;

    private $logger;

    public function __construct(
        FilesystemInterface $publicImageProductFilesystem,
        FilesystemInterface $publicImageCategoryFilesystem,
        FilesystemInterface $privateImageCustomerFilesystem,
        FilesystemInterface $privateImageSupplierFilesystem,
        FilesystemInterface $privateImageAdminFilesystem,
        LoggerInterface $logger
    )
    {
        $this->imageProductFilesystem = $publicImageProductFilesystem;
        $this->imageCategoryFilesystem = $publicImageCategoryFilesystem;
        $this->imageCustomerFilesystem = $privateImageCustomerFilesystem;
        $this->imageSupplierFilesystem = $privateImageSupplierFilesystem;
        $this->imageAdminFilesystem = $privateImageAdminFilesystem;
        $this->logger = $logger;
    }

    public function uploadProfileImage(User $user, UploadedFile $file,string $filename)
    {
        try{
            // Open stream
            $stream = fopen($file->getPathname(), 'r');

            $result = true;

            switch ($user->getUserType())
            {
                case "customer":
                    $result = $this->imageCustomerFilesystem->writeStream('./'.$filename, $stream);
                    break;
                case "supplier":

                    $result = $this->imageSupplierFilesystem->writeStream('./'.$filename, $stream);
                    break;
                case "admin":
                    $result = $this->imageAdminFilesystem->writeStream('./'.$filename, $stream);
                    break;
            }


            if($result === false)
                throw new \Exception(sprintf('Could not write uploaded file "%s"', $filename));

            // If stream not closed
            if(is_resource($stream))
                fclose($stream);

        }catch(\Exception $e){
            $this->logger->error($e->getMessage(), ['context' => $e]);
        }

    }

    public function readStreamProfileImage(User $user, string $filename)
    {
        $resource = null;

        try{
            switch (true)
            {
                case $user instanceof Customer:
                    $resource = $this->imageCustomerFilesystem->readStream('./'.$filename);
                    break;
                case $user instanceof Supplier:
                    $resource = $this->imageSupplierFilesystem->readStream('./'.$filename);
                    break;
                case $user instanceof Admin:
                    $resource = $this->imageAdminFilesystem->readStream('./'.$filename);
                    break;
            }

            if($resource === false)
                throw new \Exception(sprintf('Error opening stream for "%s"', $filename));

        }catch (\Exception $e){
            $this->logger->error($e->getMessage(), ['exception' => $e]);
        }

        dump($resource);

        return $resource;

    }
}
