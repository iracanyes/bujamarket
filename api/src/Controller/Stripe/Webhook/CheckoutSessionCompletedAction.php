<?php


namespace App\Controller\Stripe\Webhook;


use App\Service\PaymentHandler;
use App\Service\StripeHandler;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\RequestStack;

class CheckoutSessionCompletedAction
{
    private $paymentHandler;

    public function __construct(PaymentHandler $paymentHandler)
    {
        $this->paymentHandler = $paymentHandler;
    }


    public function __invoke()
    {
        return $this->paymentHandler->validatePayment();
    }
}
