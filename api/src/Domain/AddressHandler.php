<?php


namespace App\Domain;

use App\Entity\Address;
use App\Entity\User;
use App\Exception\Address\UnauthorizedDeleteException;
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
        }catch(\Exception $e){
            $message = sprintf('PDOException [%s]: \n %s', $e->getCode(), $e->getMessage());
            $this->logger->error($message);

            throw $e;
        }


        return $addresses;
    }

    public function getDeliveryAddress($data)
    {

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
            }catch (\Exception $exception){
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
                        ->findOneBy(['email' => $user->getUsername()]);
            dump($user);
            $address->setUser($user);

            $this->em->persist($address);
            $this->em->flush();
        }catch(\Exception $exception){
            throw new UserNotFoundException("The user %s does not exist!", $user->getUsername());
        }

        return $address;
    }

    public function createAddress(): Address
    {
        $data = json_decode($this->request->getContent(), false);
        dump($data);
        $address = new Address();
        $address->setLocationName($data->locationName)
            ->setStreet($data->street)
            ->setNumber($data->number)
            ->setTown($data->town)
            ->setState($data->state)
            ->setZipCode($data->zipCode)
            ->setCountry($data->country);

        return $this->addAddress($address);
    }

    public function deleteAddress(Address $address): array
    {
        $user = $this->security->getUser();

        if($user->getEmail() !== $address->getUser()->getEmail())
            throw new UnauthorizedDeleteException("Unauthorized delete address action");

        try{


            $this->em->remove($address);
            $this->em->flush();

        }catch (\Exception $exception){
            $this->logger->alert("Error occured during an attempt to delete an address", ['context' => $exception, 'user' => $user]);
        }

        return [
            "@id" => "/address/".$address->getId(),
            "@context" => '/Address/'.$address->getId(),
            "hydra:description"=> sprintf("Address '%s' deleted!", $address->getStreet().' '.$address->getNumber().', '.$address->getZipCode().' '.$address->getTown())
        ];
    }
}
