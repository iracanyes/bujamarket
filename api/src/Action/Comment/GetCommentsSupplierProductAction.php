<?php

namespace App\Action\Comment;

use App\Domain\CommentHandler;
use Symfony\Component\HttpFoundation\JsonResponse;

class GetCommentsSupplierProductAction
{
    /**
     * @var CommentHandler
     */
    private $commentHandler;

    public function __construct(CommentHandler $commentHandler)
    {
        $this->commentHandler = $commentHandler;
    }

    /**
     * @return JsonResponse
     */
    public function __invoke(): JsonResponse
    {
        return $this->commentHandler->getCommentsBySupplierProduct();

    }

}
