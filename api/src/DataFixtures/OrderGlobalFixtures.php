<?php

namespace App\DataFixtures;

use App\Entity\OrderGlobal;
use \Faker\Factory;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;

class OrderGlobalFixtures extends Fixture implements DependentFixtureInterface
{
    public const ORDER_GLOBAL_REFERENCE = 'orderGlobal';

    private $faker;

    public function __construct()
    {
        $this->faker = Factory::create('fr_FR');
    }

    public function load(ObjectManager $manager)
    {
        $orderGlobal = new OrderGlobal();

        $orderGlobal->setTotalWeight($this->faker->randomFloat(2, 1));
        $orderGlobal->setDateCreated($this->faker->dateTimeBetween('-2 years','now'));


        $totalCost = 0;
        $taille = count($orderGlobal->getOrderDetails());
        $cpt = 0;

        while($cpt < $taille)
        {
            $totalCost += $orderGlobal->getOrderDetails()[$cpt]->getTotalCost();
            $cpt++;
        }

        $orderGlobal->setNbPackage($taille);
        $orderGlobal->setTotalCost($totalCost);

        /* Relations */
        $orderGlobal->setCustomer($this->getReference(CustomerFixtures::CUSTOMER_REFERENCE));

        

        $manager->persist($orderGlobal);

        $manager->flush();

        $this->addReference(self::ORDER_GLOBAL_REFERENCE, $orderGlobal);
    }

    public function getDependencies()
    {
        return array(
            CustomerFixtures::class,
        );
    }

}
