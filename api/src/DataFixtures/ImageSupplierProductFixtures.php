<?php

namespace App\DataFixtures;

use App\Entity\Image;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use \Faker\Factory;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class ImageSupplierProductFixtures extends Fixture implements DependentFixtureInterface, FixtureGroupInterface
{
    private $faker;

    public const IMAGE_SUPPLIER_PRODUCT_REFERENCE = 'imageSupplierProduct';

    public function __construct()
    {
        $this->faker = Factory::create('fr_FR');
    }

    public function load(ObjectManager $manager)
    {
        $image = new Image();

        $image->setPlace($this->faker->numberBetween(1,10));
        $image->setTitle($this->faker->sentence(7, true));
        $image->setAlt($this->faker->sentence(7, true));
        $image->setUrl('Buja_Market_20201504235045.jpg');
        $image->setSize($this->faker->randomNumber(6, false));
        $image->setMimeType($this->faker->randomElement(['image/jpeg','image/png','image/jpg']));

        $image->setSupplierProduct($this->getReference(SupplierProductFixtures::SUPPLIER_PRODUCT_REFERENCE));


        $manager->persist($image);

        $manager->flush();

        $this->addReference(self::IMAGE_SUPPLIER_PRODUCT_REFERENCE, $image);
    }

    public function getDependencies()
    {
        return array(
            SupplierProductFixtures::class,
        );
    }

    public static function getGroups(): array
    {
        return ["group1","group2"];
    }

}
