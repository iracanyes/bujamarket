<?php


namespace App\Service;

use App\Entity\Address;
use App\Entity\User;
use Doctrine\DBAL\Driver\PDOException;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityNotFoundException;
use Lexik\Bundle\JWTAuthenticationBundle\Exception\UserNotFoundException;
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

    public function __construct(EntityManagerInterface $em, RequestStack $requestStack, SessionInterface $session, LoggerInterface $logger, Security $security)
    {
        $this->em = $em;
        $this->request = $requestStack->getCurrentRequest();
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

    public function handleDeliveryAddress()
    {
        /* Récupération du body de la requête POST */
        $data = json_decode($this->request->getContent());

        /* Si aucune adresse existante n'est séléctionné, on ajoute la nouvel addresse
         * Sinon on récupère l'adresse existant.
         */
        if($data->existingAddress === 0)
        {
            $newAddress = new Address();

            $newAddress->setLocationName("Delivery address");
            $newAddress->setStreet($data->newAddress->street);
            $newAddress->setNumber($data->newAddress->number);
            $newAddress->setTown($data->newAddress->town);
            $newAddress->setState($data->newAddress->state);
            $newAddress->setZipCode($data->newAddress->zipCode);
            $newAddress->setCountry($data->newAddress->country);

            $address = $this->addAddress($newAddress);
        }else{
            try{
                $address = $this->em->getRepository(Address::class)
                    ->find($data->existingAddress);
            }catch (PDOException $exception){
                throw new EntityNotFoundException("The address with ID ( ".$data->existingAddress." ) does not exist ");
            }

        }

        return $address;

    }

    public function addAddress(Address $address): Address
    {
        $user = $this->security->getUser();

        try{
            $user = $this->em->getRepository(User::class)
                        ->findBy(['email' => $user->getUsername()]);

            $address->setUser($user);

            $this->em->persist($address);
            $this->em->flush();
        }catch(PDOException $exception){
            throw new UserNotFoundException("The user %s does not exist!", $user->getUsername());
        }

        return $address;
    }
}
