<?php


namespace App\Controller\Stripe\Webhook;


use App\Service\PaymentHandler;
use App\Service\StripeClient;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\RequestStack;

class CheckoutSessionCompletedAction
{
    private $stripeClient;

    private $paymentHandler;

    private $request;

    public function __construct(StripeClient $stripeClient, PaymentHandler $paymentHandler, RequestStack $requestStack)
    {
        $this->stripeClient = $stripeClient;
        $this->paymentHandler = $paymentHandler;
        $this->request = $requestStack->getCurrentRequest();
    }


    public function __invoke()
    {
        /* Recupération des données de la requête */
        $data = json_decode($this->request->getContent(), true);
        if ($data === null) {
            throw new \Exception('Bad JSON body from Stripe!');
        }

        /* Identifiant de l'événement  */
        $eventId = $data['id'];

        /* Remarque de sécurité : Récupération de l'objet Event à partir des données reçues par le webhook Stripe */
        $stripeEvent = $this->stripeClient->findEvent($eventId);

        dump($stripeEvent);

        /* Si on reçoit un événement autre que "checkout.session.completed", on ne traite pas la requête */
        if($stripeEvent->type !== 'checkout.session.completed')
        {
            return new Response(sprintf('Unexpected Webhook Stripe received : %s ', $stripeEvent->type),204);
        }

        try
        {
            /*  */
            $this->paymentHandler->handleCheckoutSessionCompleted($stripeEvent);
        }catch(\Exception $exception){
            return new Response(sprintf('Unexpected Webhook Stripe received : %s ', $stripeEvent->type), 404);
        }

        return new JsonResponse(sprintf('Stripe Webhook processed : %s ', $stripeEvent->type),200);
    }
}
