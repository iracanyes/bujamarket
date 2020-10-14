<?php


namespace App\Domain;



use App\Entity\Category;
use App\Entity\Image;
use App\Exception\Category\CategoryNotFoundException;
use App\Exception\Category\CategoryPersistException;
use App\Exception\Category\RetrieveCategoriesException;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use App\Responder\JsonResponder;

class CategoryHandler
{
    /**
     * @var EntityManagerInterface $em
     */
    private $em;
    /**
     * @var ImageHandler $imageHandler
     */
    private $imageHandler;

    /**
     * @var LoggerInterface $logger
     */
    private $logger;

    /**
     * @var JsonResponder
     */
    private $jsonResponder;

    public function __construct(EntityManagerInterface $em, LoggerInterface $logger, ImageHandler $imageHandler, JsonResponder $jsonResponder)
    {
        $this->em = $em;
        $this->logger = $logger;
        $this->imageHandler = $imageHandler;
        $this->jsonResponder = $jsonResponder;
    }


    public function getNames()
    {
        $categories_names = $this->em->getRepository(Category::class)
                                        ->getNames();

        return $this->jsonResponder->success($categories_names);
    }

    public function getNamesWithImage()
    {
        try{
            $categories = $this->em->getRepository(Category::class)
                ->getNamesWithImage();
        }catch(\Exception $exception){
            $this->logger->error("Error while retrieving categories' of product!", ['context' => $exception]);
            throw new RetrieveCategoriesException("Error while retrieving categories' of product!");
        }


        $myCategories = [];
        /* Mise à jour de l'emplacement du fichier image */
        foreach($categories as $category)
        {
            $category['url'] = getenv('API_ENTRYPOINT').'/'.getenv('UPLOAD_CATEGORY_IMAGE_DIRECTORY').'/'.$category['url'];

            array_push($myCategories, $category);
        }

        return $this->jsonResponder->success([
            '@context' => '/contexts/Category',
            'hydra:member' => $myCategories
        ]);

    }

    public function persistNewCategory(array $data = [], $file): Category
    {

        // Nouvelle catégorie
        $category = new Category();
        $category->setName($data["name"]);
        $category->setDescription($data["description"]);
        $category->setDateCreated(new \DateTimeImmutable());
        $category->setIsValid(false);
        $category->setPlatformFee(0.1);

        // Image de la catégorie
        $image = new Image();
        $image->setTitle($data['name']);
        $image->setAlt($data['name']);
        $image->setPlace(1);
        $image->setSize($file->getSize());

        try{
            // Déplacement du fichier image de la catégorie dans le répertoire public associé
            $this->imageHandler->uploadCategoryImage($image, $data["name"], $file);
            $category->setImage($image);

            $this->em->persist($category);
            $this->em->flush();
        }catch (\Exception $exception){
            $this->logger->error(sprintf("Category %s can't be persisted!", $category->getName()), ['context' => $exception]);
            throw new CategoryPersistException(sprintf("Error while persisting the category %s !", $category->getName()));
        }

        return $category;

    }

    public function updateExistingCategory(array $data = [])
    {
        $idCateg = (int) $data["id"] ;

        try{
            $category = $this->em->getRepository(Category::class)
                ->find($idCateg);

            if(!$category instanceof Category)
                throw new CategoryNotFoundException(sprintf("Category (%d) not found!", $idCateg));

            if(!empty($data["name"]))
            {
                $category->setName($data["name"])
                    ->setDescription($data["description"]);

                $this->em->persist($category);
                $this->em->flush();
            }


        }catch (\Exception $exception){
            $this->em->rollback();
            return new CategoryNotFoundException(sprintf("Category with id %d not found!", $idCateg));
        }

        return $category;
    }

}
