<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use App\Entity\Address;
use App\DataFixtures\CustomerFixtures;
use \Faker\Factory;

class AddressCustomerFixtures extends Fixture implements DependentFixtureInterface
{
    public const ADDRESS_CUSTOMER_REFERENCE = "addressCustomer";

    /**
     * @var \Faker\Generator
     */
    private $faker;

    public function __construct()
    {
        $this->faker = Factory::create('fr_FR');
    }


    /**
     * @param ObjectManager $manager
     */
    public function load(ObjectManager $manager)
    {
        $address = new Address();

        $address->setLocationName("Résidence");
        $address->setStreet($this->faker->streetName);
        $address->setNumber($this->faker->buildingNumber);
        $address->setState($this->faker->state);
        $address->setTown($this->faker->city);
        $address->setZipCode($this->faker->postcode);
        $address->setCountry($this->faker->country);

        /* Relation */
        $address->setUser($this->getReference(CustomerFixtures::CUSTOMER_REFERENCE));

        $manager->persist($address);
        $manager->flush();

        $this->addReference(self::ADDRESS_CUSTOMER_REFERENCE, $address);
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
}
