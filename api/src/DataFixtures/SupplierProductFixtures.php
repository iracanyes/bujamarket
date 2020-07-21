<?php

namespace App\DataFixtures;

use App\Entity\SupplierProduct;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use \Faker\Factory;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
ini_set('memory_limit', '3000M');

class SupplierProductFixtures extends Fixture implements DependentFixtureInterface, FixtureGroupInterface
{
    public const SUPPLIER_PRODUCT_REFERENCE = 'supplierProduct';

    private $faker;

    public function __construct()
    {
        $this->faker = Factory::create('fr_BE');
    }


    public function load(ObjectManager $manager): void
    {
        $supplierProduct = new SupplierProduct();

        $supplierProduct->setInitialPrice($this->faker->randomFloat(4,10,2000));
        $supplierProduct->setAdditionalFee($this->faker->randomFloat(2, 0, 0.35));
        $supplierProduct->setAdditionalInformation($this->faker->realText(50));
        $supplierProduct->setIsAvailable($this->faker->boolean(80));
        $supplierProduct->setIsLimited($this->faker->boolean(20));
        $supplierProduct->setRating($this->faker->randomFloat(2,0,10));

        if($supplierProduct->getIsLimited() == true)
        {
            $supplierProduct->setQuantity($this->faker->numberBetween(10,1000));
        }

        /* Relations */
        $supplierProduct->setProduct($this->getReference(ProductFixtures::PRODUCT_REFERENCE));
        $supplierProduct->setSupplier($this->getReference(SupplierFixtures::SUPPLIER_REFERENCE));

        for($i=0; $i < $this->faker->numberBetween(3,10); $i++ ){
            $supplierProduct->addImage($this->getReference(ImageFixtures::IMAGE_REFERENCE));
        }



        $manager->persist($supplierProduct);

        $manager->flush();

        $this->addReference(self::SUPPLIER_PRODUCT_REFERENCE, $supplierProduct);
    }

    public function getDependencies()
    {

        return array(
            SupplierFixtures::class,
            ProductFixtures::class,
            CategoryFixtures::class,
            ImageFixtures::class
        );

    }

    public static function getGroups(): array
    {
        return ["group1","group2"];
    }
}
