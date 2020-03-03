<?php

namespace App\DataFixtures;

use App\Entity\Forum;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Tests\Common\DataFixtures\TestFixtures\UserFixture;
use \Faker\Factory;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class ForumCustomerFixtures extends Fixture implements DependentFixtureInterface, FixtureGroupInterface
{
    private $faker;

    public const FORUM_CUSTOMER_REFERENCE = 'forumCustomer';

    public function __construct()
    {
        $this->faker = Factory::create('fr_FR');
    }

    public function load(ObjectManager $manager)
    {
        $forum = new Forum();

        /* Informations */
        $forum->setTitle($this->faker->sentence(7, true));
        $forum->setStatus($this->faker->randomElement(['open','pending','resolved']));
        $forum->setType($this->faker->randomElement(['information', 'dispute','abuse']));
        $forum->setIsClosed($this->faker->boolean(30));
        $forum->setDateCreated($this->faker->dateTimeBetween('-2 years', 'now'));


        /* Relation */
        $forum->setUser($this->getReference(CustomerFixtures::CUSTOMER_REFERENCE));
        $forum->setResponder($this->getReference(AdminFixtures::ADMIN_REFERENCE));

        $manager->persist($forum);

        $manager->flush();

        $this->addReference(self::FORUM_CUSTOMER_REFERENCE, $forum);
    }

    public function getDependencies()
    {
        return array(
            CustomerFixtures::class,
            AdminFixtures::class,
        );
    }

    public static function getGroups(): array
    {
        return ["group1","group2"];
    }

}
