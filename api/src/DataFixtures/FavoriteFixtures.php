<?php

namespace App\DataFixtures;

use App\Entity\Favorite;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class FavoriteFixtures extends Fixture implements DependentFixtureInterface, FixtureGroupInterface
{
    public const FAVORITE_REFERENCE = 'favorite';

    public function load(ObjectManager $manager)
    {
        $favorite = new Favorite();

        /* Relations */
        $favorite->setSupplierProduct($this->getReference(SupplierProductFixtures::SUPPLIER_PRODUCT_REFERENCE));
        $favorite->setCustomer($this->getReference(CustomerFixtures::CUSTOMER_REFERENCE));

        $manager->persist($favorite);

        $manager->flush();

        $this->setReference(self::FAVORITE_REFERENCE, $favorite);
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
