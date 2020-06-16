<?php

namespace App\Service;

use App\Entity\Address;
use App\Entity\Admin;
use App\Entity\Customer;
use App\Entity\Supplier;
use App\Entity\User;
use App\Entity\UserTemp;
use App\Exception\User\MemberNotFoundException;
use App\Exception\User\UpdatePasswordException;
use Doctrine\DBAL\Driver\PDOException;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityNotFoundException;
use Doctrine\ORM\ORMException;
use Lexik\Bundle\JWTAuthenticationBundle\Exception\UserNotFoundException;
use mysql_xdevapi\Exception;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\SerializerInterface;
use function MongoDB\BSON\fromJSON;

class MemberHandler
{

    protected $entityClass = UserTemp::class;
    /**
     * @var EntityManagerInterface
     */
    private $em;

    /**
     * @var \Symfony\Component\HttpFoundation\Request|null
     */
    private $request;

    /**
     * @var UserPasswordEncoderInterface
     */
    private $encoder;

    /**
     * @var SerializerInterface
     */
    private $serializer;

    /**
     * @var LoggerInterface
     */
    private $logger;

    /**
     * @var Security $security
     */
    private $security;

    private $imageHandler;

    /**
     * MemberHandler constructor.
     * @param EntityManagerInterface $em
     * @param RequestStack $request
     * @param UserPasswordEncoderInterface $encoder
     * @param SerializerInterface $serializer
     * @param LoggerInterface $logger
     */
    public function __construct(EntityManagerInterface $em,
                                RequestStack $request,
                                UserPasswordEncoderInterface $encoder,
                                SerializerInterface $serializer,
                                LoggerInterface $logger,
                                Security $security,
                                ImageHandler $imageHandler
    )
    {
        $this->em = $em;
        $this->request = $request->getCurrentRequest();
        $this->encoder = $encoder;
        $this->serializer = $serializer;
        $this->logger = $logger;
        $this->security = $security;
        $this->imageHandler = $imageHandler;
    }

    /**
     * Create a new member
     * @return User
     * @throws \Exception
     */
    public function create(): UserTemp
    {

        /* Récupération des données de la requête */
        $data = $this->request->getContent();

        /* Deserialisation
        *  comme objet : json_decode( $data)
         * comme tableau : json_decode( $data, true)
        */
        $data = json_decode($data);

        $user = new UserTemp();
        $user->setFirstname($data->firstname);
        $user->setLastname($data->lastname);
        $user->setEmail($data->email);
        $user->setUserType($data->userType);
        $user->setDateRegistration(new \DateTime());
        $user->setTermsAccepted($data->termsAccepted);

        /* Encodage du mot de passe */
        $user->setPassword($this->encoder->encodePassword($user, $data->password));

        // Création du token de sécurité
        $user->setToken(bin2hex(random_bytes(64)));

        /* Persistence de l'entité en DB */
        $this->em->persist($user);
        $this->em->flush();




        /* On retourne le nouvel objet pour qu'il passe dans l'event system  */
        return $user;
    }

    public function getUserTemp(): ?UserTemp
    {
        $data = $this->request->getContent();

        dump($data);
        $data = json_decode($data);
        dump($data);

        /* Récupération de l'utilisateur inscrit via son token */
        $user = $this->em->getRepository(UserTemp::class)
            ->findOneBy(['token' => $data->token]);

        return $user;

    }

    /**
     * Create a new customer or supplier and validate the sign-in
     * @return User
     * @throws \Exception
     */
    public function subscribe(): User
    {

        /* Création du nouveau objet User (member) */
        $user = $this->createMember();

        dump($user);

        /* Données client */
        if($user instanceof Customer)
        {
            $this->setCustomerData($user);
        }

        /* Données fournisseur */
        if($user instanceof Supplier){
            $this->setSupplierData($user);
        }

        /* Confirmé l'inscription  */
        $user->setSigninConfirmed(true);

        /* Persistence de l'entité en DB */
        $this->em->persist($user);
        $this->em->flush();

        return $user;
    }

    public function unlockAccount(): ?User
    {
        $data = $this->request->request->all();

        try{
            $user = $this->em->getRepository(User::class)
                ->findOneBy(['token' => $data['token']]);

            if(!$user instanceof UserInterface || !$user instanceof User)
                return null;

            $user->setLocked(false);
            $user->setPassword($this->encoder->encodePassword($user, $data['password']));

            dump($user);

            $this->em->persist($user);
            $this->em->flush();
        }catch (\Exception $exception){
            $this->logger->error($exception->getMessage(), ['exception' => $exception]);
        }

        return $user ?? null;


    }

