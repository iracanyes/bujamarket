<?php

namespace App\DataFixtures;

use App\Entity\Image;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use \Faker\Factory;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;


class ImageSuperAdminFixtures extends Fixture implements FixtureGroupInterface
{
    private $faker;

    public const IMAGE_SUPER_ADMIN_REFERENCE = 'imageSuperAdmin';

    public function __construct()
    {
        $this->faker = Factory::create('fr_FR');
    }

    public function load(ObjectManager $manager): void
    {
        $image = new Image();

        $image->setPlace($this->faker->numberBetween(1,10));
        $image->setTitle($this->faker->sentence(7, true));
        $image->setAlt($this->faker->sentence(7, true));
        $image->setUrl('https://picsum.photos/1600/900');
        $image->setSize($this->faker->numberBetween(3000,8000));

        $manager->persist($image);

        $manager->flush();

        $this->addReference(self::IMAGE_SUPER_ADMIN_REFERENCE, $image);
    }

    public static function getGroups(): array
    {
        return ["group1"];
    }



}