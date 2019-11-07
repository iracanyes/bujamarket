<?php


namespace App\Service;


use App\Entity\BillCustomer;
use App\Entity\Customer;
use App\Entity\Payment;
use App\Exception\BillCustomer\BillCustomerNotFoundException;
use Doctrine\DBAL\Driver\PDOException;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityNotFoundException;
use Stripe\Checkout\Session;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Twig\Environment;
use Dompdf\Dompdf;
use Dompdf\Options;
use Lexik\Bundle\JWTAuthenticationBundle\Exception\UserNotFoundException;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Security\Core\Security;

class BillCustomerHandler
{
    private $em;

    private $request;

    private $security;

    private $logger;

    private $twig;

    private $memberHandler;

    public function __construct(EntityManagerInterface $em, RequestStack $requestStack, SessionInterface $session, LoggerInterface $logger, Security $security, Environment $twig, MemberHandler $memberHandler)
    {
        $this->em = $em;
        $this->request = $requestStack->getCurrentRequest();
        $this->security = $security;
        $this->logger = $logger;
        $this->twig = $twig;
        $this->memberHandler = $memberHandler;
    }

    public function createBill($data = null)
    {
        if($data === null)
        {
            throw new \Exception("Bill customer handler - create bill : no data received" );
        }

        $billCustomer = new BillCustomer();

        $billCustomer->setStatus('completed')
            ->setDateCreated(new \DateTime())
            ->setCurrencyUsed('EUR')
            ->setVatRateUsed(0)
            ->setAdditionalCost(0)
            ->setAdditionalFee(0)
            ->setAdditionalInformation('');

        $customer = $this->memberHandler->getCustomer($data);





        if(!$billCustomer)
        {
            throw new \Exception('Customer not found for this checkout session');
        }else{
            $billCustomer->setCustomer($customer);
        }



        return $billCustomer;
    }

    public function createPdf(Payment $payment, Session $session): string
    {


        $options = new Options();
        $options->setIsRemoteEnabled(true);
        $options->setTempDir($_SERVER['DOCUMENT_ROOT']."/assets/img");

        $pdf = new Dompdf($options);


        dump($pdf);

        /* Création du template HTML  */
        try{
            $htmlBill = $this->twig->render('bill_customer/invoice.html.twig', ['payment' => $payment, 'session' => $session] );
            //dump($htmlBill);

            /* chemin du fichier pdf */
            $pathname = $payment->getReference().'.pdf';



        }catch(\Exception $exception){
            throw new \Exception(sprintf("Unexpected error code (%s) while rendering pdf template : %s", $exception->getCode(), $exception->getMessage()));
        }

        /* Création du pdf à partir de la page html */
        $pdf->loadHtml($htmlBill);


        $pdf->setPaper('A4', 'portrait');
        $pdf->render();

        $pdfBill = $pdf->output();

        dump($pdfBill);


        if(!file_put_contents($_SERVER['DOCUMENT_ROOT'].'/download/invoices/customers/'.$pathname, $pdfBill))
        {
            throw new \Exception("Error while creating the pdf for the customer's bill  ");
        }



        return $pathname;
    }

    public function downloadPdf()
    {
        $data = $this->request->query->get('file');

        dump($data);

        try{
            $customer = $this->em->getRepository(Customer::class)
                ->findOneBy(['email' => $this->security->getUser()->getUsername()]);

            dump($customer);

            if($customer !== null)
            {
                $bill = $this->em->getRepository(BillCustomer::class)
                    ->findOneBy(['url' => $data, 'customer' => $customer->getId()]);

                dump($bill);
            }


        }catch(PDOException $exception){
            throw new BillCustomerNotFoundException(sprintf("The Bill associated to the user %s and the file %s not found!", $this->security->getUser()->getUsername(), $data ), 404);
        }

        $response = new BinaryFileResponse(getenv('DOCUMENT_ROOT').'/download/invoices/customers/'.$bill->getUrl());

        $response->headers->set('Content-Type', 'application/pdf');

        $response->setContentDisposition(
            ResponseHeaderBag::DISPOSITION_ATTACHMENT,
            $bill->getUrl()
        );

        return $response;

    }


}
