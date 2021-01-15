<?php


namespace App\Domain;


use App\Entity\User;
use App\Entity\UserTemp;
use App\Exception\User\CreateMemberException;
use App\Exception\User\GoogleAuthenticationException;
use App\Exception\User\GoogleRegistrationException;
use App\Responder\JsonResponder;
use Doctrine\ORM\EntityManagerInterface;
use League\OAuth2\Client\Provider\Exception\IdentityProviderException;
use League\OAuth2\Client\Provider\GoogleUser;
use League\OAuth2\Client\Token\AccessToken;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Psr\Log\LoggerInterface;
use KnpU\OAuth2ClientBundle\Client\ClientRegistry;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Security\Core\Security;

class GoogleUserHandler
{
    /**
     * @var EntityManagerInterface $em
     */
    private $em;

    /**
     * @var LoggerInterface $logger
     */
    private $logger;

    /**
     * @var \Symfony\Component\HttpFoundation\Request|null $request
     */
    private $request;

    /**
     * @var ClientRegistry $clientRegistry
     */
    private $clientRegistry;

    /**
     * @var Security $security
     */
    private $security;

    /**
     * @var JsonResponder $jsonResponder
     */
    private $jsonResponder;

    /**
     * @var JWTTokenManagerInterface $JWTTokenManager
     */
    private $JWTTokenManager;

    public function __construct(EntityManagerInterface $em, LoggerInterface $logger, ClientRegistry $clientRegistry, RequestStack $requestStack, Security $security, JsonResponder $jsonResponder, JWTTokenManagerInterface $JWTTokenManager){
        $this->em = $em;
        $this->logger = $logger;
        $this->request = $requestStack->getCurrentRequest();
        $this->clientRegistry = $clientRegistry;
        $this->security = $security;
        $this->jsonResponder = $jsonResponder;
        $this->JWTTokenManager = $JWTTokenManager;
    }

    /**
     * Link to this method to start the "connect" process
     * @return UserTemp|User
     */
    public function authentication()
    {
        $data = json_decode($this->request->getContent());
        $dataArray = json_decode($this->request->getContent(), true);


        $client = $this->clientRegistry
            ->getClient('google');


        $provider = $client->getOAuth2Provider();



        try{
            // Conversion des données de requête en token
            $token = new AccessToken($dataArray['xc']);


            // Récupération de l'utilisateur via son token
            /**
             * @var GoogleUser
             */
            $googleUser = $client->fetchUserFromToken($token);


            // Utilisateur existe en DB
            $user = $this->em->getRepository(User::class)
                ->findOneBy(['email' => $googleUser->getEmail()]);

            if(!$user){
                throw new GoogleAuthenticationException("User not registered!");
            }


        }catch (IdentityProviderException $e){
            throw new GoogleAuthenticationException($e->getMessage());
        }



        return $this->jsonResponder->success([
            "token" => $this->JWTTokenManager->create($user)
        ], 200);
    }

    public function register()
    {
        // donnée de requête
        $data = json_decode($this->request->getContent(), true);

        if($data['termsAccepted'] !== true){
            throw new GoogleRegistrationException("Read and accept the terms  for using this platform!");
        }

        $client = $this->clientRegistry->getClient('google');

        try{
            $token = new AccessToken($data['response']['tokenObj']);
            /**
             * @var GoogleUser
             */
            $googleUser = $client->fetchUserFromToken($token);

            $user  = $this->em->getRepository(User::class)
                ->findOneBy(['email' => $googleUser->getEmail()]);

            $userTemp = $this->em->getRepository(UserTemp::class)
                ->findOneBy(['email' => $googleUser->getEmail()]);



            // Création de l'utilisateur
            if(!$user){
                if($userTemp){
                    $user = $userTemp;
                }else{
                    $user = $this->createMember($googleUser, $data['userType']);
                }
            }else{
                throw new GoogleAuthenticationException("User already exist!");
            }
        }catch (\Exception $e){
            throw new GoogleAuthenticationException($e->getMessage());
        }


        return $this->jsonResponder->oneResult($user, 200, ['groups' => 'google_user_temp:output']);

    }

    public function createMember(GoogleUser $data, string $userType): UserTemp
    {
        $member = new UserTemp();

        $member->setFirstname($data->getFirstName())
            ->setLastname($data->getLastName())
            ->setEmail($data->getEmail())
            ->setDateRegistration(new \DateTime())
            ->setPassword(null)
            ->setTermsAccepted(true)
            ->setToken(bin2hex(random_bytes(64)))
            ->setUserType($userType)
            ->setAccountType('google');

        try{
            $this->em->persist($member);
            $this->em->flush();

        }catch (\Exception $e){
            throw new CreateMemberException($e->getMessage());
        }

        return $member;
    }


}
