<?php

namespace App\DataFixtures;

use App\Entity\Shipper;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use \Faker\Factory;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class ShipperFixtures extends Fixture implements FixtureGroupInterface
{
    public const SHIPPER_REFERENCE = 'shipper';

    private $faker;

    public function __construct()
    {
        $this->faker = Factory::create('fr_BE');
    }


    public function load(ObjectManager $manager)
    {
        $shipper = new Shipper();

        $shipper->setName($this->faker->company());
        $shipper->setDescription($this->faker->realText(100));
        $shipper->setSocialReason($this->faker->company." ".$this->faker->companySuffix);
        $shipper->setTradeRegisterNumber($this->faker->isbn10);
        $shipper->setVatNumber($this->faker->isbn13);
        $shipper->setService('Import/Export');
        $shipper->setDeliveryCommitment($this->faker->realText(100));
        $shipper->setContactNumber($this->faker->phoneNumber);


        /* Relations */


        $manager->persist($shipper);

        $manager->flush();

        $this->addReference(self::SHIPPER_REFERENCE, $shipper);
    }

    public static function getGroups(): array
    {
        return ["group1","group2"];
    }



}