    public function updatePassword(): ?User
    {
        $data = $this->request->request->all();

        try{
            $connectedUser = $this->security->getUser();
            dump($connectedUser);
            $user = $this->em->getRepository(User::class)
                ->findOneBy(["email" => $connectedUser->getUsername()]);
            dump($user);
            // Vérification de l'ancien mot de passe
            $validPassword = $this->encoder->isPasswordValid($user, $data['password']);

            if(!$validPassword)
                throw new UpdatePasswordException("L'ancien mot de passe ne correspond pas à l'utilisateur connecté!");

            if(strcmp($data["newPassword"], $data["confirmPassword"]) == 0)
                $user->setPassword($this->encoder->encodePassword($user, $data['confirmPassword']));

            $this->em->persist($user);
            $this->em->flush();

        }catch (\Exception $exception){
            $this->logger->error($exception->getMessage(), ['exception' => $exception]);
            throw new UpdatePasswordException("Le mot de passe ne correspond pas à l'utilisateur connecté!");
        }

        return isset($user) ? $user : null;
    }

    public function getProfile()
    {
        try{
            $connectedUser = $this->security->getUser();
            dump($connectedUser);
            dump($connectedUser->getUsername());

            if(!$connectedUser)
                throw new MemberNotFoundException("Authenticated user not found");

            switch (true)
            {
                case in_array('ROLE_ADMIN', $connectedUser->getRoles()):
                    $user = $this->em->getRepository(Admin::class)
                        ->getProfile( $connectedUser->getUsername());
                    break;
                case in_array('ROLE_SUPPLIER', $connectedUser->getRoles()) && !in_array('ROLE_ADMIN', $connectedUser->getRoles()):
                    $user = $this->em->getRepository(Supplier::class)
                        ->getProfile($connectedUser->getUsername());
                    break;
                default:
                    $user = $this->em->getRepository(Customer::class)
                        ->getProfile( $connectedUser->getUsername());
                    break;
            }

            dump($user);

        }catch (\Exception $exception){
            $this->logger->error(
                $exception->getMessage(),
                [
                    "exception" => $exception
                ]
            );
            throw new MemberNotFoundException("Impossible de récupèrer l'utilisateur connecté!");
        }


        return new JsonResponse([
            "@context" => "/context/".ucfirst($user->getUserType()),
            "@id" => "/".$user->getUserType()."/".$user->getId(),
            "@type" => "https://schema.org/".ucfirst($user->getUserType()),
            "hydra:member" => [$this->serializer->normalize($user, null, ['groups' => 'profile:output'])]
        ]);

    }

    public function setUserRoles(User $user): void
    {

        switch($user->getUserType())
        {
            case 'customer':
                $roles = ['ROLE_CUSTOMER','ROLE_MEMBER','ROLE_ALLOWED_TO_SWITCH'];
                break;
            case 'supplier':
                $roles = ['ROLE_SUPPLIER','ROLE_MEMBER','ROLE_ALLOWED_TO_SWITCH'];
                break;
            default:
                $roles = ['ROLE_MEMBER'];
                break;
        }

        $user->setRoles(array_unique($roles));
    }

