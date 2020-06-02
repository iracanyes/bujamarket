<?php


namespace App\Service;

use App\Entity\Category;
use App\Entity\Image;
use App\Entity\Product;
use App\Entity\Supplier;
use App\Entity\SupplierProduct;
use App\Exception\Category\CategoryNotFoundException;
use App\Exception\Category\CategoryPersistException;
use App\Exception\Image\ImagePersistException;
use App\Exception\Image\UploadImageException;
use App\Exception\Product\ProductNotFoundException;
use App\Exception\Supplier\SupplierNotFoundException;
use App\Exception\SupplierProduct\SupplierProductPersistException;
use Doctrine\DBAL\Driver\PDOException;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\Security\Core\Security;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RequestStack;

class SupplierProductHandler
{
    /**
     * @var Security $security
     */
    private $security;

    /**
     * @var \Symfony\Component\HttpFoundation\Request|null $request
     */
    private $request;

    /**
     * @var EntityManagerInterface $em
     */
    private $em;

    /**
     * @var ContainerInterface $container
     */
    private $container;

    public function __construct(RequestStack $requestStack, Security $security, EntityManagerInterface $em, ContainerInterface $container)
    {
        $this->request = $requestStack->getCurrentRequest();
        $this->security = $security;
        $this->em = $em;
        $this->container = $container;


    }

