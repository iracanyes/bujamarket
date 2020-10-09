<?php


namespace App\Action\Stripe\Webhook;


use App\Domain\PaymentHandler;
use App\Domain\StripeHandler;
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