    /**
     *
     * @return User
     * @throws \Exception
     */
    public function createMember(): User
    {

        switch($this->request->request->get('userType'))
        {
            case 'customer':
                $user = new Customer();
                break;
            case 'supplier':
                $user = new Supplier();
                break;
            default:
                $user = new User();
                break;
        }

        $user->setFirstname($this->request->request->get('firstname'));
        $user->setLastname($this->request->request->get('lastname'));
        $user->setEmail($this->request->request->get('email'));
        $user->setDateRegistration(new \DateTimeImmutable());
        $user->setLanguage($this->request->request->get('language'));
        $user->setCurrency($this->request->request->get('currency'));

        /* Création d'un token de sécurité pour communication externe pour le nouveau membre */
        $user->setToken(bin2hex(random_bytes(64)));

        try{
            /* Récupération du mot de passe originale  */
            $userTemp = $this->em->getRepository(UserTemp::class)
                ->findOneBy(['token' => $this->request->request->get('token')]);

            if($userTemp !== null)
            {
                /* Transfert du mot de passe enregistré à l'inscription */
                $user->setPassword($userTemp->getPassword());

                /* Création des rôles de sécurité pour l'utilisateur */
                $this->setUserRoles($user);


            }else{
                $message = sprintf("Confirmation d'inscription du nouveau membre impossible! \nLe nouveau membre n'existe pas.\nToken: %s", $this->request->request->get('token'));

                /* Log du message d'erreur */
                $this->logger->error($message);
                throw new MemberNotFoundException($message);

            }

        }catch (PDOException $e){
            $message = sprintf('PDOException [%s]: \n %s', $e->getCode(), $e->getMessage());

            /* Log du message d'erreur */
            $this->logger->error($message);

            throw $e;


        }
        catch(\Exception $e){
            $message = sprintf('Exception [%s]: %s', $e->getCode(), $e->getMessage());

            /* Log du message d'erreur */
            $this->logger->error($message);

            throw $e;
        }

        // Changement de token de sécurité pour l'utilisateur temporaire si confirmation inscription validé.
        // REMARQUE: mettre dans la méthode eraseCredentials
        $userTemp->setToken(bin2hex(random_bytes(64)));

        // Sauvegarde de l'image de profil
        $user = $this->imageHandler->uploadProfileImage($user);

        /* Persistence de l'utilisateur temporaire */
        $this->em->persist($userTemp);


        return $user;
    }

    public function setCustomerData(Customer $user): void
    {
        /* Création d'une clé client */
        $user->setCustomerKey(bin2hex(random_bytes(64)));
        $user->setSigninConfirmed(true);
    }

    public function setSupplierData(Supplier $user):void
    {
        /* Données fournisseurs */
        $user->setSocialReason($this->request->request->get('socialReason'));
        $user->setBrandName($this->request->request->get('brandName'));
        $user->setTradeRegistryNumber($this->request->request->get('tradeRegistryNumber'));
        $user->setVatNumber($this->request->request->get('vatNumber'));
        $user->setContactFullname($this->request->request->get('contactFullname'));
        $user->setContactPhoneNumber($this->request->request->get('contactPhoneNumber'));
        $user->setContactEmail($this->request->request->get('contactEmail'));
        $user->setWebsite($this->request->request->get('website ') ?? '');

        /* Siége social */
        $address = new Address();
        $address->setLocationName("Head office");
        $address->setStreet($this->request->request->get('address')['street']);
        $address->setNumber($this->request->request->get('address')['number']);
        $address->setTown($this->request->request->get('address')['town']);
        $address->setState($this->request->request->get('address')['state']);
        $address->setZipCode($this->request->request->get('address')['zipCode']);
        $address->setCountry($this->request->request->get('address')['country']);
        $user->addAddress($address);

        /* Création d'une clé supplier */
        $user->setSupplierKey(bin2hex(random_bytes(64)));
    }

    public function getUser()
    {
        try{
            $user = $this->em->getRepository(User::class)
                ->findOneBy(["email" => $this->security->getUser()->getUsername()]);
        }catch(PDOException $exception){
            throw new UserNotFoundException("email", $this->security->getUser()->getUsername());
        }

        return $user;
    }

    public function getCustomer($data = null): ?Customer
    {
        /* Pr test webhook
        if(getenv('DEBUG_WEBHOOK') === 1 && $data !== null)
        {
            $data->customer_email = 'guillaume52@pinto.com';
        }
        */

        dump($data);

        try{
            switch(true)
            {
                case $data === null :
                    $customer = $this->em->getRepository(Customer::class)
                        ->findOneBy(["email" => $this->security->getUser()->getUsername()]);
                    break;
                case $data->customer_email !== null:
                    $customer = $this->em->getRepository(Customer::class)
                        ->findOneBy(['email' => $data->customer_email]);
                    break;
                case $data->customer !== null:
                    $customer = $this->em->getRepository(Customer::class)
                        ->findOneBy(['customerKey' => $data->customer]);
                    break;
                case $data->client_reference_id !== null:
                    $customer = $this->em->getRepository(Customer::class)
                        ->findOneBy(['customerKey' => $data->client_reference_id]);
                    break;
                default:
                    throw new \Exception('Customer not found for this checkout session');
                    break;
            }



        }catch(PDOException $exception){
            throw new UserNotFoundException("email", $this->security->getUser()->getUsername());
        }

        return $customer;
    }



}
