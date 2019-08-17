<?php
/**
 * Nom: Iracanyes
 * Description: Security Controller
 * Date : 16/08/2019
 */

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;

class SecurityController extends AbstractController
{
    /**
     * @Route("/login", name="app_login", methods={"POST"})
     */
    public function login()
    {
        return $this->json([
            "user" => $this->getUser() ? $this->getUser()->getId() : null
        ]);
    }
}
