<?php


namespace App\Domain;

use App\Entity\Product;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use App\Responder\JsonResponder;
use Symfony\Component\HttpFoundation\RequestStack;
use App\Exception\Product\ProductNotFoundException;
use Symfony\Component\HttpFoundation\JsonResponse;

class ProductHandler
{
    /**
     * @var \Symfony\Component\HttpFoundation\Request|null $request
     */
    private $request;

    /**
     * @var EntityManagerInterface $em
     */
    private $em;

    /**
     * @var LoggerInterface $logger
     */
    private $logger;

    /**
     * @var ImageHandler $imageHandler
     */
    private $imageHandler;

    /**
     * @var JsonResponder $jsonResponder
     */
    private $jsonResponder;

    public function __construct(RequestStack $requestStack, EntityManagerInterface $em, LoggerInterface $logger, JsonResponder $jsonResponder, ImageHandler $imageHandler)
    {
        $this->request = $requestStack->getCurrentRequest();
        $this->em = $em;
        $this->logger = $logger;
        $this->imageHandler = $imageHandler;
        $this->jsonResponder = $jsonResponder;
    }

    public function getNames(): JsonResponse
    {
        $names = $this->em->getRepository(Product::class)
            ->getNames();

        return $this->jsonResponder->arrayResult($names,['groups' => ['product_name:output']]);
    }

    public function getProductsWithImages()
    {
        $options = [
            "id" => $this->request->query->get('id') ?? null,
            "title" => $this->request->query->get("title") ?? null,
            "resume" => $this->request->query->get("resume") ?? null,
            "category" => $this->request->query->get('category') ?? null,
            "page" => $this->request->query->get('page') ?? null,
            "itemsPerPage" => $this->request->query->get('itemsPerPage') ?? null
        ];


        $products = $this->em->getRepository(Product::class)
            ->getProductsWithImages($options);

        $result = [];
        foreach ($products as $product)
        {
            $product['img-src'] = getenv('API_ENTRYPOINT').'/'.getenv('UPLOAD_SUPPLIER_PRODUCT_IMAGE_DIRECTORY').'/'.$product['url'];
            $result[] = $product;
        }


        return $this->jsonResponder->success(["products" => $result  ]);
    }

    public function getProductWithImage()
    {
        $options = [
            "id" => intval($this->request->attributes->get('id')) ?? null,
            "category" => $this->request->query->get('category') ?? null
        ];

        $product = $this->em->getRepository(Product::class)
            ->getProductWithImage($options);


        $product = $this->imageHandler->setProductImagePublicDirectory($product[0]);

        return $this->jsonResponder->success(array_merge(
            [
                "@context" => "/context/Product",
                "@type" => '/product/'.$product['id'],
            ],
            $product
        ));
    }


    public function searchProducts()
    {
        $options = [
            "title" => $this->request->query->get("title") ?? null,
            "category" => $this->request->query->get('category') ?? null,
            "page" => $this->request->query->get('page') ?? null,
            "itemsPerPage" => $this->request->query->get('itemsPerPage') ?? null
        ];

        $products = $this->em->getRepository(Product::class)
            ->searchProducts($options);

        return $products;
    }

}
