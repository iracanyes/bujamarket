<?php

namespace App\DataFixtures;

use App\Entity\SupplierProduct;
use \Faker\Factory;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;

class SupplierProductFixtures extends Fixture implements DependentFixtureInterface
{
    public const SUPPLIER_PRODUCT_REFERENCE = 'supplierProduct';

    private $faker;

    public function __construct()
    {
        $this->faker = Factory::create('fr_BE');
    }


    public function load(ObjectManager $manager)
    {
        $supplierProduct = new SupplierProduct();

        $supplierProduct->setInitialPrice($this->faker->randomFloat(4,10,2000));
        $supplierProduct->setAdditionalFee($this->faker->randomFloat(2, 0, 0.35));
        $supplierProduct->setAdditionalInformation($this->faker->realText(50));
        $supplierProduct->setIsAvailable($this->faker->boolean(80));
        $supplierProduct->setIsLimited($this->faker->boolean(20));

        if($supplierProduct->getIsLimited() == true)
        {
            $supplierProduct->setQuantity($this->faker->numberBetween(10,1000));
        }

        /* Relations */
        $supplierProduct->setProduct($this->getReference(ProductFixtures::PRODUCT_REFERENCE));
        $supplierProduct->setSupplier($this->getReference(SupplierFixtures::SUPPLIER_REFERENCE));


        $manager->persist($supplierProduct);

        $manager->flush();

        $this->addReference(self::SUPPLIER_PRODUCT_REFERENCE, $supplierProduct);
    }

    public function getDependencies()
    {

        return array(
            SupplierFixtures::class,
            ProductFixtures::class,
        );

    }
}
