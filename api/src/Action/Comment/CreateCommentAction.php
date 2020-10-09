<?php


namespace App\Action\Comment;

use App\Domain\CommentHandler;

class CreateCommentAction
{
    private $commentHandler;

    public function __construct(CommentHandler $commentHandler)
    {
        $this->commentHandler = $commentHandler;
    }

    public function __invoke()
    {
        return $this->commentHandler->createComment();
    }
}
