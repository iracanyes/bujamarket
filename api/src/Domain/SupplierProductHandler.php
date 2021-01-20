<?php


namespace App\Domain;

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
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\Security\Core\Security;
use Doctrine\ORM\EntityManagerInterface;
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


        // Si la quantité du produit est limité, indiquer le nombre disponible
        if($supplierProduct->getIsLimited())
        {
            $supplierProduct->setQuantity((int) $data['quantity']);
        }
        // Ajout des infos et taxes additionnels
        $supplierProduct->setAdditionalInformation($data['additionalInformation']);
        $supplierProduct->setAdditionalFee(((float)$data['additionalFee'] ) / 100);

        /* Ajout des informations du produits */
        // Si un produit existant est selectionné, on la récupère en DB sinon on crée un nouveau produit
        if(!empty($data["product"]["id"]) && $data["product"]["id"] !== "")
        {
            try{
                $product = $this->em->getRepository(Product::class)
                    ->findOneBy(['title' => $data["product"]["id"]]);
            }catch (\Exception $exception){
                return new ProductNotFoundException(sprintf("The product with the title (%s) not found!", $data["product"]["id"]));
            }



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
            if(!empty($data["newProduct"]["category"]["id"]) && $data["newProduct"]["category"]["id"] !== "")
            {
                $idCateg = $data["newProduct"]["category"]["id"] ;

                try{
                    $category = $this->em->getRepository(Category::class)
                        ->findOneBy(["name" =>$idCateg]);
                }catch (\Exception $exception){
                    $this->logger->error($exception->getMessage(), ['context' => $exception]);
                    throw new CategoryNotFoundException(sprintf("Category with id %d not found!", $idCateg));
                }

            }else{
                // Nouvelle catégorie
                $category = new Category();
                $category->setName($data["newProduct"]["category"]["name"]);
                $category->setDescription($data["newProduct"]["category"]["description"]);
                $category->setDateCreated(new \DateTime());
                $category->setIsValid(false);
                $category->setPlatformFee(0.1);

                // Image de la catégorie
                $image = new Image();
                $image->setTitle($data['newProduct']['category']['name']);
                $image->setAlt($data['newProduct']['category']['name']);
                $image->setPlace(1);
                $image->setSize($files['newProduct']['category']['image']->getSize());

                /* Set image's filename and move it to directory */
                $imageFile = $files['newProduct']['category']['image'];
                $this->imageHandler->uploadCategoryImage($image, $imageFile, $data["newProduct"]["category"]["name"] );


                $category->setImage($image);

                try{
                    $this->em->persist($category);
                }catch (\Exception $exception){
                    $this->em->rollback();
                    throw new CategoryPersistException(sprintf("Category %s can't be persisted!", $category->getName()));
                }
            }

            $product->setCategory($category);
        }

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
            // Set new filename and move it to public directory
            $this->imageHandler->uploadSupplierProductImage($image, $imageFile, $user->getBrandName());

            $supplierProduct->addImage($image);
        }


        $supplierProduct->setProduct($product);

        /* Récupération du fournisseur */
        try{
            $supplier = $this->em->getRepository(Supplier::class)
                ->findOneBy(['email' => $this->security->getUser()->getUsername()]);
        }catch (\Exception $exception){
            $this->em->rollback();
            throw new SupplierNotFoundException("Supplier not found !");
        }

        $supplierProduct->setSupplier($supplier);

        try{
            $this->em->persist($supplierProduct);
            $this->em->flush();
            $this->em->commit();
        }catch (\Exception $exception){
            $this->em->rollback();
            throw new SupplierProductPersistException(sprintf("Error while persisting the supplier product %s", $data['product']['title']));
        }


        return $supplierProduct;
    }

    public function updateSupplierProduct()
    {
        /* Récupération des données du formulaire */
        $data = $this->request->request->all();
        /* Récupération des fichiers envoyés ac le formulaire */
        $files = $this->request->files->all();
        /* Fournisseur
        */
        $user = $this->security->getUser();

        // Name of the supplier product
        $id = $this->request->attributes->get('id');


        /* Démarrage de la session de transaction ac la db */
        $this->em->beginTransaction();


        try{
            $supplierProduct = $this->em->getRepository(SupplierProduct::class)
                ->getSupplierProductWithProductAndSupplierInfo($id, $user->getUsername());
            if(!$supplierProduct instanceof SupplierProduct){
                throw new SupplierProductNotFoundException(sprintf("Supplier's product (%d) not found!", $id));
            }

        }catch(\Exception $e){
            $this->em->rollback();
            $this->logger->error(sprintf("Error while retrieving the supplier's (%s) product (id = %d)", $user->getBrandName(), $id), ["context" => $e]);
            throw new SupplierProductNotFoundException(sprintf("Error while retrieving the supplier's (%s) product (id = %d)", $user->getBrandName(), $id));
        }


        /* Mise à jour des informations fournisseurs sur le produit */
        $supplierProduct->setIsAvailable(isset($data['isAvailable']) ? $data['isAvailable'] : false)
            ->setInitialPrice((float) $data['initialPrice'])
            ->setIsLimited(isset($data['isLimited']) ? $data['isLimited'] : false );


        // En cas de disponibilité limitée du produit, enregistrer la quantité disponible
        if($supplierProduct->getIsLimited())
        {
            $supplierProduct->setQuantity((int) $data['quantity']);
        }

        $supplierProduct->setAdditionalInformation($data['additionalInformation']);
        $supplierProduct->setAdditionalFee(((float)$data['additionalFee'] / 100 ));


        /* Mise à jour des informations du produit, sinon création d'un nouveau produit référence pour le produit proposé par le fournisseur
        */
        if(empty($data["newProduct"]["title"]) && $data["newProduct"]["title"] === "")
        {
            $product = $supplierProduct->getProduct();

            $product->setTitle($data["product"]["title"])
                ->setResume($data["product"]["resume"])
                ->setDescription($data["product"]["description"])
                ->setCountryOrigin($data["product"]["countryOrigin"])
                ->setWeight($data["product"]["weight"])
                ->setLength($data["product"]["length"])
                ->setHeight($data["product"]["height"])
                ->setWidth($data["product"]["width"]);

            // Category du produit
            if( $data["product"]["category"]["name"] !== $product->getCategory()->getName() ||  $data["product"]["category"]["description"] !== $product->getCategory()->getDescription())
            {

                if(!empty($files['product']['category']['image']))
                {
                    // Nouvelle catégorie
                    $category = $this->categoryHandler->persistNewCategory($data["product"]["category"], $files['product']['category']['image']);
                }else{
                    $category = $this->categoryHandler->updateExistingCategory($data["product"]["category"]);
                }
            }else{
                $category = $product->getCategory();
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
            // Si un choix de catégorie est selectionné
            if(!empty($data["newProduct"]["category"]["id"]) )
            {
                // Si une mise à jour du nom de catégorie est effectué, on met à jour la catégorie
                if(!empty($data["newProduct"]["category"]["name"])){
                    $category = $this->categoryHandler->updateExistingCategory($data["newProduct"]["category"]);
                }else{
                    // Sinon, on récupère la catégorie existante en DB
                    $category = $this->em->getRepository(Category::class)
                        ->findOneBy(['name' => $data["newProduct"]["category"]["id"]]);
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
                }catch (\Exception $exception){
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
        }catch (\Exception $exception){
            throw new SupplierNotFoundException(sprintf(sprintf("Supplier not found !")));
        }

        $supplierProduct->setSupplier($supplier);

        try{
            $this->em->persist($supplierProduct);
            $this->em->flush();
            $this->em->commit();
        }catch (\Exception $exception){
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
                    $this->imageHandler->setSupplierProductPublicDirectory($image);
                }
            }

            // Ajout de l'URL public du répertoire des images de catégorie
            $this->imageHandler->setCategoryImagePublicDirectory($supplier_product->getProduct()->getCategory());


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

        return $products;
    }

    public function deleteSupplierProduct()
    {
        $id = $this->request->attributes->get("id");

        $supplier = $this->security->getUser();

        try{
            $supplierProduct = $this->em->getRepository(SupplierProduct::class)
                ->getOneSupplierProduct((int) $id, $supplier->getUsername());

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

    public function getProductSuppliers()
    {
        $id = $this->request->attributes->get('id') ?? null;

        try{
            $productSuppliers = $this->em->getRepository(SupplierProduct::class)
                ->getProductSuppliersByProductId((int) $id);


            foreach($productSuppliers as $value){
                foreach($value->getImages() as $image){
                    $image->setUrl( getenv('API_ENTRYPOINT')."/".getenv('UPLOAD_SUPPLIER_PRODUCT_IMAGE_DIRECTORY')."/".$image->getUrl() );

                }
            }

            return $productSuppliers;

        }catch (\Exception $e){
            $this->logger->error($e->getMessage(), ['context' => $e]);
        }


    }

    /**
     * @return mixed
     */
    public function getBestRatedSuppliersProduct()
    {

        try{
            $bestRatedProducts = $this->em->getRepository(SupplierProduct::class)
                ->getBestRatedSuppliersProduct();

            foreach($bestRatedProducts as $value){
                foreach($value->getImages() as $image){
                    $image->setUrl( getenv('API_ENTRYPOINT')."/".getenv('UPLOAD_SUPPLIER_PRODUCT_IMAGE_DIRECTORY')."/".$image->getUrl() );

                }
            }

            return $bestRatedProducts;

        }catch (\Exception $e){
            $this->logger->error($e->getMessage(), ['context' => $e]);
        }


    }

}
