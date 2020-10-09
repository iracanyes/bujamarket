<?php


namespace App\Domain;

use App\Entity\Supplier;
use App\Exception\User\MemberNotFoundException;
use App\Exception\User\UserNotAllowedToTakeSuchAction;
use App\Responder\StreamedResponder;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpFoundation\RequestStack;


class SupplierHandler
{
    private $request;

    private $em;

    private $security;

    private $logger;

    private $streamedResponder;

    public function __construct(RequestStack $requestStack, EntityManagerInterface $em, Security $security, LoggerInterface $logger, StreamedResponder $streamedResponder)
    {
        $this->request = $requestStack->getCurrentRequest();
        $this->em = $em;
        $this->security = $security;
        $this->logger = $logger;
        $this->streamedResponder = $streamedResponder;
    }

    public function getSupplierImage($supplier)
    {
        $user = $this->security->getUser();

        if(!in_array('ROLE_MEMBER', $user->getRoles()))
        {
            throw new UserNotAllowedToTakeSuchAction('User not allowed to get this resource!');
        }

        if(!$supplier instanceof Supplier)
            throw new MemberNotFoundException('Supplier not found!');

        try{
            return $this->streamedResponder->getSupplierImage($supplier, $supplier->getImage());
        }catch (\Exception $e){
            $this->logger->error($e->getMessage(), ['context' => $e]);

        }

    }
}
