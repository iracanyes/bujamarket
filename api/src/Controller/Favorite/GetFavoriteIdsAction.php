<?php


namespace App\Controller\Favorite;

use App\Service\FavoriteHandler;
use Symfony\Component\HttpFoundation\JsonResponse;

class GetFavoriteIdsAction
{
    private $favoriteHandler;

    public function __construct(FavoriteHandler $favoriteHandler)
    {
        $this->favoriteHandler = $favoriteHandler;
    }

    /**
     * @return JsonResponse
     */
    public function __invoke(): JsonResponse
    {
        return $this->favoriteHandler->getIds();
    }
}
