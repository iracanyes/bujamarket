<?php

namespace App\DataFixtures;


use App\Entity\ShoppingCard;
use App\Entity\ShoppingCardSupplierProduct;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use \Faker\Factory;

class ShoppingCardSupplierProductFixtures extends Fixture implements DependentFixtureInterface
{
    public const SHOPPING_CARD_SUPPLIER_PRODUCT_REFERENCE = 'shopping_card_supplier_product';

    private $faker;

    public function __construct()
    {
        $this->faker = Factory::create('fr_FR');
    }

    public function load(ObjectManager $manager)
    {
        $shopping_card_supplier_product = new ShoppingCardSupplierProduct();

        $shopping_card_supplier_product->setQuantity($this->faker->numberBetween(1, 10));

        /* Relations */
        $shopping_card_supplier_product->setSupplierProduct($this->getReference(SupplierProductFixtures::SUPPLIER_PRODUCT_REFERENCE));
        $shopping_card_supplier_product->setShoppingCard($this->getReference(ShoppingCardFixtures::SHOPPING_CARD_REFERENCE));

        $manager->persist($shopping_card_supplier_product);

        $manager->flush();

        $this->addReference(self::SHOPPING_CARD_SUPPLIER_PRODUCT_REFERENCE, $shopping_card_supplier_product);
    }

    public function getDependencies()
    {
        return array(
            SupplierProductFixtures::class,
            ShoppingCardFixtures::class,
        );
    }
}
