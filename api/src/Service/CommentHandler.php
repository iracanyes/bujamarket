<?php


namespace App\Service;


use App\Entity\Comment;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RequestStack;

class CommentHandler
{
    private $request;

    private $em;

    public function __construct(RequestStack $requestStack, EntityManagerInterface $em)
    {
        $this->request = $requestStack->getCurrentRequest();
        $this->em = $em;
    }

    public function getCommentsBySupplierProduct()
    {
        $id = $this->request->attributes->get('id');


        $comments = $this->em->getRepository(Comment::class)
            ->getCommentsBySupplierProduct($id);


        return $comments;
    }

}
