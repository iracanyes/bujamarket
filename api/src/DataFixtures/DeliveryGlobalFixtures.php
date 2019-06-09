<?php

namespace App\DataFixtures;

use App\Entity\DeliveryGlobal;
use \Faker\Factory;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;

class DeliveryGlobalFixtures extends Fixture implements DependentFixtureInterface
{
    /**
     * @var \Faker\Factory
     */
    private $faker;

    public const DELIVERY_GLOBAL_REFERENCE = 'deliveryGlobal';

    public function __construct()
    {
        $this->faker = Factory::create('fr_FR');
    }

    public function load(ObjectManager $manager)
    {
        $deliveryGlobal = new DeliveryGlobal();

        /* Informations */
        $deliveryGlobal->setShippingCost($this->faker->numberBetween(0,10000));
        $deliveryGlobal->setDateCreated($this->faker->dateTimeBetween('-2 years','now'));
        $deliveryGlobal->setAllShipped($this->faker->boolean(80));
        $deliveryGlobal->setAllReceived($this->faker->boolean(40));


        /* Relations */
        $deliveryGlobal->setShipper($this->getReference(ShipperFixtures::SHIPPER_REFERENCE));
        $deliveryGlobal->setOrderGlobal($this->getReference(OrderGlobalFixtures::ORDER_GLOBAL_REFERENCE));

        $manager->persist($deliveryGlobal);

        $manager->flush();

        $this->addReference(self::DELIVERY_GLOBAL_REFERENCE, $deliveryGlobal);
    }

    public function getDependencies()
    {
        return array(
            OrderGlobalFixtures::class,
            ShipperFixtures::class,
        );
    }
}
