<?php

namespace App\DataFixtures;

use App\Entity\Supplier;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use App\Entity\User;
use \Faker\Factory;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class SupplierFixtures extends Fixture implements DependentFixtureInterface
{
    public const SUPPLIER_REFERENCE = 'supplier';

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
        $supplier->setImage($this->getReference(ImageSupplierFixtures::IMAGE_SUPPLIER_REFERENCE));



        $manager->persist($supplier);
        $manager->flush();

        $this->addReference(self::SUPPLIER_REFERENCE, $supplier);
    }

    public function setUserInfo(User $user)
    {
        /* user informations */
        $user->setEmail($this->faker->unique()->email);

        $password = $this->encoder->encodePassword($user, 'supplier');

        $user->setPassword($password);
        $user->setFirstname($this->faker->firstName);
        $user->setLastname($this->faker->lastName);
        $user->setNbErrorConnection(0);
        $user->setBanned(false);
        $user->setSigninConfirmed(false);
        $user->setDateRegistration($this->faker->dateTimeAd('now', 'Europe/Paris'));
        $user->setLanguage($this->faker->languageCode);
        $user->setCurrency($this->faker->currencyCode);
        // Création du token
        $user->setToken(bin2hex(random_bytes(64)));

        $user->setRoles(["ROLE_SUPPLIER","ROLE_MEMBER","ROLE_ALLOWED_TO_SWICTH"]);




    }



    /**
     * Permet de définir un ordre de chargement des fixtures ainsi les dépendances sont chargés avant
     * @return array
     */
    public function getDependencies()
    {
        return array(
            ImageSupplierFixtures::class,
        );
    }
}
