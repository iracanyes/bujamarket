<?php

namespace App\DataFixtures;

use App\Entity\Product;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use \Faker\Factory;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class ProductFixtures extends Fixture implements DependentFixtureInterface, FixtureGroupInterface
{
    public const PRODUCT_REFERENCE = 'product';

    private $faker;

    public function __construct()
    {
        $this->faker = Factory::create('fr_BE');
    }


    public function load(ObjectManager $manager)
    {
        $product = new Product();

        $product->setTitle($this->faker->sentence(10, true));
        $product->setResume($this->faker->realText(60));
        $product->setDescription($this->faker->realText(200));
        $product->setHeight($this->faker->randomFloat(20, 2000));
        $product->setWeight($this->faker->randomFloat(20, 2000));
        $product->setWidth($this->faker->randomFloat(20, 2000));
        $product->setLength($this->faker->randomFloat(20, 2000));
        $product->setCountryOrigin($this->faker->randomElement(['BU','RW','CD','TZA']));

        /* Relations */
        $product->setCategory($this->getReference(CategoryFixtures::CATEGORY_REFERENCE));
        $product->addImage($this->getReference(ImageFixtures::IMAGE_REFERENCE));

        $manager->persist($product);

        $manager->flush();

        $this->addReference(self::PRODUCT_REFERENCE, $product);
    }

    public function getDependencies()
    {

        return array(
            CategoryFixtures::class,
            ImageFixtures::class,
        );

    }

    public static function getGroups(): array
    {
        return ["group1","group2"];
    }

}
