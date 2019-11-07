<?php


namespace App\Controller\Favorite;

use App\Service\FavoriteHandler;

class DeleteFavoriteAction
{

    private $favoriteHandler;

    public function __construct(FavoriteHandler $favoriteHandler)
    {
        $this->favoriteHandler = $favoriteHandler;
    }

    public function __invoke()
    {
        return $this->favoriteHandler->deleteFavorite();

    }
}
