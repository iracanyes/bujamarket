<?php


namespace App\Service;

use App\Entity\DeliverySet;
use App\Entity\OrderDetail;
use App\Entity\OrderSet;
use App\Entity\Customer;
use App\Entity\Shipper;
use Doctrine\DBAL\Driver\PDOException;
use Doctrine\ORM\EntityNotFoundException;
use Lexik\Bundle\JWTAuthenticationBundle\Exception\UserNotFoundException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Security;
use Doctrine\ORM\EntityManagerInterface;
use \Stripe\Stripe;
use \Stripe\Checkout\Session;
use App\Service\MemberHandler;

class PaymentHandler
{
    /**
     * @var Security $security
     */
    private $security;

    /**
     * @var \Symfony\Component\HttpFoundation\Request|null $request
     */
    private $request;

    /**
     * @var EntityManagerInterface $em
     */
    private $em;

    private $orderSetHandler;

    private $memberHandler;

    public function __construct(Security $security, RequestStack $requestStack, EntityManagerInterface $em, OrderSetHandler $orderSetHandler, MemberHandler $memberHandler)
    {
        $this->security = $security;
        $this->request = $requestStack->getCurrentRequest();
        $this->em = $em;
        $this->orderSetHandler = $orderSetHandler;
        $this->memberHandler = $memberHandler;


        /* Ajout de la clé API Stripe en */
        \Stripe\Stripe::setApiKey(getenv('STRIPE_SECRET_KEY'));

    }

    public function createPayment()
    {
        $data = json_decode($this->request->getContent());

        /* Récupération de l'ensemble de commande */
        $orderSet = $this->orderSetHandler->getOrderSet($data);

        /* Récupération du client */
        $customer = $this->memberHandler->getCustomer();

        /* Création de la liste de commande pour la session Stripe Checkout */
        foreach( $orderSet->getOrderDetails() as $item )
        {
            $line_items = [];

            $images = [];

            foreach($item->getSupplierProduct()->getProduct()->getImages() as $image)
            {
                $images[] = $image->getUrl();
            }

            $line_items[] = [
                "name" => $item->getSupplierProduct()->getProduct()->getTitle(),
                "description" => $item->getSupplierProduct()->getProduct()->getResume(),
                "currency" => "EUR",
                "amount" => round($item->getSupplierProduct()->getFinalPrice(), 0) * 100,
                "quantity" => $item->getQuantity(),
                "images" => $images
            ];
        }

        dump($line_items);

        /* Création d'une session Stripe Checkout */
        $session = \Stripe\Checkout\Session::create([
            "customer_email" => $this->security->getUser()->getUsername(),
            "payment_method_types" => ['card'],
            'line_items' => $line_items,
            "success_url" => ''.getenv('APP_HOST_URL').'/payment_success?session_id={CHECKOUT_SESSION_ID}',
            "cancel_url" => ''.getenv('APP_HOST_URL').'/payment_failure',
            "billing_address_collection" => "required",
            //"customer" => $customer->getCustomerKey(),
            'client_reference_id' => $customer->getCustomerKey(),
            'mode' => 'payment',
            'submit_type' => 'pay'
        ]);

        dump($session);



        return new JsonResponse($session);

    }
}
