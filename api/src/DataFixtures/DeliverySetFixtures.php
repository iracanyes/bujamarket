<?php

namespace App\DataFixtures;

use App\Entity\DeliverySet;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use \Faker\Factory;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class DeliverySetFixtures extends Fixture implements DependentFixtureInterface, FixtureGroupInterface
{
    /**
     * @var \Faker\Factory
     */
    private $faker;

    public const DELIVERY_SET_REFERENCE = 'deliverySet';

    public function __construct()
    {
        $this->faker = Factory::create('fr_FR');
    }

    public function load(ObjectManager $manager)
    {
        $deliverySet = new DeliverySet();

        /* Informations */
        $deliverySet->setShippingCost($this->faker->numberBetween(0,10000));
        $deliverySet->setDateCreated($this->faker->dateTimeBetween('-2 years','now'));
        $deliverySet->setAllShipped($this->faker->boolean(80));
        $deliverySet->setAllReceived($this->faker->boolean(40));


        /* Relations */
        $deliverySet->setShipper($this->getReference(ShipperFixtures::SHIPPER_REFERENCE));
        $deliverySet->setOrderSet($this->getReference(OrderSetFixtures::ORDER_SET_REFERENCE));

        $manager->persist($deliverySet);

        $manager->flush();

        $this->setReference(self::DELIVERY_SET_REFERENCE, $deliverySet);
    }

    public function getDependencies()
    {
        return array(
            OrderSetFixtures::class,
            ShipperFixtures::class,
        );
    }

    public static function getGroups(): array
    {
        return ["group1","group2"];
    }

}
