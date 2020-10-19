<?php

namespace App\DataFixtures;

use App\Entity\Message;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use \Faker\Factory;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class MessageAdminForumCustomerFixtures extends Fixture implements DependentFixtureInterface, FixtureGroupInterface
{
    private $faker;


    public const MESSAGE_ADMIN_FORUM_CUSTOMER_REFERENCE = 'messageAdminForumCustomer';

    public function __construct()
    {
        $this->faker = Factory::create('fr_FR');

    }

    public function load(ObjectManager $manager)
    {
        $message = new Message();

        $message->setContent($this->faker->realText(50));
        $message->setDateCreated($this->faker->dateTimeBetween('-2 years', 'now'));
        $message->setAttachmentFile($this->faker->url());
        $message->setAttachmentUrl($this->faker->url());

        if($this->faker->boolean(40)){
            $message->setAttachmentImage($this->faker->imageUrl());
        }


        /* Relation */
        $message->setUser($this->getReference(AdminFixtures::ADMIN_REFERENCE));
        $message->setForum($this->getReference(ForumCustomerFixtures::FORUM_CUSTOMER_REFERENCE));

        $manager->persist($message);

        $manager->flush();



        $this->setReference(self::MESSAGE_ADMIN_FORUM_CUSTOMER_REFERENCE, $message);
    }

    public function getDependencies()
    {
        return array(
            AdminFixtures::class,
            ForumCustomerFixtures::class,
        );
    }

    public static function getGroups(): array
    {
        return ["group1","group2"];
    }

}
