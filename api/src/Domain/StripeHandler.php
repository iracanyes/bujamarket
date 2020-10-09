<?php


namespace App\Domain;



use App\Entity\Customer;
use App\Entity\OrderSet;
use App\Entity\Supplier;
use App\Entity\User;

class StripeHandler
{

    public function __construct()
    {
        \Stripe\Stripe::setApiKey(getenv('STRIPE_SECRET_KEY'));
    }

    /**
     * Create a Customer
     * @param User $user
     * @return \Stripe\Customer
     * @throws \Stripe\Exception\ApiErrorException
     */
    public function createCustomer(User $user)
    {
        return \Stripe\Customer::create([
            "email" => $user->getEmail(),
            "name" => $user->getLastname()." ".$user->getFirstname(),
            "preferred_locales" => [$user->getLanguage(), "fr"]
        ]);
    }

    /**
     * Create a Setup intent for Australian Bank account payment method (save payment method)
     * @param Customer|Supplier $user
     * @return string|null
     * @throws \Stripe\Exception\ApiErrorException
     */
    public function createSetupIntent($user){

        $setup_intent = \Stripe\SetupIntent::create([
            "customer" => $user instanceof Customer ? $user->getCustomerKey() : $user->getSupplierKey(),
            "payment_method_types" => ["au_becs_debit"]
        ]);

        return $setup_intent->client_secret;
    }

    /**
     * Retrieve  a payment method
     * @param string $id
     * @return \Stripe\PaymentMethod
     * @throws \Stripe\Exception\ApiErrorException
     */
    public function retrievePaymentMethod(string $id)
    {
        return \Stripe\PaymentMethod::retrieve($id);
    }

    /**
     * Retrieve a Setup Intent
     * @param string $id
     * @return \Stripe\SetupIntent
     * @throws \Stripe\Exception\ApiErrorException
     */
    public function retrieveSetupIntent(string $id)
    {
        return \Stripe\SetupIntent::retrieve([
            "id" => $id,
            "expand" =>["mandate"]
        ]);
    }

    public function createCheckoutSession(Customer $customer, OrderSet $orderSet, $line_items)
    {
        /* Création d'une session Stripe Checkout */
        $session = \Stripe\Checkout\Session::create(
            [
                //"customer_email" => $customer->getEmail(),
                "payment_method_types" => ['card'],
                'line_items' => $line_items,
                "success_url" => ''.getenv('APP_HOST_URL').'/payment_success/{CHECKOUT_SESSION_ID}',
                "cancel_url" => ''.getenv('APP_HOST_URL').'/payment_failure',
                "billing_address_collection" => "required",
                "customer" => $customer->getCustomerKey() !== null ? $customer->getCustomerKey() : null,
                'client_reference_id' => $orderSet->getId(),
                'mode' => 'payment',
                'submit_type' => 'pay'
            ]
        );

        return $session;
    }

    /**
     * Find an event occured on Stripe Platform
     * @param string $eventId
     * @return \Stripe\Event
     * @throws \Stripe\Exception\ApiErrorException
     */
    public function findEvent(string $eventId)
    {
        return \Stripe\Event::retrieve($eventId);
    }

    public function detachPaymentMethod(string $id_card)
    {
        \Stripe\PaymentMethod::detach($id_card);
    }

    /**
     * @param string $sessionId
     * @return \Stripe\Checkout\Session
     * @throws \Stripe\Exception\ApiErrorException
     */
    public function retrieveSession(string $sessionId){
        return \Stripe\Checkout\Session::retrieve($sessionId, ['expand' => ['line_items']]);
    }

    public function retrieveCheckoutSessionLineItems(string $sessionId)
    {
        return \Stripe\Checkout\Session::allLineItems($sessionId);
    }

}
