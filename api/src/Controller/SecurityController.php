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
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;

class SecurityController extends AbstractController
{
    /**
     * @Route("/login", name="app_login", methods={"POST"})
     *
     * En utilisant le firewall "json_login", l'authentification est faite automatiquement.
     * Après la requête est redirigée vers cette méthode.
     * Attention: "json_login" accepte seulement un header contenant "Content-Type: application/json"
     */
    public function login(IriConverterInterface $iriConverter, Request $request)
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



        /* Basic retour d'un objet contenant l'ID de l'utilisateur
        return $this->json([
            "user" => $this->getUser() ? $this->getUser()->getId() : null
        ]);
        */

        /*
         * On retourne une réponse null ac un code 204 pour indiquer que tout va bien mais il n'y a rien à afficher
         * On retourne dans le header "Location" l'IRI de l'utilisateur connecté
         */
        return new Response(null, 204, [
            'location' => $request->headers->get('origin').$iriConverter->getIriFromItem($this->getUser())
        ]);
    }
}
