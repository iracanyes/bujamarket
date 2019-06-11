<?php

namespace App\DataFixtures;

use App\Entity\OrderDetail;
use \Faker\Factory;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;

class OrderDetailFixtures extends Fixture implements DependentFixtureInterface
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
        $orderDetail->setTotalCost($this->faker->numberBetween(2, 20000));

        /* Relations */
        $orderDetail->setSupplierProduct($this->getReference(SupplierProductFixtures::SUPPLIER_PRODUCT_REFERENCE));
        $orderDetail->setOrderGlobal($this->getReference(OrderGlobalFixtures::ORDER_GLOBAL_REFERENCE));



        $manager->persist($orderDetail);

        $manager->flush();

        $this->addReference(self::ORDER_DETAIL_REFERENCE, $orderDetail);
    }

    public function getDependencies()
    {
        return array(
            OrderGlobalFixtures::class,
            SupplierProductFixtures::class,
        );
    }

}
