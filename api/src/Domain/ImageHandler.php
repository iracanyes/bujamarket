<?php


namespace App\Domain;


use App\Entity\Comment;
use App\Entity\Image;
use App\Entity\Supplier;
use App\Entity\SupplierProduct;
use App\Entity\User;
use App\Exception\SupplierProduct\SupplierProductImagesDeleteException;
use App\Exception\User\MemberNotFoundException;
use App\Responder\StreamedResponder;
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
use App\Exception\Image\UploadImageException;
use App\Exception\Image\ImagePersistException;

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

    /**
     * @var UploadHandler
     */
    private $uploadHandler;

    /**
     * @var StreamedResponder
     */
    private $streamedResponder;

    public function __construct(
        EntityManagerInterface $em,
        LoggerInterface $logger,
        RequestStack $request,
        SluggerInterface $slugger,
        Security $security,
        UploadHandler $uploadHandler,
        StreamedResponder $streamedResponder
    )
    {
        $this->em = $em;
        $this->logger = $logger;
        $this->request = $request->getCurrentRequest();
        $this->slugger = $slugger;
        $this->security = $security;
        $this->uploadHandler = $uploadHandler;
        $this->streamedResponder = $streamedResponder;

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

    public function uploadCategoryImage(Image $image,string $filename = "", UploadedFile $imageFile)
    {

        if($imageFile && !empty($filename))
        {
            $safeFilename = transliterator_transliterate('Any-Latin; Latin-ASCII; [^A-Za-z0-9_] remove; Lower()', $filename);
            $newFilename = $safeFilename.'-'.uniqid("_", true).'.'.$imageFile->guessExtension();

            try{
                $image->setUrl($newFilename);
                $image->setMimeType($imageFile->getMimeType());
                $imageFile->move(getenv("UPLOAD_CATEGORY_IMAGE_DIRECTORY"), $newFilename);
            }catch (FileException $exception){
                return new UploadImageException(sprintf("Code: %d.\nMessage: %s", $exception->getCode(), $exception->getMessage()));
            }


            try{
                $this->em->persist($image);
            }catch (\Exception $exception){
                $this->em->rollback();
                throw new ImagePersistException(sprintf("Category image can't be persisted!"));
            }


        }
    }

    /**
     * Delete Profile image
     *
     * @param User $user
     */
    public function deleteProfileImage(User $user)
    {
        $this->uploadHandler->deleteProfileImage($user);
        $user->setImage(null);
    }

    public function deleteSupplierProductImages(SupplierProduct $supplierProduct)
    {
        try{
            foreach($supplierProduct->getImages() as $image)
            {
                $this->uploadHandler->deleteSupplierProductImage($image);
                $this->em->remove($image);
            }

            $this->em->flush();
        }catch (\Exception $exception){
            $this->logger->error("Error while deleting supplier product images'", ['context' => $exception] );
            throw new SupplierProductImagesDeleteException(sprintf("Error while deleting supplier product images'"));
        }


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


        if(!$user instanceof User)
            throw new MemberNotFoundException(sprintf("User '%s' not found in the DB ", $connectedUser->getUsername()));

        $image = $user->getImage();

        $response =  new StreamedResponse(function () use ($image,$user, $uploadHandler) {
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

    /**
     * @return StreamedResponse
     */
    public function getSupplierImage(): StreamedResponse
    {
        $id = $this->request->attributes->get('id');
        $uploadHandler = $this->uploadHandler;
        $user = $this->security->getUser();

        try{
            $supplier = $this->em->getRepository(Supplier::class)->find($id);

            if(!$supplier instanceof Supplier)
                throw new MemberNotFoundException('Supplier not found!');

            return $this->streamedResponder->getSupplierImage($supplier, $supplier->getImage());

        }catch (\Exception $exception){
            $this->logger->error(
                sprintf("Error while retrieving Image id=%d", $id),
                ['context' => $exception]
            );

        }



    }

    public function getCommentCustomerImage()
    {
        // comment id
        $id = $this->request->attributes->get('id');
        dump($id);

        try{
            $comment = $this->em->getRepository(Comment::class)
                ->getCustomerImage((int) $id);

            dump($comment);

            return $this->streamedResponder->getSupplierImage($comment->getCustomer(), $comment->getCustomer()->getImage());
        }catch (\Exception $e){
            $this->logger->error($e->getMessage(), ['context' => $e]);
        }
    }

    /**
     * @param Image $image
     */
    public function setSupplierProductPublicDirectory(Image $image)
    {
        if(substr($image->getUrl(), 0, 8) !== 'https://'){
            $image->setUrl(getenv('API_ENTRYPOINT')."/".getenv("UPLOAD_SUPPLIER_PRODUCT_IMAGE_DIRECTORY")."/".$image->getUrl());
        }

    }

    public function setProductImagePublicDirectory(array $product)
    {
        if(substr($product['url'], 0, 8) !== 'https://'){
            $product['url'] = getenv('API_ENTRYPOINT').'/'.getenv('UPLOAD_SUPPLIER_PRODUCT_IMAGE_DIRECTORY')."/".$product['url'];
        }
    }

    public function setCategoryImagePublicDirectory($category)
    {
        if(substr($category->getImage()->getUrl(), 0, 8) !== 'https://'){
            $category->getImage()->setUrl( getenv("API_ENTRYPOINT").'/'.getenv("UPLOAD_CATEGORY_IMAGE_DIRECTORY").'/'.$category->getImage()->getUrl());
        }
    }

    public function setCommentCustomerImagePublicDirectory($comment){
        $comment['url'] = getenv("API_ENTRYPOINT").'/'.getenv("UPLOAD_CUSTOMER_IMAGE_DIRECTORY").'/'.$comment['url'];
    }
}
