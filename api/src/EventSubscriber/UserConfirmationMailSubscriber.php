<?php


namespace App\EventSubscriber;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\User;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\GetResponseForControllerResultEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class UserConfirmationMailSubscriber implements EventSubscriberInterface
{
    private $mailer;

    private $templating;

    public function __construct(\Swift_Mailer $mailer, \Twig_Environment $twig_Environment)
    {
        $this->mailer = $mailer;
        $this->templating = $twig_Environment;

    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['sendMail', EventPriorities::POST_WRITE],
        ];
    }

    public function sendMail(GetResponseForControllerResultEvent $event): void
    {
        $user = $event->getControllerResult();
        $request = $event->getRequest();
        $method= $request->getMethod();

        if(!$user instanceof User || Request::METHOD_POST !== $method)
        {
            return;
        }

        $message = (new \Swift_Message("Confirmation : Inscription à la plateforme d'E-commerce Buja Market"))
            ->setFrom('admin@'.$request->server->get('HTTP_HOST'))
            ->setTo($user->getEmail())
            ->setBody(
                $this->templating->render(
                    'emails/confirmation.html.twig',
                    [
                        'user' => $user,
                        'url_confirmation' => 'https://'.$request->server->get('HTTP_HOST').'/confirmation/'.$user->getToken(),
                        'url_unsubscribe' => 'https://'.$request->server->get('HTTP_HOST').'/unsubscribe/'.$user->getToken()
                    ]
                )
            );

        $this->mailer->send($message);
    }
}
