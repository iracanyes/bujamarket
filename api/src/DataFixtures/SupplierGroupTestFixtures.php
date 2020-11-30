<?php

namespace App\DataFixtures;

use App\Entity\Supplier;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use App\Entity\User;
use \Faker\Factory;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class SupplierGroupTestFixtures extends Fixture implements DependentFixtureInterface, FixtureGroupInterface
{
    public const SUPPLIER_GROUP_TEST_REFERENCE = 'supplierGroupTest';

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
        $supplier = new Supplier();

        /* User data */
        $this->setUserInfo($supplier);
        $supplier->setUserType('supplier');

        /* Supplier data  */
        $supplier->setSupplierKey($this->faker->sha1);
        $supplier->setSocialReason($this->faker->company." ".$this->faker->companySuffix);
        $supplier->setBrandName($this->faker->company);
        $supplier->setTradeRegistryNumber($this->faker->ean13);
        $supplier->setVatNumber($this->faker->ean8);
        $supplier->setContactFullname($this->faker->firstName." ".$this->faker->name);
        $supplier->setContactEmail($this->faker->companyEmail);
        $supplier->setContactPhoneNumber($this->faker->phoneNumber);
        $supplier->setWebsite($this->faker->domainName);

        /* Relations */
        $supplier->setImage($this->getReference(ImageSupplierGroupTestFixtures::IMAGE_SUPPLIER_GROUP_TEST_REFERENCE));
        $supplier->addAddress($this->getReference(AddressSupplierFixtures::ADDRESS_SUPPLIER_REFERENCE));

        $manager->persist($supplier);
        $manager->flush();

        $this->setReference(self::SUPPLIER_GROUP_TEST_REFERENCE, $supplier);
    }

    public function setUserInfo(User $user)
    {
        /* user informations */
        $user->setEmail('supplier-test@gmail.com');

        $password = $this->encoder->encodePassword($user, getenv('FIXTURE_SUPPLIER_PASSWORD'));

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

        $user->setRoles(["ROLE_PUBLISHER","ROLE_SUPPLIER","ROLE_MEMBER","ROLE_ALLOWED_TO_SWICTH"]);




    }



    /**
     * Permet de définir un ordre de chargement des fixtures ainsi les dépendances sont chargés avant
     * @return array
     */
    public function getDependencies()
    {
        return array(
            ImageSupplierGroupTestFixtures::class,
            AddressSupplierFixtures::class
        );
    }

    public static function getGroups(): array
    {
        return ["related"];
    }

}
