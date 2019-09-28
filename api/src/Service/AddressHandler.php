<?php


namespace App\Service;

use App\Entity\Address;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Security\Core\Security;

class AddressHandler
{
    private $em;

    private $request;

    private $security;

    private $logger;

    public function __construct(EntityManagerInterface $em, RequestStack $request, SessionInterface $session, LoggerInterface $logger, Security $security)
    {
        $this->em = $em;
        $this->request = $request;
        $this->security = $security;
        $this->logger = $logger;
    }

    public function getUserAddresses()
    {


        try{
            $user = $this->em->getRepository(User::class)
                ->findOneBy(['email' => $this->security->getUser()->getUsername()]);

            if($user !== null)
            {
                $addresses = $user->getAddresses();
            }
        }catch(PdoException $e){
            $message = sprintf('PDOException [%s]: \n %s', $e->getCode(), $e->getMessage());
            $this->logger->error($message);

            throw $e;
        }


        return $addresses;
    }
}
