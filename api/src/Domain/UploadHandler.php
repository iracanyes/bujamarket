<?php


namespace App\Domain;


use App\Entity\Admin;
use App\Entity\Customer;
use App\Entity\Supplier;
use App\Entity\User;
use App\Entity\Image;
use League\Flysystem\FilesystemInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\StreamedResponse;
use App\Exception\Image\DeleteImageException;

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
            $this->logger->error(
                "Category image can't be persisted!",
                [
                    'code' => $e->getCode(),
                    'message' => $e->getMessage(),
                    'line' => $e->getLine(),
                    'trace' => $e->getTraceAsString()
                ]
            );
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
            $this->logger->error($e->getMessage(), ['context' => $e]);
        }

        return $resource;

    }

    public function deleteProfileImage(User $user): void
    {
        try{
            switch ($user->getUserType()){
                case "customer":
                    $this->imageCustomerFilesystem->delete('/'.$user->getImage()->getUrl());
                    break;
                case "supplier" :
                    $this->imageSupplierFilesystem->delete('/'.$user->getImage()->getUrl());
                    break;
                case "admin" :
                    $this->imageAdminFilesystem->delete('/'.$user->getImage()->getUrl());
                    break;
            }
        }catch(\Exception $exception){
            $this->logger->error($exception->getMessage(), ['context' => $exception]);
            throw new DeleteImageException(sprintf('Unable to delete profile image %s', $user->brandName()));
        }



    }

    public function deleteSupplierProductImage(Image $image): void
    {
        try{
            $this->imageProductFilesystem->delete('/'.$image->getUrl());
        }catch (\Exception  $e){
            $this->logger->error($e->getMessage(), ['context' => $e]);
        }

    }
}
