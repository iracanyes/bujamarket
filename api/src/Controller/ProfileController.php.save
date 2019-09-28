<?php


namespace App\Controller;


use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Routing\Annotation\Route;

class ProfileController extends AbstractController
{
    private $session;

    private $serializer;

    public function __construct(SerializerInterface $serializer, SessionInterface $session)
    {
        $this->serializer = $serializer;

        $this->session = $session;
    }

    /**
     * @Route("/user/{id}", name="profile_home", requirements={ "id": "\d+"} )
     */
    public function homeAction()
    {
        $this->denyAccessUnlessGranted('ROLE_MEMBER');

        $context = '';

        switch ($this->getUser()->getUserType())
        {
            case "customer":
                $context = "customer:output";
                break;
            case "supplier":
                $context = "supplier:output";
                break;
            case "admin":
                $context = "admin:output";
                break;
        }

        return $this->json(
            $this->serializer->serialize($this->getUser(), "jsonld"),
            200,
            [],
            ['groups' => $context ]
        );


    }
}
