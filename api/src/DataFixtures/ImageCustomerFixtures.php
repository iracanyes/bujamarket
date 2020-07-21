<?php

namespace App\DataFixtures;

use App\Entity\Image;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use \Faker\Factory;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class ImageCustomerFixtures extends Fixture implements FixtureGroupInterface
{
    private $faker;

    public const IMAGE_CUSTOMER_REFERENCE = 'imageCustomer';

    public function __construct()
    {
        $this->faker = Factory::create('fr_FR');
    }

    public function load(ObjectManager $manager)
    {
        $image = new Image();

        $image->setPlace(1);
        $image->setTitle($this->faker->sentence(7, true));
        $image->setAlt($this->faker->sentence(7, true));
        $image->setUrl('qsdfsdf-5ee1a8694d13a.jpeg');
        $image->setSize($this->faker->numberBetween(3000,8000));
        $image->setMimeType($this->faker->randomElement(['image/jpeg','image/png','image/jpg']));

        $manager->persist($image);

        $manager->flush();

        $this->addReference(self::IMAGE_CUSTOMER_REFERENCE, $image);
    }

    public static function getGroups(): array
    {
        return ["group1","group2"];
    }



}
