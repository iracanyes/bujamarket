<?php

namespace App\DataFixtures;

use App\Entity\OrderSet;
use Doctrine\Tests\Common\DataFixtures\AddressFixture;
use \Faker\Factory;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;

class OrderSetFixtures extends Fixture implements DependentFixtureInterface
{
    public const ORDER_SET_REFERENCE = 'orderSet';

    private $faker;

    public function __construct()
    {
        $this->faker = Factory::create('fr_FR');

    }

    public function load(ObjectManager $manager)
    {
        $orderSet = new OrderSet();

        $orderSet->setSessionId('cs_test_'.$this->faker->sha1);
        $orderSet->setTotalWeight($this->faker->randomFloat(2, 1));
        $orderSet->setDateCreated($this->faker->dateTimeBetween('-2 years','now'));


        $totalCost = 0;
        $taille = count($orderSet->getOrderDetails());
        $cpt = 0;

        while($cpt < $taille)
        {
            $totalCost += $orderSet->getOrderDetails()[$cpt]->getTotalCost();
            $cpt++;
        }

        $orderSet->setNbPackage($taille);
        $orderSet->setTotalCost($totalCost);

        /* Relations */
        $orderSet->setCustomer($this->getReference(CustomerFixtures::CUSTOMER_REFERENCE));
        $orderSet->setAddress($this->getReference(AddressCustomerFixtures::ADDRESS_CUSTOMER_REFERENCE));



        $manager->persist($orderSet);

        $manager->flush();

        $this->addReference(self::ORDER_SET_REFERENCE, $orderSet);
    }

    public function getDependencies()
    {
        return array(
            CustomerFixtures::class,
            AddressCustomerFixtures::class
        );
    }

}