    public function createSupplierProduct()
    {
        /* Récupération des données du formulaire */
        $data = $this->request->request->all();
        /* Récupération des fichiers envoyés ac le formulaire */
        $files = $this->request->files->all();

        /* Démarrage de la session de transaction ac la db */
        $this->em->beginTransaction();

        dump($data);
        dump($files);
        dump($this->request);

        $supplierProduct = new SupplierProduct();

        /* Ajout des informations fournisseurs sur le produit */
        $supplierProduct->setIsAvailable(isset($data['isAvailable']) && $data['isAvailable'] === "on" ? true : false);
        $supplierProduct->setInitialPrice((float) $data['initialPrice']);
        $supplierProduct->setIsLimited(isset($data['isLimited']) && $data['isLimited'] === "on" ? true : false );
        $supplierProduct->setRating(5.0);



        if($supplierProduct->getIsLimited())
        {
            $supplierProduct->setQuantity((int) $data['quantity']);
        }

        $supplierProduct->setAdditionalInformation($data['additionalInformation']);
        $supplierProduct->setAdditionalFee((((float)$data['additionalFee'] )/ 100));

        /* Ajout des informations du produits */
        if(isset($data["product"]["id"]) && $data["product"]["id"] !== "")
        {
            try{
                $product = $this->em->getRepository(Product::class)
                    ->find((int) $data["product"]["id"]);
            }catch (PDOException $exception){
                return new ProductNotFoundException(sprintf("The product with the id %s not found!", $data["product"]["id"]));
            }



        }else{
            // Nouveau produit
            $product = new Product();

            $product->setTitle($data['product']['title']);
            $product->setResume($data['product']['resume']);
            $product->setDescription($data['product']['description']);
            $product->setHeight((float) $data['product']['height']);
            $product->setLength((float) $data['product']['length']);
            $product->setWeight((float) $data['product']['weight']);
            $product->setWidth((float) $data['product']['width']);
            $product->setCountryOrigin($data['product']['countryOrigin']);


            // Category du produit
            if(isset($data["product"]["category"]["id"]) && $data["product"]["category"]["id"] !== "")
            {
                $idCateg = (int) $data["product"]["category"]["id"] ;

                try{
                    $category = $this->em->getRepository(Category::class)
                        ->find($idCateg);
                }catch (PDOException $exception){
                    return new CategoryNotFoundException(sprintf("Category with id %d not found!", $idCateg));
                }

            }else{
                // Nouvelle catégorie
                $category = new Category();
                $category->setName($data["product"]["category"]["name"]);
                $category->setDescription($data["product"]["category"]["description"]);
                $category->setDateCreated(new \DateTime());
                $category->setIsValid(false);
                $category->setPlatformFee(0.1);

                // Image de la catégorie
                $image = new Image();
                $image->setTitle($data['product']['category']['image']['title']);
                $image->setAlt($data['product']['category']['image']['title']);
                $image->setPlace($data['product']['category']['image']['place']);
                $image->setSize($files['product']['category']['image']['src']->getSize());

                $imageFile = $files['product']['category']['image']['src'];

                if($imageFile)
                {
                    $originalFilename = pathinfo($imageFile->getClientOriginalName(), PATHINFO_FILENAME);
                    $safeFilename = transliterator_transliterate('Any-Latin; Latin-ASCII; [^A-Za-z0-9_] remove; Lower()', $originalFilename);
                    $newFilename = $safeFilename.'-'.uniqid("_", true).'.'.$imageFile->guessExtension();

                    try{
                        $imageFile->move($this->container->getParameter('categories_image_directory'), $newFilename);
                    }catch (FileException $exception){
                        return new UploadImageException(sprintf("Code: %d.\nMessage: %s", $exception->getCode(), $exception->getMessage()));
                    }

                    $image->setUrl($newFilename);

                    try{
                        $this->em->persist($image);
                    }catch (PDOException $exception){
                        $this->em->rollback();
                        throw new ImagePersistException(sprintf("Category image can't be persisted!"));
                    }


                }

                $category->setImage($image);

                try{
                    $this->em->persist($category);
                }catch (PDOException $exception){
                    $this->em->rollback();
                    throw new CategoryPersistException(sprintf("Category %s can't be persisted!", $category->getName()));
                }
            }

            $product->setCategory($category);
        }

        // Images du produits
        foreach($files['product']['images'] as $key => $imageFile)
        {
            // Image de la catégorie
            $image = new Image();

            $image->setTitle($product->getTitle());
            $image->setAlt($product->getTitle());
            $image->setPlace($data['product']['images'][$key]['place'] ?? $key);
            $image->setSize($files['product']['images'][$key]->getSize());

            $imageFile = $files['product']['images'][$key];

            if($imageFile)
            {
                $originalFilename = pathinfo($imageFile->getClientOriginalName(), PATHINFO_FILENAME);
                $safeFilename = transliterator_transliterate('Any-Latin; Latin-ASCII; [^A-Za-z0-9_] remove; Lower()', $originalFilename);
                $newFilename = $safeFilename.uniqid("_", true).'.'.$imageFile->guessExtension();

                try{
                    /* Déplacement du fichier image dans le répertoire public des images de produits */
                    $imageFile->move(getenv('UPLOAD_SUPPLIER_PRODUCT_IMAGE_DIRECTORY'), $newFilename);
                }catch (FileException $exception){
                    return new UploadImageException(sprintf("Code: %d.\nMessage: %s", $exception->getCode(), $exception->getMessage()));
                }

                $image->setUrl($newFilename);


            }

            try{
                $this->em->persist($image);
            }catch (PDOException $exception){
                $this->em->rollback();
                throw new ImagePersistException(sprintf("Product's images '%s' can't be persisted!", $image->getTitle()));
            }


            $supplierProduct->addImage($image);
        }


        $supplierProduct->setProduct($product);

        /* Récupération du fournisseur */
        try{
            $supplier = $this->em->getRepository(Supplier::class)
                ->findOneBy(['email' => $this->security->getUser()->getUsername()]);
        }catch (PDOException $exception){
            throw new SupplierNotFoundException(sprintf(sprintf("Supplier not found !")));
        }

        $supplierProduct->setSupplier($supplier);

        try{
            $this->em->persist($supplierProduct);
            $this->em->flush();
            $this->em->commit();
        }catch (PDOException $exception){
            $this->em->rollback();
            throw new SupplierProductPersistException(sprintf("Error while persisting the supplier product %s", $data['product']['title']));
        }


        return $supplierProduct;
    }



}
