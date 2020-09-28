<?php


namespace App\Service;

use App\Entity\Product;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RequestStack;
use App\Exception\Product\ProductNotFoundException;
use Doctrine\DBAL\Driver\PDOException;

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

    public function __construct(RequestStack $requestStack, EntityManagerInterface $em, LoggerInterface $logger)
    {
        $this->request = $requestStack->getCurrentRequest();
        $this->em = $em;
        $this->logger = $logger;
    }

    public function getNames(): JsonResponse
    {
        $names = $this->em->getRepository(Product::class)
            ->getNames();

        return new JsonResponse(["names" =>$names]);
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

        dump($options);


        $products = $this->em->getRepository(Product::class)
            ->getProductsWithImages($options);

        $result = [];
        foreach ($products as $product)
        {
            $product['img-src'] = getenv('API_ENTRYPOINT').'/'.getenv('UPLOAD_SUPPLIER_PRODUCT_IMAGE_DIRECTORY').'/'.$product['url'];
            $result[] = $product;
        }

        dump($products);


        return new JsonResponse(["products" => $result  ]);
    }

    public function getProductWithImage()
    {
        $options = [
            "id" => intval($this->request->attributes->get('id')) ?? null,
            "category" => $this->request->query->get('category') ?? null
        ];

        $product = $this->em->getRepository(Product::class)
            ->getProductWithImage($options);


        dump($product);


        $product[0]['url'] = getenv('API_ENTRYPOINT').'/'.getenv('UPLOAD_SUPPLIER_PRODUCT_IMAGE_DIRECTORY')."/".$product[0]['url'];


        dump($product);

        return $product;
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
