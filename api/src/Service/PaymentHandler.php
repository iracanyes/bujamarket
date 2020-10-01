<?php


namespace App\Service;

use App\Entity\DeliverySet;
use App\Entity\OrderDetail;
use App\Entity\OrderSet;
use App\Entity\Customer;
use App\Entity\Payment;
use App\Exception\Payment\PaymentNotFoundException;
use App\Exception\User\MemberNotFoundException;
use Doctrine\DBAL\Driver\PDOException;
use Doctrine\ORM\EntityNotFoundException;
use Lexik\Bundle\JWTAuthenticationBundle\Exception\UserNotFoundException;
use Psr\Log\LoggerInterface;
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
     * @var LoggerInterface $logger
     */
    private $logger;

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

    private $stripeHandler;

    public function __construct(RequestStack $requestStack, EntityManagerInterface $em, OrderSetHandler $orderSetHandler, MemberHandler $memberHandler,BillCustomerHandler $billCustomerHandler, StripeHandler $stripeHandler, LoggerInterface $logger)
    {
        $this->request = $requestStack->getCurrentRequest();
        $this->em = $em;
        $this->logger = $logger;
        $this->orderSetHandler = $orderSetHandler;
        $this->memberHandler = $memberHandler;
        $this->billCustomerHandler= $billCustomerHandler;
        $this->stripeHandler = $stripeHandler;

    }

    public function createCheckoutSession()
    {
        $data = json_decode($this->request->getContent());

        /* Récupération de l'ensemble de commande */
        $orderSet = $this->orderSetHandler->getOrderSet($data);

        /* Récupération du client */
        $customer = $this->memberHandler->getCustomer();

        $line_items = [];

        /* Création de la liste de commande pour la session Stripe Checkout */
        foreach( $orderSet->getOrderDetails() as $item )
        {
            $images = [];

            foreach($item->getSupplierProduct()->getImages() as $image)
            {
                if(getenv('APP_ENV') === "prod"){
                    $images[] = getenv('API_ENTRYPOINT').'/'.getenv('UPLOAD_SUPPLIER_PRODUCT_IMAGE_DIRECTORY').'/'.$image->getUrl();
                }else{
                    $images[] = 'https://picsum.photos/1620/1080';
                }

            }

            /*
             * Remarque: les prix sur Stripe sont transmis en entier. Ex: 1182.23 doit être transmis comme étant 118223
             * */
            $line_items[] = [
                "price_data" => [
                    "currency" => "EUR",
                    "unit_amount" => round($item->getSupplierProduct()->getFinalPrice(), 2) * 100,
                    "product_data" => [
                        "name" => $item->getSupplierProduct()->getProduct()->getTitle(),
                        "images" => [$images[0],$images[1]],
                        "description" => $item->getSupplierProduct()->getProduct()->getResume(),
                    ]
                ],
                "quantity" => $item->getQuantity(),
            ];
        }

        dump($line_items);

        $session = $this->stripeHandler->createCheckoutSession($customer, $orderSet, $line_items);

        dump($session);

        try{
            /* Association de la session Stripe Checkout avec la commande */
            $orderSet->setSessionId($session->id);

            $this->em->persist($orderSet);
            $this->em->flush();
        }catch(\PDOException $exception){
            $this->logger->error($exception->getMessage(), ['context' => $exception]);
            throw new \Exception(sprintf("An error occured while persisting the order set %s associated with the new session", $orderSet->getId()));
        }

        return new JsonResponse($session);

    }

    public function validatePayment(){
        /* Recupération des données de la requête */
        $data = json_decode($this->request->getContent(), false);
        if ($data === null) {
            throw new \Exception('Bad JSON body from Stripe!');
        }
        dump($data);

        /* Identifiant de l'événement  */
        $eventId = $data->id;

        /* Remarque de sécurité : Récupération de l'objet Event à partir des données reçues par le webhook Stripe */
        $stripeEvent = $this->stripeHandler->findEvent($eventId);

        $session = $this->stripeHandler->retrieveSession($stripeEvent->data->object->id);

        dump($stripeEvent);
        dump($session);

        /* Si on reçoit un événement autre que "checkout.session.completed", on ne traite pas la requête */
        if($stripeEvent->type !== 'checkout.session.completed' && $stripeEvent->data->object->payment_intent !== $session->payment_intent)
        {
            return new Response(sprintf('Unexpected request parameters '),204);
        }

        try
        {
            /*  */
            $this->createPayment($session);
        }catch(\Exception $exception){
            return new Response(sprintf('Unexpected Webhook Stripe received : %s ', $stripeEvent->type), 404);
        }

        return new JsonResponse(sprintf('Stripe Webhook processed : %s ', $stripeEvent->type),200);
    }

    public function createPayment(Session $session)
    {
        /* Création de la preuve de paiement */
        $payment = new Payment();


        $payment->setSessionId($session->id);
        $payment->setDateCreated(new \DateTime());
        $payment->setReference(
            date_format($payment->getDateCreated(), "Ymd-His")
            .'-'
            .explode('_', $session->payment_intent)[1]
        );
        $payment->setCurrency('EUR');
        $payment->setStatus('completed');

        $payment->setSource('credit');

        dump($payment);

        /* Calcul du montant total htva du paiement */
        $somme = 0.0;

        $line_items = $this->stripeHandler->retrieveCheckoutSessionLineItems($payment->getSessionId());
        dump($line_items);

        foreach($line_items->data as $item)
        {
            /* Rappel: les montants sur Stripe sont des entiers. Ex : 1182.23 sera 118223 */
            $somme += ((((float)$item->amount_total) / 100) * $item->quantity);
        }

        $payment->setAmount($somme);

        dump($payment);

        /* Création de la facture associé */
        $bill = $this->billCustomerHandler->createBill($session);
        dump($bill);

        $bill->setReference($payment->getReference());

        /* Ajout des sommes associés au paiements dans la facture */
        $bill->setTotalExclTax($somme);

        // Récupérer le coût du transport
        $orderSet = $this->orderSetHandler->getOrderSetBySessionId($session->id);
        dump($orderSet);

        // Association de la facture avec la commande effectuée
        $orderSet->setBillCustomer($bill);

        // Somme total TVAC
        $bill->setTotalInclTax(($somme * ( 1 + $bill->getVatRateUsed() )) + $orderSet->getDeliverySet()->getShippingCost());

        // Ajout de l'e-mail de facturation après la création de la facture
        $payment->setEmailReceipt($bill->getCustomer()->getEmail());

        /* Ajout de l'ID du paiement Stripe  */
        $payment->setPaymentIntent($session->payment_intent);

        dump($payment);

        try{
            // Mise à jour de l'ID Customer si celui-ci n'existe pas déjà
            $customer = $this->em->getRepository(Customer::class)
                ->findOneBy(['customerKey' => $session->customer]);

            if($customer === null || !$customer instanceof Customer){
                throw new MemberNotFoundException("Customer not found!", ['parameter' => $session->customer]);
            }

            // Association facture - client
            $bill->setCustomer($customer);



            /* Création d'une facture sous format pdf */
            $pathname = $this->billCustomerHandler->createPdf($payment, $session, $orderSet, $line_items->data, $bill);

            dump($pathname);

            $bill->setUrl($pathname);

            // Association payment - facture
            $this->em->persist($orderSet);
            $this->em->persist($bill);
            $this->em->flush();

            $payment->setBill($bill);

            dump($bill);

            dump($customer);
            // Sauvegarde du paiement confirmé
            $this->em->persist($payment);
            $this->em->flush();

        } catch (\Exception $exception){
            $this->logger->error($exception->getMessage(), ['context' => $exception]);
            throw new \Exception('An error '.$exception->getCode().' during persisting process of the payment. Message : '.$exception->getMessage());
        }

    }

    /**
     *
     * @param \Stripe\Event $event
     * @throws \Exception
     */
    public function handleCheckoutSessionCompleted(\Stripe\Event $event, $data): void
    {
        /* Récupération des données reçues après confirmation d'un paiement */
        $eventObject = $event->data->object;


        /* Sauvegarde du paiement confirmé par Stripe */
        $this->createPayment($eventObject);


    }

    /**
     * Retrieve a succeeded payment
     * @return object|null
     * @throws PaymentNotFoundException
     */
    public function getPaymentSuccess()
    {
        $data = json_decode($this->request->getContent());
        dump($data);

        try{
            $payment = $this->em->getRepository(Payment::class)
                ->findOneBy(['sessionId' => $data->sessionId ]);
        }catch (PDOException $exception){
            throw new PaymentNotFoundException(sprintf("The payment associated to the Checkout Session (%s) not found", $data->sesssionId));
        }

        return $payment;
    }
}
