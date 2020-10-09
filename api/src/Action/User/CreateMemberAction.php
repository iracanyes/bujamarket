<?php


namespace App\Action\User;


use App\Entity\UserTemp;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use App\Entity\User;
use App\Domain\MemberHandler;
use Symfony\Component\Serializer\SerializerInterface;

class CreateMemberAction extends AbstractController
{
    private $memberHandler;

    private $serializer;

    public function __construct(MemberHandler $memberHandler, SerializerInterface $serializer)
    {
        $this->memberHandler = $memberHandler;
        $this->serializer = $serializer;
    }

    public function __invoke(): UserTemp
    {
        /* Création de l'utilisateur en base de donnée */
        $user = $this->memberHandler->create();

        /* On retourne le nouvel objet pour qu'il passe dans l'event system      */
        /* Envoie de l'e-mail de confirmation se fait via l'event-system de Symfony après la validation des valeurs et leur persistence */
        return $user;


    }
}
