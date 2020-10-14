<?php


namespace App\Domain;


use App\Entity\BankAccount;
use App\Entity\Customer;
use App\Entity\User;
use App\Exception\BankAccount\BankAccountNotFoundException;
use App\Exception\BankAccount\CreateAuBankAccountException;
use App\Exception\BankAccount\CreateClientSecretException;
use App\Exception\BankAccount\CreateIbanAccountException;
use App\Exception\BankAccount\CreatePaymentMethodException;
use App\Exception\User\MemberNotFoundException;
use App\Responder\JsonResponder;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\Security;
use \Stripe\Stripe;
use Symfony\Component\Security\Core\User\UserInterface;

class BankAccountHandler
{
    /**
     * @var EntityManagerInterface
     */
    private $em;

    /**
     * @var \Symfony\Component\HttpFoundation\Request|null
     */
    private $request;

    /**
     * @var LoggerInterface
     */
    private $logger;

    /**
     * @var
     */
    private $stripeHandler;

    /**
     * @var Security
     */
    private $security;

    /**
     * @var App\Responder\JsonResponder
     */
    private $jsonResponder;

    public function __construct(EntityManagerInterface $em, RequestStack $requestStack, LoggerInterface $logger, Security $security, StripeHandler $stripeHandler, JsonResponder  $jsonResponder)
    {
        $this->em = $em;
        $this->request = $requestStack->getCurrentRequest();
        $this->logger = $logger;
        $this->security = $security;
        $this->stripeHandler = $stripeHandler;
        $this->jsonResponder = $jsonResponder;

        // Set Stripe API Secret Key
        Stripe::setApiKey(getenv('STRIPE_SECRET_KEY'));

    }

    public function createBankAccount()
    {
        $requestContent = $this->request->getContent();
        $data = json_decode($requestContent);

        switch($data->object){
            case "payment_method":
                $response = $this->createCreditAccount($data);
                break;
            case "source":
                $response = $this->createIbanAccount($data);
                break;
            case "setup_intent":
                $response = $this->createAuBankAccount($data);
                break;
        }

        return $response;

    }

    /**
     * Create a bank account associated to a credit card
     * @param $data
     * @return BankAccount
     * @throws CreatePaymentMethodException
     */
    public function createCreditAccount($data){

        $bankAccount = new BankAccount();
        $bankAccount->setOwnerFullname($data->billing_details->name)
            ->setIdCard($data->id)
            ->setBrand($data->card->brand)
            ->setCountryCode($data->card->country)
            ->setLast4($data->card->last4)
            ->setExpiryMonth($data->card->exp_month)
            ->setExpiryYear($data->card->exp_year)
            ->setFunding($data->card->funding);

        if(isset($data->card->fingerprint)){
            $bankAccount->setFingerprint($data->card->fingerprint);
        }

        try{
            $user = $this->security->getUser();
            /*
            $member = $this->em->getRepository(User::class)
                ->findOneBy(['email' => $user->getUsername()]);
            */
            if(!$user instanceof User)
                throw new MemberNotFoundException("User not found!");

            /**
             * Si un compte Stripe n'est pas associé à l'utilisateur, on le crée avant d'associer la méthode de paiement
             */
            if($user instanceof Customer && $user->getCustomerKey() === null){
                $customer = \Stripe\Customer::create([
                    "email" => $user->getUsername(),
                    "name" => $user->getFirstname()." ".$user->getLastname(),
                    "payment_method" => $data->id,

                ]);

                $user->setCustomerKey($customer->id);

            }



            $bankAccount->setUser($user);

            $this->em->persist($bankAccount);
            $this->em->flush();

            return $bankAccount;
        }catch (\Exception $exception){
            $this->logger->error("Error while creating a payment method!", ['context' => $exception]);
            throw new CreatePaymentMethodException($exception->getMessage());
        }
    }

