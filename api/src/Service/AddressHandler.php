<?php


namespace App\Service;

use App\Entity\Address;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

class AddressHandler
{
    private $em;

    private $request;

    private $session;

    private $logger;

    public function __construct(EntityManagerInterface $em, RequestStack $request, SessionInterface $session, LoggerInterface $logger)
    {
        $this->em = $em;
        $this->request = $request;
        $this->session = $session;
        $this->logger = $logger;
    }

    public function getUserAddresses()
    {
        $token = $this->session->get('token');

        dump($token);

        try{
            $user = $this->em->getRepository(User::class)
                ->findOneBy(['token' => $token]);

            if($user !== null)
            {
                $addresses = $user->getAddresses();
            }
        }catch(PdoException $e){
            $message = sprintf('PDOException [%s]: \n %s', $e->getCode(), $e->getMessage());
            $this->logger->error($message);

            throw $e;
        }


        return $addresses ?? null;
    }
}
