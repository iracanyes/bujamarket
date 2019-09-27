<?php
/**
 * Nom: Iracanyes
 * Description: Security Controller
 * Date : 16/08/2019
 */

namespace App\Controller;

use ApiPlatform\Core\Api\IriConverterInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Serializer\SerializerInterface;

class SecurityController extends AbstractController
{
    /**
     * @var SessionInterface
     */
    private $session;

    /**
     * @var IriConverterInterface
     */
    private $iriConverter;

    /**
     * @var SerializerInterface
     */
    private $serializer;

    /**
     * SecurityController constructor.
     * @param IriConverterInterface $iriConverter
     * @param SessionInterface $session
     */
    public function __construct(IriConverterInterface $iriConverter, SerializerInterface $serializer, SessionInterface $session)
    {
        $this->session = $session;
        $this->iriConverter = $iriConverter;
        $this->serializer = $serializer;
    }

    /**
     * @Route("/login", name="app_login", methods={"POST"}, schemes={"https"})
     *
     * En utilisant le firewall "json_login", l'authentification est faite automatiquement.
     * Après la requête est redirigée vers cette méthode.
     * Attention: "json_login" accepte seulement un header contenant "Content-Type: application/json"
     */
    public function login()
    {
        /*
         * On retourne une erreur si l'auhentification ne s'est pas bien passés.
         */
        if(!$this->isGranted('IS_AUTHENTICATED_FULLY'))
        {
            return $this->json([
                "error" => "Invalid login request: check that the Content-Type header is \"application/json\"."
            ], 400);
        }

        /**
         * Ouverture d'une session contenant les données sécurisés de l'utilisateur
         * Attention: une session est ouverte automatiquement pour l'utilisateur authentifié "_security_main"
         */
        /*
        $this->session->set(
            "user",
            $this->serializer->serialize(["user" => $this->getUser()], 'jsonld', [] )
        );
        */
        /*
         * Mise à jour du token de sécurité en cas d'échange externe; ex: email
         */
        //$token =  bin2hex(random_bytes(64));
        //$this->getUser()->setToken($token);
        //$this->session->set("token", $token);

        /* Basic retour d'un objet contenant l'ID de l'utilisateur

        Exemple 1:
        return $this->json([
            "user" => $this->getUser() ? $this->getUser()->getId() : null
        ]);

        Exemple 2
        return $this->json(
            ["user" => $this->getUser()],   // data
            200,                            // status
            [],                             // headers []
            ['groups' => 'user:output']     // context
        );

        //Exemple 3: retourner JSON+LD
        return $this->json(
            $this->serializer->serialize($this->getUser(), "jsonld"),  // Serialize data into JSON+LD
            201,
            [],
            ['groups' => ['user:output','customer:output','supplier:output']]
        );
        */


        /*
         * On retourne une réponse null ac un code 204 pour indiquer que tout va bien mais il n'y a rien à afficher
         * On retourne dans le header "Location" l'IRI de l'utilisateur connecté

        return new Response(null, 204, [
            'location' => $this->iriConverter->getIriFromItem($this->getUser())
        ]);
        */

        return $this->json(
            ["user" => $this->getUser()],   // data
            200,                            // status
            [],                             // headers []
            ['groups' => 'user:output']     // context
        );


    }

    /**
     * @Route("/logout", name="app_logout", methods={"GET"})
     */
    public function logout()
    {
        throw new \Exception("Vous allez trop loin...");
    }
}
