<?php

namespace App\DataFixtures;

use App\Entity\Favorite;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;

class FavoriteFixtures extends Fixture implements DependentFixtureInterface
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

        $this->addReference(self::FAVORITE_REFERENCE, $favorite);
    }

    public function getDependencies()
    {
        return array(
            SupplierProductFixtures::class,
            CustomerFixtures::class,
        );
    }
}
