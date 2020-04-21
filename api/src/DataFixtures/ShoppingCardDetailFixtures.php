<?php

namespace App\DataFixtures;

use App\Entity\ShoppingCartDetail;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use \Faker\Factory;

class ShoppingCardDetailFixtures extends Fixture implements DependentFixtureInterface, FixtureGroupInterface
{
    public const SHOPPING_CARD_DETAIL_REFERENCE = 'shopping_card_detail';

    private $faker;

    public function __construct()
    {
        $this->faker = Factory::create('fr_FR');
    }

    public function load(ObjectManager $manager)
    {
        $shopping_card_detail = new ShoppingCartDetail();

        $shopping_card_detail->setDateCreated(new \DateTimeImmutable());
        $shopping_card_detail->setQuantity($this->faker->numberBetween(1, 10));

        /* Relations */
        $shopping_card_detail->setSupplierProduct($this->getReference(SupplierProductFixtures::SUPPLIER_PRODUCT_REFERENCE));
        $shopping_card_detail->setCustomer($this->getReference(CustomerFixtures::CUSTOMER_REFERENCE));

        $manager->persist($shopping_card_detail);

        $manager->flush();

        $this->addReference(self::SHOPPING_CARD_DETAIL_REFERENCE, $shopping_card_detail);
    }

    public function getDependencies()
    {
        return array(
            SupplierProductFixtures::class,
            CustomerFixtures::class,
        );
    }

    public static function getGroups(): array
    {
        return ["group1","group2"];
    }

}
