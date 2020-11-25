<?php

namespace App\DataFixtures;

use App\Entity\Image;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use \Faker\Factory;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class ImageCustomerGroupTestFixtures extends Fixture implements FixtureGroupInterface
{
    private $faker;

    public const IMAGE_CUSTOMER_GROUP_TEST_REFERENCE = 'imageCustomerGroupTest';

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
        $image->setUrl($this->faker->randomElement([
            'emotions-371238_1920.jpg',
            'hijab-3064633_1920.jpg',
            'lonely-814631_1920.jpg',
            'people-2605526_1920.jpg',
            'qsdfsdf-5ee1a8694d13a.jpg',
            'Skavar-5f6d8c405722d.jpeg',
            'Skoll-5f7d425f1b035.jpeg',
            'Skull-5ef4440403024.jpeg',
            'Skully-5f3c431b16c8f.jpeg',
            'Skully-5f7f9f2318a8b.jpeg',
            'sunset-570881_1920.jpg',
            'woman-586185_1920.jpg'
        ]));
        $image->setSize($this->faker->numberBetween(3000,8000));
        $image->setMimeType($this->faker->randomElement(['image/jpeg','image/png','image/jpg']));

        $manager->persist($image);

        $manager->flush();

        $this->setReference(self::IMAGE_CUSTOMER_GROUP_TEST_REFERENCE, $image);
    }

    public static function getGroups(): array
    {
        return ["system_admin"];
    }



}
