<?php

namespace App\DataFixtures;

use App\Entity\BankAccount;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use \Faker\Factory;

class BankAccountCustomerFixtures extends Fixture implements DependentFixtureInterface, FixtureGroupInterface
{
    public const BANK_ACCOUNT_CUSTOMER_REFERENCE = "bankAccountCustomer";

    private $faker;

    public function __construct()
    {
        $this->faker = Factory::create("fr_FR");
    }

    public function load(ObjectManager $manager)
    {
        $bankAccount = new BankAccount();

        $bankAccount->setIdCard($this->faker->unique()->iban());
        $bankAccount->setBrand($this->faker->creditCardType);
        $bankAccount->setCountryCode($this->faker->countryCode);
        $bankAccount->setLast4($this->faker->randomNumber(4, true));
        $bankAccount->setExpiryMonth($this->faker->numberBetween(1,12));
        $bankAccount->setExpiryYear($this->faker->numberBetween(19,99));
        $bankAccount->setFingerprint($this->faker->unique()->swiftBicNumber);
        $bankAccount->setFunding($this->faker->randomElement(["debit","credit"]));
        $bankAccount->setAccountBalance(0);

        /* Relations */
        $bankAccount->setUser($this->getReference(CustomerFixtures::CUSTOMER_REFERENCE));

        $manager->persist($bankAccount);
        $manager->flush();

        $this->addReference(self::BANK_ACCOUNT_CUSTOMER_REFERENCE, $bankAccount);
    }

    /**
     * Permet de définir un ordre de chargement des fixtures ainsi les dépendances sont chargés avant
     * @return array
     */
    public function getDependencies()
    {
        return array(
            CustomerFixtures::class
        );
    }

    public static function getGroups(): array
    {
        return ["group1","group2"];
    }
}
