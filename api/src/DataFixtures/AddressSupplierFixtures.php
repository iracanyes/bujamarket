<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use App\Entity\Address;
use App\DataFixtures\CustomerFixtures;
use \Faker\Factory;

class AddressSupplierFixtures extends Fixture implements FixtureGroupInterface
{
    public const ADDRESS_SUPPLIER_REFERENCE = 'addressSupplier';

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

        $address->setLocationName("siége social");
        $address->setStreet($this->faker->streetName);
        $address->setNumber($this->faker->buildingNumber);
        $address->setState($this->faker->city);
        $address->setTown($this->faker->city);
        $address->setZipCode($this->faker->postcode);
        $address->setCountry($this->faker->country);

        /* Relation */
        //$address->setUser($this->getReference(SupplierFixtures::SUPPLIER_REFERENCE));

        $manager->persist($address);
        $manager->flush();

        $this->setReference(self::ADDRESS_SUPPLIER_REFERENCE, $address);
    }

    /**
     * Permet de définir un ordre de chargement des fixtures ainsi les dépendances sont chargés avant
     * @return array
     */
    /*
    public function getDependencies()
    {
        return array(
            SupplierFixtures::class
        );
    }
    */
    public static function getGroups(): array
    {
        return ["system_admin","group2"];
    }

}
