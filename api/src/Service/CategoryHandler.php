<?php


namespace App\Service;



use App\Entity\Category;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;

class CategoryHandler
{
    private $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    public function getNames()
    {
        $categories_names = $this->em->getRepository(Category::class)
                                        ->getNames();

        return new JsonResponse($categories_names);
    }
}
