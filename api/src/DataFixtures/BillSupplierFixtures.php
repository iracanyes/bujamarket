<?php

namespace App\DataFixtures;

use App\Entity\Bill;
use App\Entity\BillSupplier;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Faker\Factory;

class BillSupplierFixtures extends Fixture implements DependentFixtureInterface
{
    public const BILL_SUPPLIER_REFERENCE = 'billSupplier';

    private $faker;

    public function __construct()
    {
        $this->faker = Factory::create('fr_FR');
    }

    public function load(ObjectManager $manager): void
    {
        $billSupplier = new BillSupplier();

        /* General info */
        $this->setBillInfo($billSupplier);

        /* Supplier information */
        $billSupplier->setDeliveryCost($this->faker->numberBetween(0, 20000));
        
        $billSupplier->setTotalInclTax($this->faker->randomFloat(2, 10, 10000));

        /* Relations */
        $billSupplier->setSupplier($this->getReference(SupplierFixtures::SUPPLIER_REFERENCE));
        $billSupplier->setOrderDetail($this->getReference(OrderDetailFixtures::ORDER_DETAIL_REFERENCE));



        $manager->persist($billSupplier);
        $manager->flush();

        $this->addReference(self::BILL_SUPPLIER_REFERENCE, $billSupplier);
    }

    public function setBillInfo(Bill $bill): void
    {
        $bill->setStatus($this->faker->randomElement(["paid","pending","failed","withdrawn"]));
        $bill->setDateCreated($this->faker->dateTimeBetween('-2 years', 'now'));
        $bill->setDatePayment($this->faker->dateTimeBetween('-2 years', 'now'));
        $bill->setCurrencyUsed($this->faker->randomElement(["USD","EUR","BIF"]));
        $bill->setVatRateUsed($this->faker->randomElement([0.18,0.21]));
        $bill->setTotalExclTax($this->faker->numberBetween(0, 50000));
        //$bill->setTotalInclTax(($bill->getTotalExclTax() * ($bill->getAdditionalFee() + $bill->getVatRateUsed() )) + $bill->getTotalShippingCost() + $bill->getAdditionalCost());
        $bill->setUrl($this->faker->url());

    }

    /**
     * Permet de définir un ordre de chargement des fixtures ainsi les dépendances sont chargés avant
     * @return array
     */

    public function getDependencies()
    {
        return array(
            SupplierFixtures::class,
            OrderDetailFixtures::class

        );
    }
}
