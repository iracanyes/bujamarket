<?php


namespace App\Domain;

use App\Entity\OrderDetail;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\Security;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;

class OrderDetailHandler
{
    private $request;

    private $em;

    private $security;

    private $logger;

    private $imageHandler;

    public function __construct(RequestStack $requestStack, EntityManagerInterface $em, Security $security, LoggerInterface $logger, ImageHandler $imageHandler)
    {
        $this->request = $requestStack->getCurrentRequest();
        $this->em = $em;
        $this->security = $security;
        $this->logger = $logger;
        $this->imageHandler = $imageHandler;

    }

    public function getSupplierOrders()
    {
        $orders = null;

        $user = $this->security->getUser();

        if(in_array('ROLE_ADMIN', $user->getRoles()) || in_array('ROLE_CUSTOMER', $user->getRoles()))
            throw new UnauthorizedOrdersRetrievedException("Access restricted to the suppliers of this platform!");

        try{
            $orders = $this->em->getRepository(OrderDetail::class)
                ->getSupplierOrders($user->getUsername());
        }catch (\Exception $exception){
            $this->logger->error("Error while retrieving supplier's product orders", ['context' => $exception]);
        }

        foreach($orders as $orderDetail){
            foreach($orderDetail->getSupplierProduct()->getImages() as $image){
                $this->imageHandler->setSupplierProductPublicDirectory($image);
            }
        }

        return $orders;
    }
}
