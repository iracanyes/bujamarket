<?php

namespace App\DataFixtures;

use App\Entity\Withdrawal;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use \Faker\Factory;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class WithdrawalFixtures extends Fixture implements DependentFixtureInterface, FixtureGroupInterface
{
    public const WITHDRAWAL_REFERENCE = 'withdrawal';

    private $faker;

    public function __construct()
    {
        $this->faker = Factory::create('fr_BE');
    }


    public function load(ObjectManager $manager)
    {
        $withdrawal = new Withdrawal();

        $withdrawal->setStatus($this->faker->randomElement(['pending','processing','confirmed','refused','failed']));
        $withdrawal->setDateCreated($this->faker->dateTimeBetween('-2 years', 'now'));
        $withdrawal->setIsValid($this->faker->boolean(50));

        if($withdrawal->getIsValid() == false)
        {
            $withdrawal->setOrderDelivered($this->faker->boolean(70));

        }else{
            $withdrawal->setOrderDelivered($this->faker->boolean(0));
        }

        /* Relations */
        $withdrawal->setOrderDetail($this->getReference(OrderDetailFixtures::ORDER_DETAIL_REFERENCE));

        $manager->persist($withdrawal);

        $manager->flush();

        $this->addReference(self::WITHDRAWAL_REFERENCE, $withdrawal);
    }

    public function getDependencies()
    {

        return array(
            OrderDetailFixtures::class,
        );

    }

    public static function getGroups(): array
    {
        return ["group1","group2"];
    }

}
