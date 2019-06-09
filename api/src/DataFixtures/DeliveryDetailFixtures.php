<?php

namespace App\DataFixtures;

use App\Entity\DeliveryDetail;
use \Faker\Factory;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;

class DeliveryDetailFixtures extends Fixture implements DependentFixtureInterface
{
    private $faker;

    public const DELIVERY_DETAIL_REFERENCE = 'deliveryDetail';

    public function __construct()
    {
        $this->faker = Factory::create('fr_FR');
    }

    public function load(ObjectManager $manager)
    {
        $deliveryDetail = new DeliveryDetail();

        /* informations  */
        $deliveryDetail->setReference($this->faker->bothify("????######"));
        $deliveryDetail->setDescription($this->faker->text(50));
        $deliveryDetail->setDateCreated($this->faker->dateTimeBetween('-2 years','now'));
        $deliveryDetail->setAttachmentFile($this->faker->url());
        $deliveryDetail->setIsShipped($this->faker->boolean(80));

        if($this->faker->boolean(80))
        {
            $deliveryDetail->setIsReceived($this->faker->boolean(60));
        }
        else
        {
            $deliveryDetail->setIsReceived(false);
        }

        /* relations */
        $deliveryDetail->setOrderDetail($this->getReference(OrderDetailFixtures::ORDER_DETAIL_REFERENCE));
        $deliveryDetail->setDeliveryGlobal($this->getReference(DeliveryGlobalFixtures::DELIVERY_GLOBAL_REFERENCE));

        $manager->persist($deliveryDetail);

        $manager->flush();

        $this->addReference(self::DELIVERY_DETAIL_REFERENCE, $deliveryDetail);
    }

    public function getDependencies()
    {
        return array(
            DeliveryGlobalFixtures::class,
            OrderDetailFixtures::class,
        );
    }
}
