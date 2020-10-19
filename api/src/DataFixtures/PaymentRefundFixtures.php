<?php

namespace App\DataFixtures;

use App\Entity\Payment;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use \Faker\Factory;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class PaymentRefundFixtures extends Fixture implements DependentFixtureInterface, FixtureGroupInterface
{
    private $faker;

    public const PAYMENT_REFUND_REFERENCE = 'paymentRefund';

    public function __construct()
    {
        $this->faker = Factory::create('fr_FR');
    }

    public function load(ObjectManager $manager)
    {
        $payment = new Payment();

        $payment->setPaymentIntent('pi_'.$this->faker->sha1);
        $payment->setReference('bjmktr_'.$this->faker->sha1);
        $payment->setDateCreated($this->faker->dateTimeBetween('-2 years','now'));
        $payment->setCurrency($this->faker->randomElement(['BIF','EUR','USD']));
        $payment->setDescription($this->faker->realText(50));
        $payment->setStatus($this->faker->randomElement(['pending','confirmed','failed','refused','processing']));
        $payment->setAmountRefund($this->faker->randomFloat(2,10,20000));


        $payment->setBalanceTransaction($this->faker->md5());
        $payment->setEmailReceipt($this->faker->safeEmail());
        $payment->setSource($this->faker->randomElement(['debit','credit']));


        /* Relations */
        $payment->setBill($this->getReference(BillRefundFixtures::BILL_REFUND_REFERENCE));


        $manager->persist($payment);

        $manager->flush();

        $this->setReference(self::PAYMENT_REFUND_REFERENCE, $payment);

    }

    public function getDependencies()
    {
        return array(
            BillRefundFixtures::class,
        );
    }

    public static function getGroups(): array
    {
        return ["group1","group2"];
    }

}
