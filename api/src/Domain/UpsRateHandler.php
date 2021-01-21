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
        $data = $this->request->request->all();

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
        "User not authorized!",
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
            $shipToAddress->setPostalCode()
                ->setCountryCode()
                ->setCity()
                ->setStreetName()
                ->setStreetNumberLow();

            foreach($array as $item){
                $package = new Package();
                $package->getPackagingType()->setCode(PackagingType::PT_PACKAGE);

                $weightUnit = new UnitOfMeasurement();
                $weightUnit->setCode(UnitOfMeasurement::UOM_KGS);
                $package->getPackageWeight()->setUnitOfMeasurement($weightUnit);
                $package->getPackageWeight()->setWeight();

                $dimensions = new Dimensions();
                $dimensions->setHeight()
                        ->setWidth()
                        ->setLength();
                $dimensionUnit = new UnitOfMeasurement();
                $dimensionUnit->setCode(UnitOfMeasurement::UOM_CM);
                $dimensions->setUnitOfMeasurement($dimensionUnit);

                $shipment->addPackage($package);
            }

            $result = $rate->getRate($shipment);
            dump($result);




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
