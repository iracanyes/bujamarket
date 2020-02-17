<?php

namespace App\DataFixtures;

use App\Entity\Category;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use \Faker\Factory;


class CategoryFixtures extends Fixture implements DependentFixtureInterface, FixtureGroupInterface
{
    /**
     * @var \Faker\Factory
     */
    private $faker;

    public const CATEGORY_REFERENCE = 'category';

    public function __construct()
    {
        $this->faker = Factory::create('fr_FR');
    }

    public function load(ObjectManager $manager)
    {
        $category = new Category();

        $category->setName($this->faker->sentence(2, false));
        $category->setDescription($this->faker->text(100));
        $category->setDateCreated($this->faker->dateTimeBetween('-3 years', 'now'));
        $category->setIsValid($this->faker->randomElement([0,1]));
        $category->setPlatformFee($this->faker->randomFloat(2,0.05,0.45));

        // Relation
        $category->setImage($this->getReference(ImageFixtures::IMAGE_REFERENCE));


        $manager->persist($category);
        $manager->flush();

        $this->addReference(self::CATEGORY_REFERENCE, $category);
    }

    public function getDependencies()
    {
        return array(
            ImageFixtures::class
        );
    }

    public static function getGroups(): array
    {
        return ["group1","group2"];
    }

}
