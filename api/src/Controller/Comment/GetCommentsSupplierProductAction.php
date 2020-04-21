<?php

namespace App\Controller\Comment;

use App\Service\CommentHandler;
use Symfony\Component\HttpFoundation\JsonResponse;

class GetCommentsSupplierProductAction
{
    private $commentHandler;

    public function __construct(CommentHandler $commentHandler)
    {
        $this->commentHandler = $commentHandler;
    }

    public function __invoke()
    {
        $comments = $this->commentHandler->getCommentsBySupplierProduct();

        return new JsonResponse(["hydra:member" => $comments]);
    }

}
