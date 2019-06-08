<?php

namespace App\DataFixtures;

use App\Entity\Image;
use \Faker\Factory;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;

class ImageFixtures extends Fixture implements DependentFixtureInterface
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
        $image->setUrl($this->faker->url());
        $image->setSize($this->faker->randomNumber(6, false));

        $manager->persist($image);

        $manager->flush();

        $this->addReference(self::IMAGE_REFERENCE, $image);
    }


}
