<?php

namespace App\DataFixtures;

use App\Entity\Image;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use \Faker\Factory;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class ImageProductFixtures extends Fixture implements DependentFixtureInterface, FixtureGroupInterface
{
    private $faker;

    public const IMAGE_PRODUCT_REFERENCE = 'imageProduct';

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
        $image->setUrl('https://picsum.photos/1600/900');
        $image->setSize($this->faker->randomNumber(6, false));

        $image->setProduct($this->getReference(ProductFixtures::PRODUCT_REFERENCE));


        $manager->persist($image);

        $manager->flush();

        $this->addReference(self::IMAGE_PRODUCT_REFERENCE, $image);
    }

    public function getDependencies()
    {
        return array(
            ProductFixtures::class,
        );
    }

    public static function getGroups(): array
    {
        return ["group1","group2"];
    }

}
