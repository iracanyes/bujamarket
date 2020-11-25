<?php

namespace App\DataFixtures;

use App\Entity\Image;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use \Faker\Factory;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class ImageSupplierGroupTestFixtures extends Fixture implements FixtureGroupInterface
{
    private $faker;

    public const IMAGE_SUPPLIER_GROUP_TEST_REFERENCE = 'imageSupplierGroupTest';

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
            'arazezr-5f34f68bd0d4d.jpeg',
            'baby-1399332_1920.jpg',
            'Buja-Market-5ef435b532f92.jpeg',
            'Buja-Market-5f6cd5d29b689.jpeg',
            'Buja-Market-5f7fa16274223.jpeg',
            'Buja-Market-5f3615c181493.jpeg',
            'Buja-Market-5f3861560894a.jpeg',
            'Delta-S-P-R-L-5ef0753edcecb.jpg',
            'entrepreneur-593358_1920.jpg',
            'kid-849363_1920.jpg',
            'men-2425121_1920.jpg',
            'senior-3336451_1920.jpg',
            'suit-673697_1920.jpg',
            'tie-690084_1920.jpg'
        ]));
        $image->setSize($this->faker->numberBetween(3000,8000));
        $image->setMimeType($this->faker->randomElement(['image/jpeg','image/png','image/jpg']));

        $manager->persist($image);

        $manager->flush();

        $this->setReference(self::IMAGE_SUPPLIER_GROUP_TEST_REFERENCE, $image);
    }

    public static function getGroups(): array
    {
        return ["system_admin"];
    }



}
