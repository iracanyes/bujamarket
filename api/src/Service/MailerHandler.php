<?php


namespace App\Service;


use App\Entity\User;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Twig\Environment;

class MailerHandler
{
    private $request;
    private $mailer;
    private $templating;

    private $logger;

    public function __construct(RequestStack $requestStack, \Swift_Mailer $mailer, Environment $templating, LoggerInterface $logger)
    {
        $this->request = $requestStack->getCurrentRequest();
        $this->templating = $templating;
        $this->mailer = $mailer;
        $this->logger = $logger;
    }

    public function onAccountLocked(User $user)
    {
        if(!$user instanceof User)
            return;

        try{
            $message = (new \Swift_Message(getenv("APP_FULLNAME")." - Compte bloqué: 4 tentatives de connexion infructueuses!"))
                ->setFrom('admin@'.$this->request->headers->get('host'))
                ->setTo($user->getEmail())
                ->setBody(
                    $this->templating->render(
                        "emails/locked_account.html.twig",
                        [
                            'user' => $user,
                            'url_unlock_account' => getenv("APP_HOST_URL")."/unlock_account/".$user->getToken(),
                            'url_login_fraud' => getenv("APP_HOST_URL")."/login_fraud/".$user->getToken()
                        ]
                    ),
                    "text/html"
                );

            $this->mailer->send($message);

        }catch (\Exception $exception){
            $this->logger->error("Envoie e-mail (Compte bloqué) impossible", ["exception" => $exception]);
        }


    }
}
