<?php
/**
 * Description: Autoriser un fournisseur à publier des produits dans la plateforme
 */

namespace App\Controller\User;

use App\Service\MemberHandler;

class AuthorizePublishingAction
{
    /**
     * @var MemberHandler
     */
    private $memberHandler;

    public function __construct(MemberHandler $memberHandler)
    {
        $this->memberHandler = $memberHandler;
    }

    /**
     * @return object|null
     * @throws \App\Exception\User\UserNotAllowedToTakeSuchAction
     */
    public function __invoke()
    {
        return $this->memberHandler->authorizePublishing();
    }
}
