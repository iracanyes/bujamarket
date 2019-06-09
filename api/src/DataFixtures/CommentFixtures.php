<?php

namespace App\DataFixtures;

use App\Entity\Comment;
use \Faker\Factory;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;

class CommentFixtures extends Fixture implements DependentFixtureInterface
{
    /**
     * @var \Faker\Factory
     */
    private $faker;

    public const COMMENT_REFERENCE = 'comment';

    public function __construct()
    {
        $this->faker = Factory::create('fr_FR');

    }

    public function load(ObjectManager $manager)
    {
        $comment = new Comment();

        /*  */
        $comment->setRating($this->faker->numberBetween(1,10));
        $comment->setContent($this->faker->text(40));
        $comment->setDateCreated($this->faker->dateTimeBetween('-2 years', 'now'));

        /* Relations */
        $comment->setCustomer($this->getReference(CustomerFixtures::CUSTOMER_REFERENCE));
        $comment->setSupplierProduct($this->getReference(SupplierProductFixtures::SUPPLIER_PRODUCT_REFERENCE));

        $manager->persist($comment);

        $manager->flush();

        $this->addReference(self::COMMENT_REFERENCE, $comment);
    }

    public function getDependencies()
    {
        return array(
            CustomerFixtures::class,
            SupplierProductFixtures::class,
        );
    }
}
