<?php


namespace App\EventListener\Authentication;

use App\Entity\User;
use App\Exception\User\MemberNotFoundException;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\ORMException;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationFailureEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Response\JWTAuthenticationFailureResponse;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Twig\Environment;
use App\Domain\MailerHandler;

class AuthenticationFailureListener
{
    private $em;
    private $request;
    private $mailerHandler;
    private $logger;

    public function __construct(RequestStack $requestStack, EntityManagerInterface $em, MailerHandler $mailerHandler, LoggerInterface $logger)
    {
        $this->em = $em;
        $this->request = $requestStack->getCurrentRequest();
        $this->mailerHandler = $mailerHandler;
        $this->logger = $logger;
    }

    public function onAuthenticationFailureResponse(AuthenticationFailureEvent $event): void
    {
        if( 0 === strpos($this->request->headers->get('Content-Type'), 'application/json'))
            $data = json_decode($this->request->getContent(), true);

        dump($data);

        $email = $data["email"];
        dump($email);

        try{
            $user = $this->em->getRepository(User::class)
                ->findOneBy(["email" => $email]);

            if(!$user)
            {
                $data = [
                    "code" => 401,
                    "status" => "401 Unauthorized",
                    "message" => "Bad Credentials, please verify that your username are correctly set!"
                ];
                $response = new JWTAuthenticationFailureResponse($data);
            }else{
                // Si l'utilisateur n'est pas banni ou temporairement bloqué, on compte le nbre de connexion erronée
                if(!$user->getBanned() && !$user->getLocked())
                {
                    /* Si le nombre d'erreurs de connexion de l'utilisateur est compris entre 0 et 2, on incrémente le compteur des erreurs
                     * Sinon, on bannit l'utilisateur et on envoie un message de modification de mot de passe à l'adresse associé
                     */
                    if($user->getNbErrorConnection() >= 0 && $user->getNbErrorConnection() < 3)
                    {
                        $user->setNbErrorConnection($user->getNbErrorConnection() + 1);
                        $data = [
                            "code" => 401,
                            "status" => "401 Unauthorized",
                            "message" => "Bad Credentials, please verify that your password is correctly set!"
                        ];
                        $response = new JWTAuthenticationFailureResponse($data);
                    }else{
                        //blocage du compte de l'utilisateur et remise à zéro du compteur de connexion erronée
                        $user->setNbErrorConnection(0);
                        $user->setLocked(true);

                        // Envoie e-mail de déblocage du compte
                        $this->mailerHandler->onAccountLocked($user);

                        $data = [
                            "code" => 401,
                            "status" => "401 Unauthorized",
                            "message" => "Account locked! We send you an email for unlocking this account!"
                        ];
                        $response = new JWTAuthenticationFailureResponse($data);

                    }
                }else{
                    if($user->getLocked())
                    {
                        $data = [
                            "code" => 401,
                            "status" => "401 Unauthorized",
                            "message" => "Account locked! Please read your emails, we send you one for unlocking this account!"
                        ];
                        $response = new JWTAuthenticationFailureResponse($data);
                    }else{
                        $data = [
                            "code" => 401,
                            "status" => "401 Unauthorized",
                            "message" => "Account banned! Please contact the administrator of this platform!"
                        ];
                        $response = new JWTAuthenticationFailureResponse($data);
                    }

                }

                $this->em->persist($user);
                $this->em->flush();
            }



            $event->setResponse($response);

        }catch(ORMException $exception)
        {
            $this->logger->warning(`Error while processing Authentication Failure Listener!`);
        }


    }
}
