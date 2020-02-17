<?php

namespace App\DataFixtures;

use App\Entity\Message;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use \Faker\Factory;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class MessageAdminForumSupplierFixtures extends Fixture implements DependentFixtureInterface, FixtureGroupInterface
{
    private $faker;


    public const MESSAGE_ADMIN_FORUM_SUPPLIER_REFERENCE = 'messageAdminForumSupplier';

    public function __construct()
    {
        $this->faker = Factory::create('fr_FR');

    }

    public function load(ObjectManager $manager)
    {
        $message = new Message();

        ini_set('memory_limit', '256M');
        $message->setContent($this->faker->realText(50));
        $message->setDateCreated($this->faker->dateTimeBetween('-2 years', 'now'));
        $message->setAttachmentFile($this->faker->url());
        $message->setAttachmentUrl($this->faker->url());

        if($this->faker->boolean(20))
        {
            $message->setAttachmentImage($this->faker->imageUrl());
        }


        /* Relation */
        $message->setUser($this->getReference(AdminFixtures::ADMIN_REFERENCE));
        $message->setForum($this->getReference(ForumSupplierFixtures::FORUM_SUPPLIER_REFERENCE));

        $manager->persist($message);

        $manager->flush();



        $this->addReference(self::MESSAGE_ADMIN_FORUM_SUPPLIER_REFERENCE, $message);
    }

    public function getDependencies()
    {
        return array(
            AdminFixtures::class,
            ForumSupplierFixtures::class,
        );
    }

    public static function getGroups(): array
    {
        return ["group1","group2"];
    }

}
