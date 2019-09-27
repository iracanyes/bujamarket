<?php

namespace App\DataFixtures;


use App\Entity\ShoppingCard;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;

class ShoppingCardFixtures extends Fixture implements DependentFixtureInterface
{
    public const SHOPPING_CARD_REFERENCE = 'shopping_card';

    public function load(ObjectManager $manager)
    {
        $shopping_card = new ShoppingCard();


        /* Relations */
        $shopping_card->setCustomer($this->getReference(CustomerFixtures::CUSTOMER_REFERENCE));

        $manager->persist($shopping_card);

        $manager->flush();

        $this->addReference(self::SHOPPING_CARD_REFERENCE, $shopping_card);
    }

    public function getDependencies()
    {
        return array(
            CustomerFixtures::class
        );
    }
}
