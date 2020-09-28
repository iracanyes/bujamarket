<?php

namespace App\DataFixtures;

use App\Entity\Supplier;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use App\Entity\User;
use App\Entity\Admin;
use \Faker\Factory;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class SystemAdminFixtures extends Fixture implements DependentFixtureInterface, FixtureGroupInterface
{
    public const SYSTEM_ADMIN_REFERENCE = 'system_admin';

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
        $admin = new Admin();

        /* User data */
        $this->setUserInfo($admin);
        $admin->setUserType('admin');

        /* Admin data  */
        $admin->setAdminKey($this->faker->unique()->sha1());
        $admin->setNbRefundValidated(count($admin->getBillRefunds()));
        $admin->setNbIssueResolved(0);




        $manager->persist($admin);
        $manager->flush();

        $this->addReference(self::SYSTEM_ADMIN_REFERENCE, $admin);
    }

    public function setUserInfo(User $user)
    {
        $user->setEmail('iracanyes@gmail.com');

        $password = $this->encoder->encodePassword($user, getenv('FIXTURE_SUPER_ADMIN_PASSWORD'));
        $user->setPassword($password);
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
        $user->setRoles(["ROLE_SYSTEM_ADMIN","ROLE_ADMIN","ROLE_SUPPLIER","ROLE_CUSTOMER","ROLE_MEMBER","ROLE_ALLOWED_TO_SWICTH"]);

        /* Relations */

        $user->setImage($this->getReference(ImageAdminFixtures::IMAGE_ADMIN_REFERENCE));

    }

    /**
     * Permet de définir un ordre de chargement des fixtures ainsi les dépendances sont chargés avant
     * @return array
     */
    public function getDependencies()
    {
        return array(
            ImageAdminFixtures::class
        );
    }

    public static function getGroups(): array
    {
        return ["system_admin"];
    }
}
