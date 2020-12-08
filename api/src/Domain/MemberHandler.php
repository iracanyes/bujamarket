<?php

namespace App\Domain;

use App\Entity\Address;
use App\Entity\Admin;
use App\Entity\Customer;
use App\Entity\Supplier;
use App\Entity\User;
use App\Entity\UserTemp;
use App\Exception\User\DeleteUserException;
use App\Exception\User\MemberNotFoundException;
use App\Exception\User\UnsubscribeException;
use App\Exception\User\UpdatePasswordException;
use App\Exception\User\UserNotAllowedToTakeSuchAction;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityNotFoundException;
use Doctrine\ORM\ORMException;
use Lexik\Bundle\JWTAuthenticationBundle\Exception\UserNotFoundException;
use mysql_xdevapi\Exception;
use Psr\Log\LoggerInterface;
use App\Responder\JsonResponder;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\SerializerInterface;
use App\Exception\User\CreateMemberException;

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
     * @var ImageHandler $imageHandler
     */
    private $imageHandler;

    /**
     * @var StripeHandler $stripeHandler
     */
    private $stripeHandler;

    /**
     * @var JsonResponder $jsonResponder
     */
    private $jsonResponder;

    /**
     * MemberHandler constructor.
     * @param EntityManagerInterface $em
     * @param RequestStack $request
     * @param UserPasswordEncoderInterface $encoder
     * @param SerializerInterface $serializer
     * @param LoggerInterface $logger
     * @param StripeHandler $stripeHandler
     */
    public function __construct(EntityManagerInterface $em,
                                RequestStack $request,
                                UserPasswordEncoderInterface $encoder,
                                SerializerInterface $serializer,
                                LoggerInterface $logger,
                                Security $security,
                                ImageHandler $imageHandler,
                                StripeHandler $stripeHandler,
                                JsonResponder $jsonResponder
    )
    {
        $this->em = $em;
        $this->request = $request->getCurrentRequest();
        $this->encoder = $encoder;
        $this->serializer = $serializer;
        $this->logger = $logger;
        $this->security = $security;
        $this->imageHandler = $imageHandler;
        $this->stripeHandler = $stripeHandler;
        $this->jsonResponder = $jsonResponder;
    }

    /**
     * Create a temporary member
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
        $user->setFirstname($data->firstname)
            ->setLastname($data->lastname)
            ->setEmail($data->email)
            ->setUserType($data->userType)
            ->setDateRegistration(new \DateTime())
            ->setTermsAccepted($data->termsAccepted);

        /* Encodage du mot de passe */
        if(empty($data->password)){
            throw new CreateMemberException("User's password not set!");
        }

        $user->setPassword($this->encoder->encodePassword($user, $data->password));

        // Création du token de sécurité
        $user->setToken(bin2hex(random_bytes(64)));

        try{
            $member = $this->em->getRepository(User::class)
                ->findOneBy(['email'  => $data->email]);

            $newMember = $this->em->getRepository(UserTemp::class)
                ->findOneBy(['email' => $data->email]);

            if($member){
                throw new CreateMemberException("Username already exist!");
            }

            if($newMember)
            {
                throw new CreateMemberException("Username already registered! Please check your email for validating your subscription.");
            }

        }catch (\Exception $e){
            $this->logger->error($e->getMessage(), ['context' => $e]);
            throw new CreateMemberException($e->getMessage());
        }

        /* Persistence de l'entité en DB */
        try{
            $this->em->persist($user);
            $this->em->flush();
        }catch(\Exception $e){
            $this->logger->error("Error while persisting the new member", ['context' => $e]);
            throw new CreateMemberException("Error while persisting the new member!");
        }





        /* On retourne le nouvel objet pour qu'il passe dans l'event system  */
        return $user;
    }

    /**
     * Get a temporary member
     * @return UserTemp|null
     */
    public function getUserTemp(): ?UserTemp
    {
        $data = $this->request->getContent();

        $data = json_decode($data);

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

    /**
     * Unlock a user's account
     * @return User|null
     */
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

            $this->em->persist($user);
            $this->em->flush();
        }catch (\Exception $exception){
            $this->logger->error($exception->getMessage(), ['exception' => $exception]);
        }

        return $user ?? null;


    }

    /**
     * Update a user's password
     * @return User|null
     * @throws UpdatePasswordException
     */
    public function updatePassword(): ?User
    {
        $data = $this->request->request->all();

        try{
            $connectedUser = $this->security->getUser();

            $user = $this->em->getRepository(User::class)
                ->findOneBy(["email" => $connectedUser->getUsername()]);

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

    /**
     * Get the user's profile
     * @throws MemberNotFoundException
     */
    public function getProfile()
    {
        try{
            $connectedUser = $this->security->getUser();

            if(!$connectedUser)
                throw new MemberNotFoundException("Authenticated user not found");

            switch ($connectedUser->getUserType())
            {
                case "admin":
                    $user = $this->em->getRepository(Admin::class)
                        ->getProfile( $connectedUser->getUsername());
                    break;
                case "supplier":
                    $user = $this->em->getRepository(Supplier::class)
                        ->getProfile($connectedUser->getUsername());
                    break;
                default:
                    $user = $this->em->getRepository(Customer::class)
                        ->getProfile( $connectedUser->getUsername());
                    break;
            }

        }catch (\Exception $exception){
            $this->logger->error(
                $exception->getMessage(),
                [
                    "exception" => $exception
                ]
            );
            throw new MemberNotFoundException("Impossible de récupèrer l'utilisateur connecté!");
        }


        return $this->jsonResponder->oneResult($user ,200, ['groups' => 'profile:output']);

    }

    /**
     * Update a user's profile
     * @return Supplier|object|null
     * @throws \Exception
     */
    public function updateProfile()
    {
        $connectedUser = $this->security->getUser();

        $data = $this->request->request->all();

        $image = $this->request->files->get('images');

        // Mise à jour des données de profil
        $user = $this->updateUserInfo($connectedUser, $data);

        if($image)
        {

            $this->imageHandler->uploadProfileImage($user);
        }

        return $user;


    }

    /**
     * Update user's entity informations
     * @param UserInterface $connectedUser
     * @param $data
     * @return Supplier|object|null
     */
    public function updateUserInfo(UserInterface $connectedUser, $data)
    {
        try{
            $user = $this->em->getRepository(User::class)
                ->findOneBy(['email' => $connectedUser->getUsername()]);

            if(!$connectedUser instanceof User)
                throw new MemberNotFoundException(sprintf("User %s not found", $data["firstname"]." ".$data["lastname"]));

            /* Update member info */
            $user->setFirstname($data['firstname'])
                ->setLastname($data['lastname'])
                ->setLanguage($data['language'])
                ->setCurrency($data['currency']);



            if($user instanceof Supplier)
            {
                $user->getAddresses()[0]->setStreet($data["addresses"][0]["street"]);
                $user->getAddresses()[0]->setNumber($data["addresses"][0]["number"]);
                $user->getAddresses()[0]->setTown($data["addresses"][0]["town"]);
                $user->getAddresses()[0]->setState($data["addresses"][0]["state"]);
                $user->getAddresses()[0]->setZipCode($data["addresses"][0]["zipCode"]);
                $user->getAddresses()[0]->setCountry($data["addresses"][0]["country"]);

                $user->setBrandName($data['brandName'])
                    ->setSocialReason($data['socialReason'])
                    ->setTradeRegistryNumber($data['tradeRegistryNumber'])
                    ->setVatNumber($data['vatNumber'])
                    ->setContactFullname($data['contactFullname'])
                    ->setContactPhoneNumber($data['contactPhoneNumber'])
                    ->setContactEmail($data['contactEmail'])
                    ->setWebsite($data['website']);
            }

            $this->em->persist($user);
            $this->em->flush();

        }catch (\Exception $exception){
            throw new UpdateProfileException(sprintf("Unable to update the user profile %s", $connectedUser->getEmail()));
        }

        return $user;
    }

    /**
     * Set roles for a new member
     * @param User $user
     */
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
     * Create a new member
     * @return User
     * @throws \Exception
     */
    public function createMember(): User
    {
        dump("MemberHandler createMember - this->request", $this->request);
        dump("MemberHandler createMember - \$this->request->request->get('userType')", $this->request->request->get('userType'));

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
                $user->setEmail($userTemp->getEmail())
                    ->setPassword($userTemp->getPassword())
                    ->setAccountType($userTemp->getAccountType());

                /* Création des rôles de sécurité pour l'utilisateur */
                $this->setUserRoles($user);


            }else{
                $message = sprintf("Confirmation d'inscription du nouveau membre impossible! \nLe nouveau membre n'existe pas.\nToken: %s", $this->request->request->get('token'));

                /* Log du message d'erreur */
                $this->logger->error($message);
                throw new MemberNotFoundException($message);

            }

        }catch (\Exception $e){
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

    /**
     * Set customer's data
     * @param Customer $user
     * @throws \Exception
     */
    public function setCustomerData(Customer $user): void
    {
        /* Création du client sur la platforme Stripe */
        $stripeCustomer = $this->stripeHandler->createCustomer($user);

        /* Création d'une clé client */
        $user->setCustomerKey($stripeCustomer->id);
        $user->setSigninConfirmed(true);
    }

    /**
     * Get supplier data
     * @param Supplier $user
     * @throws \Exception
     */
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
        $user->setWebsite($this->request->request->get('website '));

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

        /* Création d'une clé supplier sur Stripe */
        $user->setSupplierKey(bin2hex(random_bytes(64)));
    }

    /**
     * Get user
     * @return object|null
     */
    public function getUser()
    {
        try{
            $user = $this->em->getRepository(User::class)
                ->findOneBy(["email" => $this->security->getUser()->getUsername()]);
        }catch(\Exception $exception){
            throw new UserNotFoundException("email", $this->security->getUser()->getUsername());
        }

        return $user;
    }

    /**
     * Get a customer
     * @param null $data
     * @return Customer|null
     * @throws \Exception
     */
    public function getCustomer($data = null): ?Customer
    {

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

            if(!$customer instanceof Customer){
                throw new MemberNotFoundException("Error while retrieving the member");
            }
            dump($customer);
            return $customer;

        }catch(\Exception $exception){
            $this->logger->error('Error while retrieving a member',  ['parameters' => $data, "context" => $exception]);
            throw new MemberNotFoundException("Error while retrieving a member");
        }


    }

    /**
     * Authorize a supplier to publish
     * @return object|null
     * @throws UserNotAllowedToTakeSuchAction
     */
    public function authorizePublishing()
    {
        $admin = $this->security->getUser();

        if(!$admin instanceof Admin)
        {
            throw new UserNotAllowedToTakeSuchAction(sprintf("User not allowed to take such action"));
        }

        $idSupplier = $this->request->attributes->get('id');

        try {
            $supplier = $this->em->getRepository(Supplier::class)
                ->find((int) $idSupplier);

            $supplier->setRoles(array_push($supplier->getRoles(), 'ROLE_PUBLISHER'));
        }catch (\Exception $exception){
            $this->logger->error("Error while authorizing a supplier to publish");
        }

        return $supplier;
    }

    /**
     * Unauthorize a supplier to publish
     *
     * @return object|null
     * @throws MemberNotFoundException
     * @throws UserNotAllowedToTakeSuchAction
     */
    public function unauthorizePublishing()
    {
        $admin = $this->security->getUser();

        if(!$admin instanceof Admin)
        {
            throw new UserNotAllowedToTakeSuchAction(sprintf("User not allowed to take such action"));
        }

        $idSupplier = $this->request->attributes->get('id');

        try {
            $supplier = $this->em->getRepository(Supplier::class)
                ->find((int) $idSupplier);

            $roles = $supplier->getRoles();
            $supplier->setRoles(array_slice($roles, array_search('ROLE_PUBLISHER'), 1));
        }catch (\Exception $exception){

            $this->logger->error("Error while unauthorizing a supplier to publish");
            throw new MemberNotFoundException("Error while unauthorizing a supplier to publish");
        }

        return $supplier;
    }


    public function unsubscribe()
    {
        $connectedUser = $this->security->getUser();
        $data = json_decode($this->request->getContent(), true);

        if(!$connectedUser instanceof UserInterface)
        {
            throw new MemberNotFoundException("Error while retrieving the authenticated user!");
        }

        try{
            $user = $this->em->getRepository(User::class)
                ->findOneBy(['email' => $connectedUser->getUsername()]);

            if(!$user instanceof User || ($user->getEmail() !== $data['username'])){
                throw new UnsubscribeException("Unidentified user!");
            }

            $user->setRoles([]);
            $user->setSigninConfirmed(false);

            $this->em->persist($user);
            $this->em->flush();
        }catch (\Exception $exception){
            $this->logger->error("Error while persisting the user!", ['context' => $exception]);
            throw new UnsubscribeException("Error while persisting the user!");

        }

        return $user;

    }

    public function deleteUser()
    {
        $admin = $this->security->getUser();
        $data = $this->request->request->all();

        if(!$admin instanceof UserInterface)
        {
            throw new MemberNotFoundException("Error while retrieving the authenticated user!");
        }


        try{
            $user = $this->em->getRepository(User::class)
                ->findOneBy(['id' => $data['id'], 'email' => $data['username']]);

            $this->em->remove($user);
            $this->em->flush();
        }catch(\Exception $exception){
            $this->logger->error("Error while removing a user!", ['context' => $exception]);
            throw new DeleteUserException("Error while removing a user!");
        }

        return [
            "message" => sprintf('User %s is deleted', $data['email'])
        ];
    }



}
