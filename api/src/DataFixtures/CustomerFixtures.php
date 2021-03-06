<?php

namespace App\DataFixtures;

use App\Entity\Customer;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use App\Entity\User;
use \Faker\Factory;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class CustomerFixtures extends Fixture implements DependentFixtureInterface, FixtureGroupInterface
{
    public const CUSTOMER_REFERENCE = 'customer';

    /**
     * @var \Faker\Generator
     */
    private $faker;

    /**
     * @var UserPasswordEncoderInterface
     */
    private $encoder;


    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->faker = Factory::create('fr_FR');
        $this->encoder = $encoder;

    }


    /**
     * @param ObjectManager $manager
     */
    public function load(ObjectManager $manager)
    {
        $customer = new Customer();

        /* User data */
        $this->setUserInfo($customer);
        $customer->setUserType('customer');

        /* Customer data  */
        $customer->setCustomerKey($this->faker->unique()->sha1);
        $customer->setNbAbuseIdentified(0);
        $customer->setAverageRating($this->faker->randomFloat(1,0,10));
        $customer->setNbOrderCompleted(count($customer->getOrderSets()));
        $customer->setNbOrderWithdrawn(0);

        $manager->persist($customer);
        $manager->flush();

        $this->setReference(self::CUSTOMER_REFERENCE, $customer);
    }

    public function setUserInfo(User $user)
    {
        $user->setEmail($this->faker->unique()->email);

        $user->setPassword($this->encoder->encodePassword($user, getenv('FIXTURE_CUSTOMER_PASSWORD')));
        $user->setFirstname($this->faker->firstName);
        $user->setLastname($this->faker->lastName);
        $user->setNbErrorConnection(0);
        $user->setBanned(false);
        $user->setSigninConfirmed(true);
        $user->setLocked(false);
        $user->setDateRegistration($this->faker->dateTimeAd('now', 'Europe/Paris'));
        $user->setLanguage($this->faker->languageCode);
        $user->setCurrency($this->faker->currencyCode);
        // Création du token
        $user->setToken(bin2hex(random_bytes(64)));

        $user->setRoles(["ROLE_CUSTOMER","ROLE_MEMBER","ROLE_ALLOWED_TO_SWICTH"]);
        /* Relations */

        $user->setImage($this->getReference(ImageCustomerFixtures::IMAGE_CUSTOMER_REFERENCE));

    }

    /**
     * Permet de définir un ordre de chargement des fixtures ainsi les dépendances sont chargés avant
     * @return array
     */
    public function getDependencies()
    {
        return array(
            ImageCustomerFixtures::class
        );
    }

    public static function getGroups(): array
    {
        return ["group1","group2"];
    }
}
