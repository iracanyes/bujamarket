<?php

namespace App\DataFixtures;

use App\Entity\OrderReturned;
use \Faker\Factory;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;

class OrderReturnedFixtures extends Fixture implements DependentFixtureInterface
{
    public const ORDER_RETURNED_REFERENCE = 'orderReturned';

    private $faker;

    public function __construct()
    {
        $this->faker = Factory::create('fr_FR');
    }

    public function load(ObjectManager $manager)
    {
        $orderReturned = new OrderReturned();

        $orderReturned->setDescription($this->faker->realText(100));
        $orderReturned->setReason($this->faker->randomElement(['defective','unwanted','broken','unsatisfied']));
        $orderReturned->setIsIntact($this->faker->boolean(60));
        $orderReturned->setFileUrl($this->faker->url());



        /* Relations */
        $orderReturned->setOrderDetail($this->getReference(OrderDetailFixtures::ORDER_DETAIL_REFERENCE));

        

        $manager->persist($orderReturned);

        $manager->flush();

        $this->addReference(self::ORDER_RETURNED_REFERENCE, $orderReturned);
    }

    public function getDependencies()
    {
        return array(
            OrderDetailFixtures::class,
        );
    }

}
