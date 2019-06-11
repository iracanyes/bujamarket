<?php

namespace App\DataFixtures;

use App\Entity\Image;
use \Faker\Factory;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;

class ImageAdminFixtures extends Fixture
{
    private $faker;

    public const IMAGE_ADMIN_REFERENCE = 'imageAdmin';

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
        $image->setUrl($this->faker->url);
        $image->setSize($this->faker->numberBetween(3000,8000));

        $manager->persist($image);

        $manager->flush();

        $this->addReference(self::IMAGE_ADMIN_REFERENCE, $image);
    }


}
