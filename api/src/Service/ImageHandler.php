<?php


namespace App\Service;


use App\Entity\Image;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class ImageHandler
{
    /**
     * @var EntityManagerInterface $em
     */
    private $em;

    /**
     * @var LoggerInterface $logger
     */
    private $logger;

    private $request;

    private $slugger;

    public function __construct(EntityManagerInterface $em, LoggerInterface $logger, RequestStack $request, SluggerInterface $slugger)
    {
        $this->em = $em;
        $this->logger = $logger;
        $this->request = $request->getCurrentRequest();
        $this->slugger = $slugger;
    }

    public function uploadProfilImage(User $user)
    {
        $image = new Image();

        $uploadedFile = $this->request->files->get("images");
        dump($uploadedFile);
        dump(getenv("UPLOAD_CUSTOMER_IMAGE_DIRECTORY"));
        dump(getenv("UPLOAD_SUPPLIER_IMAGE_DIRECTORY"));


        $image->setPlace(1);
        $image->setSize($uploadedFile->getSize());

        try{
            switch($user->getUserType())
            {
                case "customer":
                    $filename = $user->getFirstname()."_".$user->getLastname()."_".$user->getDateRegistration()->format('YmdHis');
                    $safeFilename = $this->slugger->slug($filename);

                    $image->setTitle($user->getFirstname()."_".$user->getLastname());
                    $image->setAlt($user->getFirstname()."_".$user->getLastname());
                    $image->setUrl($safeFilename.".".$uploadedFile->guessExtension());


                    $uploadedFile->move(getenv("UPLOAD_CUSTOMER_IMAGE_DIRECTORY"), $safeFilename.".".$uploadedFile->guessExtension());
                    break;
                case "supplier":
                    $filename = $this->request->request->get('brandName')."_".$user->getDateRegistration()->format('YmdHis').".".$uploadedFile->guessExtension();
                    $safeFilename = $this->slugger->slug($filename);


                    $image->setTitle($this->request->request->get('brandName'));
                    $image->setAlt($this->request->request->get('brandName'));
                    $image->setUrl($safeFilename);

                    $uploadedFile->move(getenv("UPLOAD_SUPPLIER_IMAGE_DIRECTORY"), $safeFilename.".".$uploadedFile->guessExtension());
                    break;
                case "admin":
                    $filename = $user->getFirstname()."_".$user->getLastname()."_".$user->getDateRegistration()->format('YmdHis').".".$uploadedFile->guessExtension();
                    $safeFilename = $this->slugger->slug($filename);

                    $image->setTitle($user->getFirstname()."_".$user->getLastname());
                    $image->setAlt($user->getFirstname()."_".$user->getLastname());
                    $image->setUrl($safeFilename);

                    $uploadedFile->move(getenv("UPLOAD_ADMIN_IMAGE_DIRECTORY"), $safeFilename.".".$uploadedFile->guessExtension());
                    break;
            }

        }catch (FileException $e){
            $this->logger->warning("Chargement de l'image de profil échoué", [$e]);
        }

        $user->setImage($image);

        return $user;
    }

}