    /**
     * @param $data
     * @return BankAccount
     * @throws CreateIbanAccountException
     */
    public function createIbanAccount($data){
        $user = $this->security->getUser();

        $bankAccount = new BankAccount();
        $bankAccount->setIdCard($data->id)
            ->setOwnerFullname($data->owner->name)
            ->setBrand($data->sepa_debit->bank_code)
            ->setCountryCode($data->sepa_debit->country)
            ->setLast4($data->sepa_debit->last4)
            ->setExpiryMonth(null)
            ->setExpiryYear(null)
            ->setFingerprint($data->sepa_debit->fingerprint)
            ->setFunding($data->type)
            ->setAccountBalance(null)
            ->setMandate($data->sepa_debit->mandate_url);

        if($user instanceof User){
            $bankAccount->setUser($user);
        }

        try{
            $this->em->persist($bankAccount);
            $this->em->flush();

            return $bankAccount;

        }catch(\Exception $e){
            $this->logger->error($e->getMessage(), ["context" => $e]);
            throw new CreateIbanAccountException("Error while creating an iban account!");
        }
    }

    public function createAuBankAccount($data){
        $user = $this->security->getUser();


        /**
         * Retrieve the setup intent (mandate expanded)
         */
        $setupIntent = $this->stripeHandler->retrieveSetupIntent($data->id);

        /**
         * Retrieve the payment method (contains a card info)
         */
        $paymentMethod = $this->stripeHandler->retrievePaymentMethod($data->payment_method);

        $bankAccount = new BankAccount();
        $bankAccount->setIdCard($data->id)
            ->setOwnerFullname($paymentMethod->billing_details->name)
            ->setBrand(null)
            ->setCountryCode("AU")
            ->setLast4($paymentMethod->au_becs_debit->last4)
            ->setExpiryMonth(null)
            ->setExpiryYear(null)
            ->setFingerprint($paymentMethod->au_becs_debit->fingerprint)
            ->setFunding('au_becs_debit')
            ->setAccountBalance(null)
            ->setMandate($setupIntent->mandate->payment_method_details->au_becs_debit->url);

        $bankAccount->setUser($user);

        try{
            $this->em->persist($bankAccount);
            $this->em->flush();

            return $bankAccount;
        }catch (\Exception $e){
            $this->logger->error($e->getMessage(), ['context' => $e]);
            throw new CreateAuBankAccountException("Error while creating an Australian bank account!");
        }
    }

    public function retrieveAuBankAccount($data)
    {
        /**
         * Retrieve the setup intent (mandate expanded)
         */
        $setupIntent = $this->stripeHandler->retrieveSetupIntent($data->id);

        /**
         * Retrieve the payment method (contains a card info)
         */
        $paymentMethod = $this->stripeHandler->retrievePaymentMethod($setupIntent->payment_method);


        return $paymentMethod;
    }

    public function deleteBankAccount()
    {
        $data = $this->request->getContent();
        $data = json_decode($data);
        $user = $this->security->getUser();


        try{
            $bankAccount = $this->em->getRepository(BankAccount::class)
                ->findOneBy(['id' => $data->id]);
        }catch (\Exception $e){
            throw new BankAccountNotFoundException("The account specified is not found!");
        }



        if($user instanceof Customer){
            $this->stripeHandler->detachPaymentMethod($bankAccount->getIdCard());
        }

        try{
            $this->em->remove($bankAccount);
            $this->em->flush();
        }catch (\Exception $e){
            $this->logger->error("Error while removing a bank account ");
        }

        return $this->jsonResponder->success(["message" =>"Account deleted", "id" => $data->id], 201);

    }

    /**
     * @return string|null
     * @throws \Stripe\Exception\ApiErrorException
     */
    public function getClientSecret(){
        $user  = $this->security->getUser();
        try{
            $client_secret = $this->stripeHandler->createSetupIntent($user);

        }catch(\Exception $e){
            $this->logger->error($e->getMessage(), ['context' => $e]);
            throw new CreateClientSecretException("Error while creating a setup intent!");
        }

        return $client_secret;
    }
}
