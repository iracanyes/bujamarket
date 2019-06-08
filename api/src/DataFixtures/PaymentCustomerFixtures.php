<?php

namespace App\DataFixtures;

use App\Entity\Payment;
use \Faker\Factory;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;

class PaymentCustomerFixtures extends Fixture implements DependentFixtureInterface
{
    private $faker;

    public const PAYMENT_CUSTOMER_REFERENCE = 'paymentCustomer';

    public function __construct()
    {
        $this->faker = Factory::create('fr_FR');
    }

    public function load(ObjectManager $manager)
    {
        $payment = new Payment();

        $payment->setReference($this->faker->iban('BE'));
        $payment->setDateCreated($this->faker->dateTimeBetween('-2 years','now'));
        $payment->setCurrency($this->faker->randomElement(['BIF','EUR','USD']));
        $payment->setDescription($this->faker->realText(50));
        $payment->setStatus($this->faker->randomElement(['pending','confirmed','failed','refused','processing']));
        $payment->setAmount($payment->getBill()->getTotalInclTax());

        $payment->setBalanceTransaction($this->faker->md5());
        $payment->setEmailReceipt($this->faker->safeEmail());
        $payment->setSource($this->faker->randomElement(['debit','credit']));


        /* Relations */
        $payment->setBill($this->getReference(BillCustomerFixtures::BILL_CUSTOMER_REFERENCE));

        $manager->persist($payment);

        $manager->flush();

        $this->addReference(self::PAYMENT_CUSTOMER_REFERENCE, $payment);

    }

    public function getDependencies()
    {
        return array(
            BillCustomerFixtures::class,
        );
    }
}
