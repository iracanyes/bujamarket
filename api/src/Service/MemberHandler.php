<?php


namespace App\Service;


use App\Entity\Address;
use App\Entity\Customer;
use App\Entity\Supplier;
use App\Entity\User;
use App\Entity\UserTemp;
use App\Exception\User\MemberNotFoundException;
use Doctrine\DBAL\Driver\PDOException;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityNotFoundException;
use Doctrine\ORM\ORMException;
use Lexik\Bundle\JWTAuthenticationBundle\Exception\UserNotFoundException;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Serializer\SerializerInterface;

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

    /**
     * MemberHandler constructor.
     * @param EntityManagerInterface $em
     * @param RequestStack $request
     * @param UserPasswordEncoderInterface $encoder
     * @param SerializerInterface $serializer
     * @param LoggerInterface $logger
     */
    public function __construct(EntityManagerInterface $em, RequestStack $request, UserPasswordEncoderInterface $encoder,SerializerInterface $serializer, LoggerInterface $logger, Security $security)
    {
        $this->em = $em;
        $this->request = $request->getCurrentRequest();
        $this->encoder = $encoder;
        $this->serializer = $serializer;
        $this->logger = $logger;
        $this->security = $security;
    }

    /**
     * @return User
     * @throws \Exception
     */
    public function create(): UserTemp
    {
        /* Récupération des données de la requête */
        $data = $this->request->getContent();


        dump($data);


        /* Deserialisation
        *  comme objet : json_decode( $data)
         * comme tableau : json_decode( $data, true)
        */
        $data = json_decode($data);
        dump($data);


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

    public function subscribe(): User
    {
        $data = $this->request->getContent();

        dump($data);

        $data = json_decode($data);

        dump($data);

        /* Création du nouveau membre */
        $user = $this->createMember($data);

        dump($user);

        /* Données client */
        if($user instanceof Customer)
        {
            $this->setCustomerData($user);
        }

        /* Données fournisseur */
        if($user instanceof Supplier){
            $this->setSupplierData($user, $data);
        }

        /* Persistence de l'entité en DB */
        $this->em->persist($user);
        $this->em->flush();

        return $user;
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
     * @param $data
     * @return User
     * @throws \Exception
     */
    public function createMember($data): User
    {

        switch($data->userType)
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

        $user->setFirstname($data->firstname);
        $user->setLastname($data->lastname);
        $user->setEmail($data->email);
        $user->setDateRegistration(new \DateTime());
        $user->setLanguage($data->language);
        $user->setCurrency($data->currency);

        /* Création d'un token de sécurité pour communication externe pour le nouveau membre */
        $user->setToken(bin2hex(random_bytes(64)));

        try{
            /* Récupération du mot de passe originale  */
            $userTemp = $this->em->getRepository(UserTemp::class)
                ->findOneBy(['token' => $data->token]);

            if($userTemp !== null)
            {
                /* Transfert du mot de passe enregistré à l'inscription */
                $user->setPassword($userTemp->getPassword());

                /* Création des rôles de sécurité pour l'utilisateur */
                $this->setUserRoles($user);


            }else{
                $message = sprintf("Confirmation d'inscription du nouveau membre impossible! \nLe nouveau membre n'existe pas.\nToken: %s", $data->token);

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

    public function setSupplierData(Supplier $user, $data): void
    {
        /* Données fournisseurs */
        $user->setSocialReason($data->socialReason);
        $user->setBrandName($data->brandName);
        $user->setTradeRegistryNumber($data->tradeRegistryNumber);
        $user->setVatNumber($data->vatNumber);
        $user->setContactFullname($data->contactFullname);
        $user->setContactPhoneNumber($data->contactPhoneNumber);
        $user->setContactEmail($data->contactEmail);
        $user->setWebsite($data->website ?? '');

        /* Siége social */
        $address = new Address();
        $address->setLocationName($data->address->locationName);
        $address->setStreet($data->address->street);
        $address->setNumber($data->address->number);
        $address->setTown($data->address->town);
        $address->setState($data->address->state);
        $address->setZipCode($data->address->zipCode);
        $address->setCountry($data->address->country);
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
