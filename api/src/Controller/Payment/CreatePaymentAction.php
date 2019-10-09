<?php


namespace App\Controller\Payment;

use App\Service\PaymentHandler;

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
        $retour = $this->paymentHandler->createPayment();

        return $retour;
    }
}
