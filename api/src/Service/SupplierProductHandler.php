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
use App\Exception\SupplierProduct\SupplierProductNotFoundException;
use App\Exception\SupplierProduct\SupplierProductPersistException;
use App\Exception\SupplierProduct\SupplierProductRetrieveException;
use Doctrine\DBAL\Driver\PDOException;
use Psr\Log\LoggerInterface;
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

    /**
     * @var LoggerInterface
     */
    private $logger;

    /**
     * @var ImageHandler
     */
    private $imageHandler;

    /**
     * @var CategoryHandler
     */
    private $categoryHandler;

    public function __construct(RequestStack $requestStack, Security $security, EntityManagerInterface $em, ContainerInterface $container, LoggerInterface $logger, ImageHandler $imageHandler, CategoryHandler $categoryHandler)
    {
        $this->request = $requestStack->getCurrentRequest();
        $this->security = $security;
        $this->em = $em;
        $this->container = $container;
        $this->logger = $logger;
        $this->imageHandler = $imageHandler;
        $this->categoryHandler = $categoryHandler;

    }

    public function createSupplierProduct()
    {
        /* Récupération des données du formulaire */
        $data = $this->request->request->all();
        /* Récupération des fichiers envoyés ac le formulaire */
        $files = $this->request->files->all();
        /* Fournisseur
        */
        $user = $this->security->getUser();

        /* Démarrage de la session de transaction ac la db */
        $this->em->beginTransaction();


        $supplierProduct = new SupplierProduct();

        /* Ajout des informations fournisseurs sur le produit */
        $supplierProduct->setIsAvailable(isset($data['isAvailable']) ? $data['isAvailable'] : false );
        $supplierProduct->setInitialPrice((float) $data['initialPrice']);
        $supplierProduct->setIsLimited(isset($data['isLimited']) ? $data['isLimited'] : false );
        $supplierProduct->setRating(5.0);



        if($supplierProduct->getIsLimited())
        {
            $supplierProduct->setQuantity((int) $data['quantity']);
        }

        $supplierProduct->setAdditionalInformation($data['additionalInformation']);
        $supplierProduct->setAdditionalFee((((float)$data['additionalFee'] )));

        /* Ajout des informations du produits */
        if(!empty($data["product"]["id"]) && $data["product"]["id"] !== "")
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
            if(!empty($data["product"]["category"]["id"]) && $data["product"]["category"]["id"] !== "")
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
                $image->setTitle($data['product']['category']['name']);
                $image->setAlt($data['product']['category']['name']);
                $image->setPlace(1);
                $image->setSize($files['product']['category']['image']->getSize());

                $imageFile = $files['product']['category']['image'];

                if($imageFile)
                {

                    $safeFilename = transliterator_transliterate('Any-Latin; Latin-ASCII; [^A-Za-z0-9_] remove; Lower()', $data["product"]["category"]["name"]);
                    $newFilename = $safeFilename.'-'.uniqid("_", true).'.'.$imageFile->guessExtension();

                    try{
                        $imageFile->move($this->container->getParameter('categories_image_directory'), $newFilename);
                    }catch (FileException $exception){
                        return new UploadImageException(sprintf("Code: %d.\nMessage: %s", $exception->getCode(), $exception->getMessage()));
                    }

                    $image->setUrl($newFilename);
                    $image->setMimeType($imageFile->getMimeType());

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
        dump($files['product']['images']);

        // Traitement des images du produit
        foreach($files['product']['images'] as $key => $imageFile)
        {
            // Image produit
            $image = new Image();

            $image->setTitle($product->getTitle());
            $image->setAlt($product->getTitle());
            $image->setPlace($data['product']['images'][$key]['place'] ?? $key);
            $image->setSize($files['product']['images'][$key]->getSize());

            $imageFile = $files['product']['images'][$key];

            if($imageFile)
            {

                $safeFilename = transliterator_transliterate('Any-Latin; Latin-ASCII; [^A-Za-z0-9_] remove; Lower()', $user->getBrandName());
                $newFilename = $safeFilename.uniqid("_", true).'.'.$imageFile->guessExtension();

                try{
                    $image->setUrl($newFilename);
                    $image->setMimeType($imageFile->getMimeType());


                    /* Déplacement du fichier image dans le répertoire public des images de produits */
                    $imageFile->move(getenv('UPLOAD_SUPPLIER_PRODUCT_IMAGE_DIRECTORY'), $newFilename);
                }catch (FileException $exception){
                    return new UploadImageException(sprintf("Code: %d.\nMessage: %s", $exception->getCode(), $exception->getMessage()));
                }


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

    public function updateSupplierProduct()
    {
        /* Récupération des données du formulaire */
        $data = $this->request->request->all();
        $data2 = json_decode($this->request->getContent(), true);

        /* Récupération des fichiers envoyés ac le formulaire */
        $files = $this->request->files->all();
        /* Fournisseur
        */
        $user = $this->security->getUser();

        // Id of the supplier product
        $id = (int) $this->request->attributes->get('id');


        /* Démarrage de la session de transaction ac la db */
        $this->em->beginTransaction();


        try{
            $supplierProduct = $this->em->getRepository(SupplierProduct::class)
                ->findOneBy(["id" => $id, "supplier" => $user ]);

        }catch(\Exception $e){
            $this->em->rollback();
            $this->logger->error(sprintf("Error while retrieving the supplier's (%s) product (id = %d)", $user->getBrandName(), $id), ["context" => $e]);
            throw new SupplierProductNotFoundException(sprintf("Error while retrieving the supplier's (%s) product (id = %d)", $user->getBrandName(), $id));
        }

        dump($supplierProduct);

        /* Ajout des informations fournisseurs sur le produit */
        $supplierProduct->setIsAvailable(isset($data['isAvailable']) ? $data['isAvailable'] : false)
            ->setInitialPrice((float) $data['initialPrice'])
            ->setIsLimited(isset($data['isLimited']) ? $data['isLimited'] : false );


        // En cas de disponibilité limitée du produit, enregistrer la quantité disponible
        if($supplierProduct->getIsLimited())
        {
            $supplierProduct->setQuantity((int) $data['quantity']);
        }

        $supplierProduct->setAdditionalInformation($data['additionalInformation']);
        $supplierProduct->setAdditionalFee((float)$data['additionalFee'] );


        /* Mise à jour des informations du produit, sinon création d'un nouveau produit référence pour le produit proposé par le fournisseur
        */
        if(empty($data["newProduct"]["title"]))
        {
            try{
                $product = $this->em->getRepository(Product::class)
                    ->find((int) $data["product"]["id"]);
            }catch (PDOException $exception){
                return new ProductNotFoundException(sprintf("The product with the id %s not found!", $data["product"]["id"]));
            }

            $product->setTitle($data["product"]["title"])
                ->setResume($data["product"]["resume"])
                ->setDescription($data["product"]["description"])
                ->setCountryOrigin($data["product"]["countryOrigin"])
                ->setWeight($data["product"]["weight"])
                ->setLength($data["product"]["length"])
                ->setHeight($data["product"]["height"])
                ->setWidth($data["product"]["width"]);

            // Category du produit
            if(!empty($data["product"]["category"]["id"]) )
            {
                if(!empty($data["product"]["category"]["name"]))
                {
                    $category = $this->categoryHandler->updateExistingCategory($data["product"]["category"]);
                }else{
                    $category = $this->em->getRepository(Category::class)
                        ->find($data["product"]["category"]["id"]);
                }

            }else{
                // Nouvelle catégorie
                $category = $this->categoryHandler->persistNewCategory($data["product"]["category"], $files['product']['category']['image']);
            }

            $product->setCategory($category);
        }else{
            // Nouveau produit
            $product = new Product();
            $product->setTitle($data['newProduct']['title']);
            $product->setResume($data['newProduct']['resume']);
            $product->setDescription($data['newProduct']['description']);
            $product->setHeight((float) $data['newProduct']['height']);
            $product->setLength((float) $data['newProduct']['length']);
            $product->setWeight((float) $data['newProduct']['weight']);
            $product->setWidth((float) $data['newProduct']['width']);
            $product->setCountryOrigin($data['newProduct']['countryOrigin']);


            // Category du produit
            if(!empty($data["newProduct"]["category"]["id"]) )
            {
                if(!empty($data["newProduct"]["category"]["name"])){
                    $category = $this->categoryHandler->updateExistingCategory($data["newProduct"]["category"]);
                }else{
                    $category = $this->em->getRepository(Category::class)
                        ->find($data["newProduct"]["category"]["id"]);
                }

            }else{
                if(!empty($data["newProduct"]["category"]["name"]))
                {
                    // Nouvelle catégorie
                    $category = $this->categoryHandler->persistNewCategory($data["newProduct"]["category"], $files['newProduct']['category']['image']);
                }

            }

            $product->setCategory($category);
        }



        // Traitement des images du produit
        if(isset($files['product']['images'])){
            foreach($files['product']['images'] as $key => $imageFile)
            {
                // Image produit
                $image = new Image();

                $image->setTitle($product->getTitle());
                $image->setAlt($product->getTitle());
                $image->setPlace($data['product']['images'][$key]['place'] ?? $key);
                $image->setSize($files['product']['images'][$key]->getSize());

                $imageFile = $files['product']['images'][$key];

                if($imageFile)
                {

                    $safeFilename = transliterator_transliterate('Any-Latin; Latin-ASCII; [^A-Za-z0-9_] remove; Lower()', $user->getBrandName());
                    $newFilename = $safeFilename.uniqid("_", true).'.'.$imageFile->guessExtension();

                    try{
                        $image->setUrl($newFilename);
                        $image->setMimeType($imageFile->getMimeType());


                        /* Déplacement du fichier image dans le répertoire public des images de produits */
                        $imageFile->move(getenv('UPLOAD_SUPPLIER_PRODUCT_IMAGE_DIRECTORY'), $newFilename);
                    }catch (FileException $exception){
                        return new UploadImageException(sprintf("Code: %d.\nMessage: %s", $exception->getCode(), $exception->getMessage()));
                    }


                }

                try{
                    $this->em->persist($image);
                }catch (PDOException $exception){
                    $this->em->rollback();
                    throw new ImagePersistException(sprintf("Product's images '%s' can't be persisted!", $image->getTitle()));
                }


                $supplierProduct->addImage($image);
            }
        }



        $supplierProduct->setProduct($product);

        // Update of the final price of the product
        $supplierProduct->setFinalPrice();

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
            $this->logger->error(sprintf("Error while persisting the supplier product %s", $data['product']['title']), ['context' => $exception]);
            throw new SupplierProductPersistException(sprintf("Error while persisting the supplier product %s", $data['product']['title']));
        }


        return $supplierProduct;
    }

    public function getSupplierProduct()
    {
        try{
            $id = $this->request->attributes->get('id');

            $supplier_product = $this->em->getRepository(SupplierProduct::class)
                ->myFind($id);

            // Ajout de l'URL public vers les images du produit
            if(!empty($supplier_product->getImages())){
                foreach($supplier_product->getImages() as $image)
                {
                    $filename = $image->getUrl();
                    $image->setUrl(getenv('API_ENTRYPOINT').'/'.getenv('UPLOAD_SUPPLIER_PRODUCT_IMAGE_DIRECTORY').'/'.$filename);
                }
            }

            // Ajout de l'URL public du répertoire des images de catégorie
            $imageCateg = $supplier_product->getProduct()->getCategory()->getImage();
            dump($imageCateg);
            $imageCateg->setUrl(getenv('API_ENTRYPOINT').'/'.getenv('UPLOAD_CATEGORY_IMAGE_DIRECTORY').'/'.$imageCateg->getUrl());


        }catch (\Exception $exception){
            $this->logger->error("Error occurred while retrieving the supplier product!", ['context' => $exception]);
            throw new SupplierProductRetrieveException(
                "Error occurred while retrieving the supplier product!\n"
                .$exception->getMessage()
                ."\nFile :".$exception->getFile()
                ."\nLine :".$exception->getLine()
            );
        }

        return $supplier_product;

    }

    public function getMyProducts()
    {
        $user = $this->security->getUser();

        try{
            $products = $this->em->getRepository(SupplierProduct::class)
                ->getMyProducts($user->getId());
        }catch (\Exception $exception){
            $this->logger->error($exception->getMessage(), ['context' => $exception]);
            throw new SupplierProductNotFoundException("Error while retrieving the supplier's products");
        }
        dump($products);
        return $products;
    }

    public function deleteSupplierProduct()
    {
        $id = $this->request->attributes->get("id");

        $supplier = $this->security->getUser();
        dump($supplier);
        dump($id);

        try{
            $supplierProduct = $this->em->getRepository(SupplierProduct::class)
                ->getOneSupplierProduct((int) $id, $supplier->getUsername());

            dump($supplierProduct);
            if(!$supplierProduct instanceof SupplierProduct)
                throw new SupplierProductNotFoundException(sprintf("Supplier product (id: %d) owned by this supplier not found!", $id));


            $this->imageHandler->deleteSupplierProductImages($supplierProduct);


            if(!$supplierProduct)
                throw new SupplierProductNotFoundException(sprintf("Supplier product (id: %d) owned by this supplier not found!", $id));

            $this->em->remove($supplierProduct);
            $this->em->flush();
        }catch (\Exception $exception){
            $this->logger->error(sprintf("Supplier product (id: %d) owned by this supplier (%s) not found!", $id, $supplier->getBrandName()), ["context" => $exception]);
            throw new SupplierProductNotFoundException(sprintf("Error while deleting the supplier product (id: %d) owned by this supplier not found!", $id));
        }
    }

}
