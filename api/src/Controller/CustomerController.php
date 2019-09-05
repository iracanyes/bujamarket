<?php


namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;

class CustomerController extends  AbstractController
{
    /**
     * @ Route("/customer", methods={"POST"}, schemes={"https"})
     * @IsGranted({"IS_AUTHENTICATED_FULLY","ROLE_CUSTOMER"})
     */
    public function createAction()
    {

    }
}
