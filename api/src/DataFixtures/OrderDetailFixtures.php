<?php

namespace App\DataFixtures;

use App\Entity\OrderDetail;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use \Faker\Factory;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class OrderDetailFixtures extends Fixture implements DependentFixtureInterface, FixtureGroupInterface
{
    public const ORDER_DETAIL_REFERENCE = 'orderDetail';

    private $faker;

    public function __construct()
    {
        $this->faker = Factory::create('fr_FR');
    }

    public function load(ObjectManager $manager)
    {

        $orderDetail = new OrderDetail();

        $orderDetail->setStatus($this->faker->randomElement(['pending','in progress','shipped','finalized','blocked']));
        $orderDetail->setQuantity($this->faker->numberBetween(1,20));
        $orderDetail->setUnitCost($this->faker->numberBetween(2, 5000));
        $orderDetail->setTotalCost();

        /* Relations */
        $orderDetail->setSupplierProduct($this->getReference(SupplierProductFixtures::SUPPLIER_PRODUCT_REFERENCE));
        $orderDetail->setOrderSet($this->getReference(OrderSetFixtures::ORDER_SET_REFERENCE));

        $manager->persist($orderDetail);
        $manager->flush();



        $this->setReference(self::ORDER_DETAIL_REFERENCE, $orderDetail);


    }

    public function getDependencies()
    {
        return array(
            OrderSetFixtures::class,
            SupplierProductFixtures::class,
        );
    }

    public static function getGroups(): array
    {
        return ["group1","group2","multiple"];
    }


}
