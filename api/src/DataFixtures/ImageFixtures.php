<?php

namespace App\DataFixtures;

use App\Entity\Image;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use \Faker\Factory;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class ImageFixtures extends Fixture implements FixtureGroupInterface
{
    private $faker;



    public const IMAGE_REFERENCE = 'image';

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
        $image->setUrl($this->faker->randomElement([
            'Buja_Market_20201504235045.jpg',
            'art-1851483_1920.jpg',
            'biim_5ed0747e84f730.52908222.jpeg',
            'bobby-car-349695_1920.jpg',
            'bucket-1005891_1920.jpg',
            'Buja_Market_20201504235045.jpg',
            'bujamarket_5f83a153295a69.69392434.jpeg',
            'bujamarket_5f83a153304861.50865348.jpeg',
            'bujamarket_5f83b2911a3c63.83199139.jpeg',
            'bujamarket_5f83b2911c0cc7.12929082.jpeg',
            'bujamarket_5f83bc5c1a8e22.34191701.jpeg',
            'bujamarket_5f83d98f93f136.18269222.jpeg',
            'bujamarket_5f84ea7864f4b6.71491861.jpeg',
            'bujamarket_5f84ea7869bab5.86691463.jpeg',
            'bujamarket_5f84ed04bb4829.43469198.jpeg',
            'bujamarket_5f84f7eccd3c99.12217835.jpeg',
            'car-63930_1920.jpg',
            'computer-1245714_1920.jpg',
            'fruit-1534494_1920.jpg',
            'fruit-4025710_1920.jpg',
            'grapes-690230_1920.jpg',
            'laptop-1483974_1920.jpg',
            'mac-459196_1920.jpg',
            'mango-164572_1280.jpg',
            'meat-1030729_1920.jpg',
            'potato-3440360_1920.jpg',
            'strawberries-1330459_1920.jpg',
            'sugar-cane-276242_1920.jpg',
            'teddy-bear-3599680_1920.jpg'
        ]));
        $image->setSize($this->faker->numberBetween(3000,8000));
        $image->setMimeType($this->faker->randomElement(['image/jpeg','image/png','image/jpg']));

        $manager->persist($image);
        $manager->flush();

        $this->setReference(self::IMAGE_REFERENCE, $image);
    }

    public static function getGroups(): array
    {
        return ["group1","group2"];
    }



}
