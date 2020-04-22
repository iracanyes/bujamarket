<?php


namespace App\Controller\Favorite;

use App\Service\FavoriteHandler;

class GetMyFavoritesAction
{
    private $favoriteHandler;

    public function __construct(FavoriteHandler $favoriteHandler)
    {
        $this->favoriteHandler = $favoriteHandler;
    }

    public function __invoke()
    {
        return $this->favoriteHandler->getMyFavorites();
    }
}
