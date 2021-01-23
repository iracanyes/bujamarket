<?php


namespace App\Domain;


use App\Entity\ShoppingCartDetail;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\Security;
use Ups\Entity\Dimensions;
use Ups\Entity\Package;
use Ups\Entity\PackagingType;
use Ups\Entity\ShipFrom;
use Ups\Entity\Shipment;
use Ups\Entity\UnitOfMeasurement;
use Ups\Rate;

class UpsRateHandler
{
    private $logger;

    private $request;

    private $security;

    private $em;

    public function __construct(LoggerInterface $logger, RequestStack $requestStack, Security  $security, EntityManagerInterface $em)
    {
        $this->logger = $logger;
        $this->request = $requestStack->getCurrentRequest();
        $this->security = $security;
        $this->em = $em;
    }

    public function getRate()
    {

        $data = json_decode($this->request->getContent(), true);

        // Country code check
        $strJsonFileContents = file_get_contents(__DIR__."/../EuVat/ISO3166-1Alpha2.json");
        dump($strJsonFileContents);
        $countryCode = json_decode($strJsonFileContents);
        dump($countryCode);
        $countryCodeSelected = null;
        foreach($countryCode as $countryIsoCode => $country) {
            if ($data['country'] == $country) {
                $countryCodeSelected = $countryIsoCode;
                break;
            }
        }
        dump($countryCodeSelected);

        $rate = new Rate(
            getenv('UPS_ACCESS_KEY'),
            getenv('UPS_ACCOUNT_ID'),
            getenv('UPS_ACCOUNT_PASSWORD')
        );

        try{
            $customer = $this->security->getUser();
            $shopping_cart = $this->em->getRepository(ShoppingCartDetail::class)
                ->findBy(['customer' => $customer]);
        }catch (\Exception $e){
            $this->logger->error(
        "UPS Rate - User not authorized or shopping cart doesn't exist!",
                [
                    "code" => $e->getCode(),
                    "message" => $e->getMessage(),
                    "file" => $e->getFile(),
                    "line" => $e->getLine(),
                    "trace" => $e->getTraceAsString()
                ]
            );
        }



        try{
            $shipment = new Shipment();

            $shipperAddress = $shipment->getShipper()->getAddress();
            $shipperAddress->setCity('Bujumbura')
                ->setCountryCode(257)
                ->setPostalCode(100);

            dump($shipperAddress);

            $shipFrom = new ShipFrom();
            $shipFrom->setAddress($shipperAddress);

            $shipTo = $shipment->getShipTo();
            $shipToAddress = $shipTo->getAddress();
            dump($shipToAddress);
            $shipToAddress->setPostalCode($data['zipCode'])
                ->setCountryCode($countryCodeSelected)
                ->setCity($data['town'])
                ->setStreetName($data['street'])
                ->setStreetNumberLow($data['number']);

            dump($shopping_cart);
            foreach($shopping_cart as $item){
                $package = new Package();
                $package->getPackagingType()->setCode(PackagingType::PT_PACKAGE);

                $weightUnit = new UnitOfMeasurement();
                $weightUnit->setCode(UnitOfMeasurement::UOM_KGS);
                $package->getPackageWeight()->setUnitOfMeasurement($weightUnit);
                $package->getPackageWeight()->setWeight();

                $dimensions = new Dimensions();
                $dimensions->setHeight($item->getProduct()->getHeight())
                        ->setWidth($item->getProduct()->getHeight())
                        ->setLength($item->getProduct()->getHeight());
                $dimensionUnit = new UnitOfMeasurement();
                $dimensionUnit->setCode(UnitOfMeasurement::UOM_CM);
                $dimensions->setUnitOfMeasurement($dimensionUnit);

                $shipment->addPackage($package);
            }

            $result = $rate->getRate($shipment);
            dump($result);


            return $result;

        } catch (\Exception $e){
            $this->logger->error(
        "Error while calculating the shipment price of this order",
                [
                    "code" => $e->getCode(),
                    "message" => $e->getMessage(),
                    "file" => $e->getFile(),
                    "line" => $e->getLine(),
                    "trace" => $e->getTraceAsString()
                ]

            );
            throw new UPSRatingException("Error while calculating the shipment price of this order");
        }
    }
}
