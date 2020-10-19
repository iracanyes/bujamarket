<?php

namespace App\DataFixtures;

use App\Entity\Bill;
use App\Entity\BillRefund;
use App\Entity\Withdrawal;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Faker\Factory;

class BillRefundFixtures extends Fixture implements DependentFixtureInterface, FixtureGroupInterface
{
    public const BILL_REFUND_REFERENCE = 'billRefund';

    private $faker;

    public function __construct()
    {
        $this->faker = Factory::create('fr_FR');
    }

    public function load(ObjectManager $manager): void
    {
        $billRefund = new BillRefund();

        /* General info */
        $this->setBillInfo($billRefund);

        /* Refund information */
        $billRefund->setReason($this->faker->randomElement(['Withdrawal','Order returned']));
        $billRefund->setDescription($this->faker->text(100));
        $billRefund->setAdditionalFee($this->faker->randomFloat(0, 1));
        $billRefund->setAdditionalCost($this->faker->numberBetween(0, 10000));
        $billRefund->setAdditionalInformation($this->faker->text(50));

        $billRefund->setTotalInclTax((($billRefund->getTotalExclTax() - $billRefund->getAdditionalCost() ) * ( 1 + $billRefund->getVatRateUsed() + $billRefund->getAdditionalFee())));

        /* Relations */
        $billRefund->setCustomer($this->getReference(CustomerFixtures::CUSTOMER_REFERENCE));
        $billRefund->setValidator($this->getReference(AdminFixtures::ADMIN_REFERENCE));

        if($billRefund->getReason() == 'Withdrawal')
        {
            $billRefund->setOrderReturned($this->getReference(OrderReturnedFixtures::ORDER_RETURNED_REFERENCE));
        }else{
            $billRefund->setWithdrawal($this->getReference(WithdrawalFixtures::WITHDRAWAL_REFERENCE));
        }


        $manager->persist($billRefund);
        $manager->flush();

        $this->setReference(self::BILL_REFUND_REFERENCE, $billRefund);
    }

    public function setBillInfo(Bill $bill): void
    {
        $bill->setStatus($this->faker->randomElement(["paid","pending","failed","withdrawn"]));
        $bill->setDateCreated($this->faker->dateTimeAd('now','Europe/Paris'));
        $bill->setDatePayment($this->faker->dateTimeBetween($bill->getDateCreated(),'now', 'Europe/Paris'));
        $bill->setCurrencyUsed($this->faker->randomElement(["USD","EUR","BIF"]));
        $bill->setVatRateUsed($this->faker->randomElement([0.18,0.21]));
        $bill->setTotalExclTax($this->faker->numberBetween(0, 50000));
        $bill->setReference($this->faker->unique()->creditCardNumber());
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
            AdminFixtures::class,
            CustomerFixtures::class,
            OrderReturnedFixtures::class,
            WithdrawalFixtures::class

        );
    }

    public static function getGroups(): array
    {
        return ["group1","group2"];
    }

}
