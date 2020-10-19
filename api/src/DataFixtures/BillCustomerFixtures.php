<?php

namespace App\DataFixtures;

use App\Entity\Bill;
use App\Entity\BillCustomer;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Faker\Factory;

class BillCustomerFixtures extends Fixture implements DependentFixtureInterface, FixtureGroupInterface
{
    public const BILL_CUSTOMER_REFERENCE = "billCustomer";

    private $faker;

    public function __construct()
    {
        $this->faker = Factory::create("fr_FR");
    }

    public function load(ObjectManager $manager): void
    {
        $billCustomer = new BillCustomer();

        /* General info */
        $this->setBillInfo($billCustomer);

        /* Customer information */
        $billCustomer->setAdditionalCost($this->faker->randomFloat(2, 0,10000));
        $billCustomer->setAdditionalFee($this->faker->randomFloat(2,0,1));
        $billCustomer->setAdditionalInformation($this->faker->text(50));
        $billCustomer->setTotalShippingCost($this->faker->numberBetween(0, 20000));
        $billCustomer->setTotalExclTax($this->faker->numberBetween(0, 50000));
        $billCustomer->setTotalInclTax($this->faker->randomFloat(2,10,20000));

        /* Relations */
        $billCustomer->setCustomer($this->getReference(CustomerFixtures::CUSTOMER_REFERENCE));
        $billCustomer->setOrderSet($this->getReference(OrderSetFixtures::ORDER_SET_REFERENCE));



        $manager->persist($billCustomer);
        $manager->flush();

        $this->setReference(self::BILL_CUSTOMER_REFERENCE, $billCustomer);
    }

    public function setBillInfo(Bill $bill): void
    {
        $bill->setStatus($this->faker->randomElement(["paid","pending","failed","withdrawn"]));
        $bill->setDateCreated($this->faker->dateTimeBetween('-2 years','now'));
        $bill->setDatePayment($this->faker->dateTimeBetween('-2 years','now'));
        $bill->setCurrencyUsed($this->faker->randomElement(["USD","EUR","BIF"]));
        $bill->setVatRateUsed($this->faker->randomElement([0.18,0.21]));
        $bill->setReference($this->faker->unique()->creditCardNumber());
        //$bill->setTotalExclTax($this->faker->numberBetween(0, 50000));
        //$bill->setTotalInclTax(($bill->getTotalExclTax() * ($bill->getAdditionalFee() + $bill->getVatRateUsed() )) + $bill->getTotalShippingCost() + $bill->getAdditionalCost());
        $bill->setUrl($this->faker->url);

    }

    /**
     * Permet de définir un ordre de chargement des fixtures ainsi les dépendances sont chargés avant
     * @return array
     */

    public function getDependencies()
    {
        return array(
            CustomerFixtures::class,
            OrderSetFixtures::class

        );
    }

    public static function getGroups(): array
    {
        return ["group1","group2"];
    }

}
