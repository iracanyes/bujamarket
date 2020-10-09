<?php


namespace App\Action\Favorite;

use App\Domain\FavoriteHandler;

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
