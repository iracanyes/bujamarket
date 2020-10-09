<?php


namespace App\Action\Payment;

use App\Domain\PaymentHandler;

class CreatePaymentAction
{

    private $paymentHandler;

    public function __construct(PaymentHandler $paymentHandler)
    {
        $this->paymentHandler = $paymentHandler;
    }

    public function __invoke()
    {
        /* Création de la session de paiement sur Stripe Checkout */
        $retour = $this->paymentHandler->createCheckoutSession();

        return $retour;
    }
}
