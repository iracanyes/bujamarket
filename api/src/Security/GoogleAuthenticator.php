<?php


namespace App\Security;

use App\Domain\MemberHandler;
use App\Entity\User;
use App\Entity\UserTemp;
use App\Exception\User\CreateMemberException;
use Doctrine\ORM\EntityManagerInterface;
use KnpU\OAuth2ClientBundle\Client\ClientRegistry;
use KnpU\OAuth2ClientBundle\Security\Authenticator\SocialAuthenticator;
use League\OAuth2\Client\Provider\GoogleUser;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\User\UserProviderInterface;

class GoogleAuthenticator extends SocialAuthenticator
{
    private $clientRegistry;
    private $em;
    private $router;
    private $memberHandler;

    public function __construct(ClientRegistry $clientRegistry, EntityManagerInterface $em, RouterInterface $router, MemberHandler $memberHandler)
    {
        $this->clientRegistry = $clientRegistry;
        $this->em = $em;
        $this->router = $router;
        $this->memberHandler = $memberHandler;
    }

    public function supports(Request $request)
    {
        dump("GoogleAuthenticator supports - request->getPathInfo", $request->getPathInfo());
        dump("GoogleAuthenticator supports - request", $request);
        return $request->getPathInfo() == '/connect_google' && $request->isMethod('POST');
    }

    public function getCredentials(Request $request)
    {
        return $this->fetchAccessToken($this->getGoogleClient());
    }

    public function getUser($credentials, UserProviderInterface $provider)
    {
        /**
         * @var GoogleUser $googleUser
         */
        $googleUser = $this->getGoogleClient()->fetchUserFromToken($credentials);

        $email = $googleUser->getEmail();

        $user = $this->em->getRepository(User::class)
            ->findOneBy(['email' => $email]);

        dump("GoogleAuthenticator getUser - Credentials",$credentials);

        if(!$user){
            $user = $this->create($credentials);
        }

        return $user;
    }

    public function create($credentials): UserTemp
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

        try{
            $member = $this->em->getRepository(User::class)
                ->findOneBy(['email'  => $data->email]);

            $newMember = $this->em->getRepository(UserTemp::class)
                ->findOneBy(['email' => $data->email]);

            if($member){
                throw new CreateMemberException("Username already used!");
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
     * @return \KnpU\OAuth2ClientBundle\Client\OAuth2ClientInterface
     */
    public function getGoogleClient()
    {
        return $this->clientRegistry
            ->getClient('google');
    }

    /**
     *  Returns a response that directs the user to authenticate.
     *
     * This is called when an anonymous request accesses a resource that
     * requires authentication. The job of this method is to return some
     * response that "helps" the user start into the authentication process.
     *
     * Examples:
     *  A) For a form login, you might redirect to the login page
     *      return new RedirectResponse('/login');
     *  B) For an API token authentication system, you return a 401 response
     *      return new Response('Auth header required', 401);
     *
     * @param Request $request
     * @param AuthenticationException|null $authException
     * @return Response
     */
    public function start(Request $request, AuthenticationException $authException = null)
    {
        return new Response('Auth header required', 401);
    }

    /**
     * Called when authentication executed, but failed (e.g. wrong username password).
     *
     * This should return the Response sent back to the user, like a
     * RedirectResponse to the login page or a 403 response.
     *
     * If you return null, the request will continue, but the user will
     * not be authenticated. This is probably not what you want to do.
     *
     * @param Request $request
     * @param AuthenticationException $authenticationException
     */
    public function onAuthenticationFailure(Request $request, AuthenticationException $authenticationException)
    {
        return new Response('Authentication failure', 403);
    }

    /**
     *  Called when authentication executed and was successful!
     *
     * This should return the Response sent back to the user, like a
     * RedirectResponse to the last page they visited.
     *
     * If you return null, the current request will continue, and the user
     * will be authenticated. This makes sense, for example, with an API.
     *
     * @param Request $request
     * @param TokenInterface $token
     * @param string $providerKey
     * @return null
     */
    public function onAuthenticationSuccess(Request $request, TokenInterface $token, $providerKey)
    {
        return null;
    }


}
