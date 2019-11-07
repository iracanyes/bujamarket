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

    public function getNames()
    {
        $names = $this->em->getRepository(Product::class)
            ->getNames();

        return new JsonResponse(["names" =>$names]);
    }
}
