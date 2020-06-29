<?php


namespace App\Service;


use App\Entity\Image;
use App\Entity\User;
use App\Exception\User\MemberNotFoundException;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\HttpFoundation\HeaderUtils;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Security\Core\User\UserInterface;
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

    /**
     * @var Request|null
     */
    private $request;
    /**
     * @var SluggerInterface
     */
    private $slugger;
    /**
     * @var Security
     */
    private $security;

    private $uploadHandler;

    public function __construct(EntityManagerInterface $em, LoggerInterface $logger, RequestStack $request, SluggerInterface $slugger, Security $security, UploadHandler $uploadHandler)
    {
        $this->em = $em;
        $this->logger = $logger;
        $this->request = $request->getCurrentRequest();
        $this->slugger = $slugger;
        $this->security = $security;
        $this->uploadHandler = $uploadHandler;

    }

    /**
     * Upload user profile image to a private repository and save image info into database
     *
     * @param User $user
     * @return User
     */
    public function uploadProfileImage(User $user): User
    {
        /**
         * @var Image
         */
        $image = new Image();

        $uploadedFile = $this->request->files->get("images");
        dump($uploadedFile);

        if(!$uploadedFile instanceof File)
            throw new \Exception("No file to upload");

        $image->setPlace(1);
        $image->setSize($uploadedFile->getSize());

        // Définitions Informations spécifiques aux utilisateurs
        // Déplacement de fichiers dans le répertoire correspondant
        try{
            switch($user->getUserType())
            {
                case "customer":
                case "admin":
                    $filename = $user->getFirstname()."_".uniqid();
                    $safeFilename = $this->slugger->slug($filename).".".$uploadedFile->guessExtension();

                    $image->setTitle($user->getFirstname()."_".$user->getLastname());
                    $image->setAlt($user->getFirstname()."_".$user->getLastname());
                    $image->setUrl($safeFilename);
                    $image->setMimeType($uploadedFile->getMimeType());
                    // Déplacement du fichier image
                    $this->uploadHandler->uploadProfileImage($user, $uploadedFile, $safeFilename);
                    break;
                case "supplier":
                    $filename = $this->request->request->get('brandName')."_".uniqid();
                    $safeFilename = $this->slugger->slug($filename).".".$uploadedFile->guessExtension();


                    $image->setTitle($this->request->request->get('brandName'));
                    $image->setAlt($this->request->request->get('brandName'));
                    $image->setUrl($safeFilename);
                    $image->setMimeType($uploadedFile->getMimeType());

                    // Déplacement du fichier image
                    $this->uploadHandler->uploadProfileImage($user, $uploadedFile, $safeFilename);
                    break;
            }




        }catch (\Exception $e){
            $this->logger->warning("Le chargement de l'image de profil vers le serveur a échoué", ["exception" => $e]);
        }

        if($user->getImage() !== null)
        {
            $this->deleteProfileImage($user);
        }

        $user->setImage($image);

        return $user;
    }

    public function deleteProfileImage(User $user)
    {
        $this->uploadHandler->deleteProfileImage($user);
        $user->setImage(null);
    }


    /**
     * Get the profile's image of the user authenticated and return it as streamed response
     *
     * @return StreamedResponse
     * @throws MemberNotFoundException
     */
    public function getProfileImage(): StreamedResponse
    {

        /**
         * @var UserInterface $user
         */
        $connectedUser = $this->security->getUser();

        $uploadHandler = $this->uploadHandler;

        $user = $this->em->getRepository(User::class)
            ->findOneBy(['email' => $connectedUser->getUsername()]);

        dump($connectedUser);
        dump($user);

        if(!$user instanceof User)
            throw new MemberNotFoundException(sprintf("User '%s' not found in the DB ", $connectedUser->getUsername()));

        $image = $user->getImage();

        $response =  new StreamedResponse(function () use ($image,$user, $uploadHandler) {
            $outputStream = fopen('php://output', 'wb');
            $fileStream = $this->uploadHandler->readStreamProfileImage($user, $image->getUrl());

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
