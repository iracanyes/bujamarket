<?php


namespace App\EventSubscriber;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\UserTemp;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\Event\GetResponseForControllerResultEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class UserConfirmationMailSubscriber implements EventSubscriberInterface
{
    private $mailer;

    private $templating;

    public function __construct(\Swift_Mailer $mailer, \Twig\Environment $twig_Environment)
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

    public function sendMail(ViewEvent $event): void
    {
        $user = $event->getControllerResult();
        $request = $event->getRequest();
        $method= $request->getMethod();

        if(!$user instanceof UserTemp || Request::METHOD_POST !== $method || $request->getPathInfo() !== "/register")
        {
            return;
        }

        $message = (new \Swift_Message("Confirmation : Inscription à la plateforme d'E-commerce Buja Market"))
            ->setFrom('admin@'.$request->headers->get('host'))
            ->setTo($user->getEmail())
            ->setBody(
                $this->templating->render(
                    'emails/confirmation.html.twig',
                    [
                        'user' => $user,
                        'url_confirmation' => $request->headers->get('origin').'/subscribe/'.$user->getToken(),
                        'url_unsubscribe' => $request->headers->get('origin').'/unsubscribe/'.$user->getToken()
                    ]
                ),
                'text/html'
            );

        $this->mailer->send($message);
    }
}
