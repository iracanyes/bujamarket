<?php


namespace App\Action\Favorite;

use App\Domain\FavoriteHandler;

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
