<?php


namespace App\Service;

use App\Entity\DeliverySet;
use App\Entity\OrderDetail;
use App\Entity\OrderSet;
use App\Entity\Customer;
use App\Entity\Payment;
use App\Exception\PaymentNotFoundException;
use Doctrine\DBAL\Driver\PDOException;
use Doctrine\ORM\EntityNotFoundException;
use Lexik\Bundle\JWTAuthenticationBundle\Exception\UserNotFoundException;
use Stripe\Checkout\Session;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Security;
use Doctrine\ORM\EntityManagerInterface;
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

    /**
     * @var OrderSetHandler $orderSetHandler
     */
    private $orderSetHandler;

    /**
     * @var \App\Service\MemberHandler $memberHandler
     */
    private $memberHandler;

    /**
     * @var BillCustomerHandler $billCustomerHandler
     */
    private $billCustomerHandler;

    public function __construct(RequestStack $requestStack, EntityManagerInterface $em, OrderSetHandler $orderSetHandler, MemberHandler $memberHandler,BillCustomerHandler $billCustomerHandler)
    {
        $this->request = $requestStack->getCurrentRequest();
        $this->em = $em;
        $this->orderSetHandler = $orderSetHandler;
        $this->memberHandler = $memberHandler;
        $this->billCustomerHandler= $billCustomerHandler;

        /* Ajout de la clé API Stripe en */
        \Stripe\Stripe::setApiKey(getenv('STRIPE_SECRET_KEY'));

    }

    public function createCheckoutSession()
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

            /*
             * Remarque: les prix sur Stripe sont transmis en entier. Ex: 1182.23 doit être transmis comme étant 118223
             * */
            $line_items[] = [
                "name" => $item->getSupplierProduct()->getProduct()->getTitle(),
                "description" => $item->getSupplierProduct()->getProduct()->getResume(),
                "currency" => "EUR",
                "amount" => round($item->getSupplierProduct()->getFinalPrice(), 2) * 100,
                "quantity" => $item->getQuantity(),
                "images" => $images
            ];
        }

        dump($line_items);

        /* Création d'une session Stripe Checkout */
        $session = \Stripe\Checkout\Session::create([
            "customer_email" => $customer->getEmail(),
            "payment_method_types" => ['card'],
            'line_items' => $line_items,
            "success_url" => ''.getenv('APP_HOST_URL').'/payment_success/{CHECKOUT_SESSION_ID}',
            "cancel_url" => ''.getenv('APP_HOST_URL').'/payment_failure',
            "billing_address_collection" => "required",
            // Seul une clé customer/client_reference_id est nécessaire
            //"customer" => $customer->getCustomerKey(),
            'client_reference_id' => $customer->getCustomerKey(),
            'mode' => 'payment',
            'submit_type' => 'pay'
        ]);

        dump($session);

        try{
            /* Association de la session Stripe Checkout avec la commande */
            $orderSet->setSessionId($session->id);

            $this->em->persist($orderSet);
            $this->em->flush();
        }catch(\PDOException $exception){
            throw new \Exception(sprintf("An error occured while persisting the order set %s associated with the new session", $orderSet->getId()));
        }

        return new JsonResponse($session);

    }

    public function createPayment(Session $data)
    {
        if(!$data)
        {
            throw new \Exception('Payment Handler - Create payment : Unexpected data received from request');
        }

        dump($data);

        /* Création de la preuve de paiement */
        $payment = new Payment();

        $payment->setSessionId($data->id);
        $payment->setDateCreated(new \DateTime());
        $payment->setReference(
            date_format($payment->getDateCreated(), "Ymd-His")
            .'-'
            .hexdec( explode('_', $data->payment_intent)[1] )
        );
        $payment->setCurrency('EUR');
        $payment->setStatus('completed');

        $payment->setSource('credit');

        /* Calcul du montant total htva du paiement */
        $somme = 0.0;

        foreach($data->display_items as $item)
        {
            /* Rappel: les montants sur Stripe sont des entiers. Ex : 1182.23 sera 118223 */
            $somme += ((((float)$item->amount) / 100) * $item->quantity);
        }

        $payment->setAmount($somme);

        /* Création de la facture associé */
        $bill = $this->billCustomerHandler->createBill($data);

        $bill->setReference($payment->getReference());

        /* Ajout des sommes associés au paiements dans la facture */
        $bill->setTotalExclTax($somme);




        // Récupérer le coût du transport
        $orderSet = $this->orderSetHandler->getOrderSetBySessionId($data->id);
        $bill->setTotalShippingCost($orderSet->getDeliverySet()->getTotalShippingCost());

        // Association de la facture avec la commande effectuée
        $bill->setOrderSet($orderSet);



        // Somme total TVAC
        $bill->setTotalInclTax(($somme * ( 1 + $bill->getVatRateUsed() )) + $bill->getTotalShippingCost());



        // Ajout de l'e-mail de facturation après la création de la facture
        $payment->setEmailReceipt($bill->getCustomer()->getEmail());



        /* Association du paiement enregistré avec sa facture */
        $payment->setBill($bill);

        dump($bill);

        /* Création d'une facture sous format pdf */
        $pathname = $this->billCustomerHandler->createPdf($payment, $data);

        dump($pathname);

        $payment->getBill()->setUrl($pathname);

        /* Ajout de l'ID du paiement Stripe  */
        $payment->setPaymentIntent($data->payment_intent);

        dump($payment);

        try{
            $this->em->persist($payment);
            $this->em->flush();

        } catch (PDOException $exception){
            throw new \Exception('An error '.$exception->getCode().' during persisting process of the payment. Message : '.$exception->getMessage());
        }


    }

    public function handleCheckoutSessionCompleted(\Stripe\Event $event): void
    {
        /**/
        $eventObject = $event->data->object;

        dump($eventObject);

        $this->createPayment($eventObject);


    }

    public function getPaymentSuccess()
    {
        $data = json_decode($this->request->getContent());

        try{
            $payment = $this->em->getRepository(Payment::class)
                ->findOneBy(['sessionId' => $data->sessionId ]);
        }catch (PDOException $exception){
            throw new PaymentNotFoundException(sprintf("The payment associated to the Checkout Session (%s) not found", $data->sesssionId));
        }

        return $payment;
    }
}
