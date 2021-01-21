<?php


namespace App\Domain;


use App\Entity\Bill;
use App\Entity\BillCustomer;
use App\Entity\Customer;
use App\Entity\OrderSet;
use App\Entity\Payment;
use App\Exception\BillCustomer\BillCustomerNotFoundException;
use App\Exception\DomPdf\DomPdfRenderingException;
use Doctrine\ORM\EntityManagerInterface;
use Stripe\Checkout\Session;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Twig\Environment;
use Dompdf\Dompdf;
use Dompdf\Options;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Security\Core\Security;
use Stripe\LineItem;

class BillCustomerHandler
{
    private $em;

    private $request;

    private $security;

    private $logger;

    private $twig;

    private $memberHandler;

    private $downloadHandler;

    public function __construct(EntityManagerInterface $em, RequestStack $requestStack, SessionInterface $session, LoggerInterface $logger, Security $security, Environment $twig, MemberHandler $memberHandler, DownloadHandler $downloadHandler)
    {
        $this->em = $em;
        $this->request = $requestStack->getCurrentRequest();
        $this->security = $security;
        $this->logger = $logger;
        $this->twig = $twig;
        $this->memberHandler = $memberHandler;
        $this->downloadHandler = $downloadHandler;
    }

    public function createBill(\Stripe\Checkout\Session $session)
    {
        $billCustomer = new BillCustomer();

        $billCustomer->setStatus('completed')
            ->setDateCreated(new \DateTime())
            ->setCurrencyUsed('EUR')
            ->setVatRateUsed(0)
            ->setAdditionalCost(0)
            ->setAdditionalFee(0)
            ->setAdditionalInformation('');

        $customer = $this->memberHandler->getCustomer($session);


        if(!$billCustomer)
        {
            throw new \Exception('Customer not found for this checkout session');
        }else{
            $billCustomer->setCustomer($customer);
        }


        return $billCustomer;
    }

    public function createPdf(Payment $payment, Session $session, OrderSet $orderSet, array $line_items, BillCustomer $billCustomer): string
    {


        $options = new Options();
        $options->setIsRemoteEnabled(true);
        $options->setTempDir($_SERVER['PWD']."/var/dompdf");

        $pdf = new Dompdf($options);


        /* Création du template HTML  */
        try{
            $htmlBill = $this->twig->render(
                'bill_customer/invoice.html.twig',
                [
                    'payment' => $payment,
                    'session' => $session,
                    'orderSet' => $orderSet,
                    'lineItems' => $line_items,
                    'bill' => $billCustomer
                ]
            );

            /* chemin du fichier pdf */
            $filename = $payment->getReference().'.pdf';

        }catch(\Exception $e){
            $this->logger->error(
                "Unexpected error while creating PDF Template",
                [
                    'code' => $e->getCode(),
                    'message' => $e->getMessage(),
                    'line' => $e->getLine(),
                    'trace' => $e->getTraceAsString()
                ]
            );
            throw new \Exception(sprintf("Unexpected error code (%s) while rendering pdf template : %s", $e->getCode(), $e->getMessage()));

        }

        /* Création du pdf à partir de la page html */
        try{
            $pdf->loadHtml($htmlBill);

            $pdf->setPaper('A4', 'portrait');
            $pdf->render();
            $pdfBill = $pdf->output();

        }catch (\Exception $e){
            $this->logger->error(
                `Error while rendering the pdf template:\n
                    message: ${$e->getMessage()}\n
                `,
                ['context' => serialize($e)]
            );
            throw new DomPdfRenderingException('Error while rendering the pdf template', );
        }

        try{
            // Déplacement du pdf créé dans le répertoire privé des factures
            $this->downloadHandler->movePdfToDirectory($filename, $pdfBill);
        }catch (\Exception $exception){
            $this->logger->error(
                `Error while moving the pdf to directory:\n
                    messge:${$exception->getMessage()}\n
                `,
                ['context' => serialize($exception)]
            );
            throw new DomPdfRenderingException('Error while moving the pdf template', );
        }

        return $filename;
    }

    public function downloadPdf()
    {
        $data = $this->request->query->get('file');

        try{
            $customer = $this->em->getRepository(Customer::class)
                ->findOneBy(['email' => $this->security->getUser()->getUsername()]);

            if($customer !== null)
            {
                $bill = $this->em->getRepository(BillCustomer::class)
                    ->findOneBy(['url' => $data, 'customer' => $customer->getId()]);

            }

            if(!$bill instanceof Bill)
            {
                throw new BillCustomerNotFoundException('Bill not found!');
            }


        }catch(\Exception $exception){
            throw new BillCustomerNotFoundException(sprintf("The Bill associated to the user %s and the file %s not found!", $this->security->getUser()->getUsername(), $data ), 404);
        }

        return $this->downloadHandler->getBillCustomer($bill);

    }


}
