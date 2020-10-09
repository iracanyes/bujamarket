<?php


namespace App\Action\Favorite;

use App\Domain\FavoriteHandler;
use Symfony\Component\HttpFoundation\JsonResponse;

class CreateFavoriteAction
{
    private $favoriteHandler;

    public function __construct(FavoriteHandler $favoriteHandler)
    {
        $this->favoriteHandler= $favoriteHandler;
    }

    public function __invoke()
    {
        return $this->favoriteHandler->create();
    }
}
