<?php


namespace App\Controller\Favorite;

use App\Service\FavoriteHandler;
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
