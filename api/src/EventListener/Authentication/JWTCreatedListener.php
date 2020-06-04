<?php

/**
 * Autheur:
 * Description: Modification des données du token de sécurité JWT
 * Date:
 */
namespace App\EventListener\Authentication;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\User\UserInterface;

class JWTCreatedListener
{
    private $request;

    public function __construct(RequestStack $requestStack)
    {
        $this->request = $requestStack->getCurrentRequest();
    }

    public function onJWTCreated(JWTCreatedEvent $event): void
    {
        $payload = $event->getData();
        $user = $event->getUser();

        if(!$user instanceof UserInterface)
            return;



        // Remise à zéro du compteur d'erreurs de connexion
        $user->setNbErrorConnection(0);

        // Ajout de données au payload du token
        $payload["id"] = $this->request->getClientIp();
        $payload["name"] = $user->getFirstname();

        $event->setData($payload);
    }

}
