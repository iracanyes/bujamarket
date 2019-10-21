<?php


namespace App\Controller\Payment;

use App\Entity\Payment;
use App\Service\PaymentHandler;

class GetPaymentSuccessAction
{
    /**
     * @var PaymentHandler $paymentHandler
     */
    private $paymentHandler;

    public function __construct(PaymentHandler $paymentHandler)
    {
        $this->paymentHandler = $paymentHandler;
    }

    public function __invoke(): Payment
    {
        return $this->paymentHandler->getPaymentSuccess();
    }
}
