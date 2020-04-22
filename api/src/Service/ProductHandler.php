<?php


namespace App\Service;

use App\Entity\Product;
use Doctrine\ORM\EntityManagerInterface;
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

    public function __construct(RequestStack $requestStack, EntityManagerInterface $em)
    {
        $this->request = $requestStack->getCurrentRequest();
        $this->em = $em;
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
            "title" => $this->request->query->get("title") ?? null,
            "resume" => $this->request->query->get("resume") ?? null,
            "category" => $this->request->query->get('category') ?? null,
            "page" => $this->request->query->get('page') ?? null,
            "itemsPerPage" => $this->request->query->get('itemsPerPage') ?? null
        ];


        $products = $this->em->getRepository(Product::class)
            ->getProductsWithImages($options);


        return new JsonResponse(["products" => $products]);
    }

    public function getProductWithImage()
    {
        $options = [
            "id" => intval($this->request->attributes->get('id')) ?? null,
            "category" => $this->request->query->get('category') ?? null
        ];

        dump($this->request->attributes->get('id'));
        dump(intval($this->request->attributes->get('id')));
        dump($this->request->query->get('id'));

        $product = $this->em->getRepository(Product::class)
            ->getProductWithImage($options);

        return $product;
    }

}
