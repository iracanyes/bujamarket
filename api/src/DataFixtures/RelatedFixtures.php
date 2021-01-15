<?php

namespace App\DataFixtures;

use App\Entity\Address;
use App\Entity\Admin;
use App\Entity\BankAccount;
use App\Entity\Bill;
use App\Entity\BillCustomer;
use App\Entity\BillRefund;
use App\Entity\Category;
use App\Entity\Comment;
use App\Entity\Customer;
use App\Entity\DeliveryDetail;
use App\Entity\DeliverySet;
use App\Entity\Favorite;
use App\Entity\Forum;
use App\Entity\Image;
use App\Entity\Message;
use App\Entity\OrderDetail;
use App\Entity\OrderReturned;
use App\Entity\OrderSet;
use App\Entity\Payment;
use App\Entity\Product;
use App\Entity\Shipper;
use App\Entity\Supplier;
use App\Entity\SupplierProduct;
use App\Entity\User;
use App\Entity\Withdrawal;
use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\ORM\EntityManagerInterface;
use \Faker\Factory;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class RelatedFixtures extends Fixture implements FixtureGroupInterface, DependentFixtureInterface
{

    private $faker;
    private $em;
    private $encoder;
    private $categories;
    private $products;
    private $supplierProducts;
    private $supplierTestProducts;
    private $admins;
    private $suppliers;
    private $customers;
    private $orderSets;
    private $customerTestOrderSets;
    private $shippers;


    public function __construct(EntityManagerInterface $em, UserPasswordEncoderInterface $encoder)
    {
        $this->faker = Factory::create('fr_BE');
        $this->em = $em;
        $this->encoder = $encoder;
    }


    public function load(ObjectManager $manager)
    {
        // Création des admins
        for($i=0; $i< 5; $i++){
            $this->admins[] = $this->createAdmin();
        }
        print("      >  5 admins added!\n");
        //Création des catégories
        for($i=0;$i < 12; $i++){
            $this->categories[] = $this->createCategory();
        }
        print("      >  12 categories added!\n");
        //Création des fournisseurs
        for($i=0;$i < 20; $i++){
            $this->suppliers[] = $this->createSupplier();
        }
        print("      >  20 Suppliers added!\n");

        // Create 12 product by category
        for ($i = 0; $i < count($this->categories); $i++) {
            for($j=0; $j < 12; $j++){
                $this->products[] = $this->createProduct($this->categories[$i]);
            }
        }
        print ("      >  12 Products by category added!\n");

        // Création des 12 offres de fournisseur par produits
        for ($i = 0; $i < count($this->products); $i++) {
            for($j=0; $j < 12; $j++){
                $this->supplierProducts[] = $this->createSupplierProduct($this->products);
            }
        }
        print ("      >  12 Supplier_product by product added!\n");
        // Création des transporteurs
        for ($i = 0; $i < 6; $i++) {
            $this->shippers[] = $this->createShipper();
        }
        print ("      >  6 Shippers added!\n");

        // Création des commandes
        for ($i = 0; $i < 20; $i++) {
            $orderSet = $this->createOrderSet();
            $this->orderSets[] = $orderSet;

            // Payment de la commande
            $this->createPayment($orderSet);

            // Livraison de la commande
            $this->createDeliverySet($orderSet);

            // Commentaires sur les commandes et ajout aux favoris
            for ($j = 0; $j < count($orderSet->getOrderDetails()); $j++) {
                $this->createComment($orderSet->getCustomer(), $orderSet->getOrderDetails()[$j]);


                if ($j === 1) {
                    $this->createFavorite($orderSet->getCustomer(), $orderSet->getOrderDetails()[$j]->getSupplierProduct());
                }

                // Création d'un remboursement pour retour de produits ou annulation
                if ($i % 5 === 0) {
                    $this->createPayment($orderSet, $orderSet->getOrderDetails()[$j]);
                }



            }

            //Création de discussion chat Customer - Admin
            if($i % 4 === 0){
                $this->createForum($orderSet);
            }
        }
        print ("      >  20 Order set added!\n");

        /* Utilisateurs test */
        // Supplier test products
        // Création des 12 offres de fournisseur par produits
        for ($i = 0; $i < count($this->products); $i++) {
            $this->supplierTestProducts[] = $this->createSupplierProduct($this->products, $this->getReference(SupplierGroupTestFixtures::SUPPLIER_GROUP_TEST_REFERENCE));

            print("        > supplier's product added for product of supplier-test!\n");
        }
        print ("      >  %d * 12 Supplier_product by product added for supplier-test!\n");

        // Création des commandes de l'utilisateur test
        for ($i = 0; $i < 20; $i++) {
            $orderSet = $this->createOrderSet($this->getReference(CustomerGroupTestFixtures::CUSTOMER_GROUP_TEST_REFERENCE));
            $this->customerTestOrderSets[] = $orderSet;

            // Payment de la commande
            $this->createPayment($orderSet);

            // Livraison de la commande
            $this->createDeliverySet($orderSet);

            // Commentaires sur les commandes et ajout aux favoris
            for ($j = 0; $j < count($orderSet->getOrderDetails()); $j++) {
                $this->createComment($orderSet->getCustomer(), $orderSet->getOrderDetails()[$j]);


                if ($j === 1) {
                    $this->createFavorite($orderSet->getCustomer(), $orderSet->getOrderDetails()[$j]->getSupplierProduct());
                }

                // Création d'un remboursement pour retour de produits ou annulation
                if ($i % 5 === 0) {
                    $this->createPayment($orderSet, $orderSet->getOrderDetails()[$j]);
                }



            }

            //Création de discussion chat Customer - Admin
            if($i % 4 === 0){
                $this->createForum($orderSet);
            }
        }
        print ("      >  20 Order set added for customer-test!\n");

    }

    public function createProduct(Category $category)
    {
        $product = new Product();

        $product->setTitle($this->faker->sentence(10, true));
        $product->setResume($this->faker->realText(60));
        $product->setDescription($this->faker->realText(200));
        $product->setHeight($this->faker->randomFloat(20, 2000));
        $product->setWeight($this->faker->randomFloat(20, 2000));
        $product->setWidth($this->faker->randomFloat(20, 2000));
        $product->setLength($this->faker->randomFloat(20, 2000));
        $product->setCountryOrigin($this->faker->randomElement(['BU', 'RW', 'CD', 'TZA']));

        /* Relations */
        $product->setCategory($category);


        $this->em->persist($product);
        $this->em->flush();


        return $product;
    }

    public function createCategory(): Category
    {
        $category = new Category();

        $category->setName($this->faker->sentence(2, false));
        $category->setDescription($this->faker->text(100));
        $category->setDateCreated($this->faker->dateTimeBetween('-3 years', 'now'));
        $category->setIsValid($this->faker->randomElement([0,1]));
        $category->setPlatformFee($this->faker->randomFloat(2,0.05,0.45));

        // Relation
        $category->setImage($this->createImage());


        $this->em->persist($category);
        $this->em->flush();

        return $category;
    }

    public function createImage()
    {
        $image = new Image();

        $image->setPlace($this->faker->numberBetween(1, 10));
        $image->setTitle($this->faker->sentence(7, true));
        $image->setAlt($this->faker->sentence(7, true));
        $image->setUrl($this->faker->randomElement([
            'Buja_Market_20201504235045.jpg',
            'art-1851483_1920.jpg',
            'biim_5ed0747e84f730.52908222.jpeg',
            'bobby-car-349695_1920.jpg',
            'bucket-1005891_1920.jpg',
            'Buja_Market_20201504235045.jpg',
            'bujamarket_5f83a153295a69.69392434.jpeg',
            'bujamarket_5f83a153304861.50865348.jpeg',
            'bujamarket_5f83b2911a3c63.83199139.jpeg',
            'bujamarket_5f83b2911c0cc7.12929082.jpeg',
            'bujamarket_5f83bc5c1a8e22.34191701.jpeg',
            'bujamarket_5f83d98f93f136.18269222.jpeg',
            'bujamarket_5f84ea7864f4b6.71491861.jpeg',
            'bujamarket_5f84ea7869bab5.86691463.jpeg',
            'bujamarket_5f84ed04bb4829.43469198.jpeg',
            'bujamarket_5f84f7eccd3c99.12217835.jpeg',
            'car-63930_1920.jpg',
            'computer-1245714_1920.jpg',
            'fruit-1534494_1920.jpg',
            'fruit-4025710_1920.jpg',
            'grapes-690230_1920.jpg',
            'laptop-1483974_1920.jpg',
            'mac-459196_1920.jpg',
            'mango-164572_1280.jpg',
            'meat-1030729_1920.jpg',
            'potato-3440360_1920.jpg',
            'strawberries-1330459_1920.jpg',
            'sugar-cane-276242_1920.jpg',
            'teddy-bear-3599680_1920.jpg'
        ]));
        $image->setSize($this->faker->randomNumber(6, false));
        $image->setMimeType($this->faker->randomElement(['image/jpeg', 'image/png', 'image/jpg']));


        $this->em->persist($image);
        $this->em->flush();

        return $image;
    }

    public function createSupplierProduct($products, $supplier = null)
    {
        $supplierProduct = new SupplierProduct();

        $supplierProduct->setInitialPrice($this->faker->randomFloat(4, 10, 2000));
        $supplierProduct->setAdditionalFee($this->faker->randomFloat(2, 0, 0.35));
        $supplierProduct->setAdditionalInformation($this->faker->realText(50));
        $supplierProduct->setIsAvailable($this->faker->boolean(80));
        $supplierProduct->setIsLimited($this->faker->boolean(20));
        $supplierProduct->setRating($this->faker->randomFloat(2, 0, 10));

        if ($supplierProduct->getIsLimited() == true) {
            $supplierProduct->setQuantity($this->faker->numberBetween(10, 1000));
        }

        /* Relations */
        $supplierProduct->setProduct($this->faker->randomElement($products));
        $supplierProduct->setSupplier($supplier === null ? $this->faker->randomElement($this->suppliers) : $supplier);

        for ($j = 0; $j < 3; $j++) {
            $supplierProduct->addImage($this->createImageSupplierProduct());
        }

        $this->em->persist($supplierProduct);
        $this->em->flush();

        return $supplierProduct;
    }

    public function createImageSupplierProduct(): Image
    {
        $image = new Image();

        $image->setPlace($this->faker->numberBetween(1,10));
        $image->setTitle($this->faker->sentence(7, true));
        $image->setAlt($this->faker->sentence(7, true));
        $image->setUrl($this->faker->randomElement([
            'Buja_Market_20201504235045.jpg',
            'art-1851483_1920.jpg',
            'biim_5ed0747e84f730.52908222.jpeg',
            'bobby-car-349695_1920.jpg',
            'bucket-1005891_1920.jpg',
            'Buja_Market_20201504235045.jpg',
            'bujamarket_5f83a153295a69.69392434.jpeg',
            'bujamarket_5f83a153304861.50865348.jpeg',
            'bujamarket_5f83b2911a3c63.83199139.jpeg',
            'bujamarket_5f83b2911c0cc7.12929082.jpeg',
            'bujamarket_5f83bc5c1a8e22.34191701.jpeg',
            'bujamarket_5f83d98f93f136.18269222.jpeg',
            'bujamarket_5f84ea7864f4b6.71491861.jpeg',
            'bujamarket_5f84ea7869bab5.86691463.jpeg',
            'bujamarket_5f84ed04bb4829.43469198.jpeg',
            'bujamarket_5f84f7eccd3c99.12217835.jpeg',
            'car-63930_1920.jpg',
            'computer-1245714_1920.jpg',
            'fruit-1534494_1920.jpg',
            'fruit-4025710_1920.jpg',
            'grapes-690230_1920.jpg',
            'laptop-1483974_1920.jpg',
            'mac-459196_1920.jpg',
            'mango-164572_1280.jpg',
            'meat-1030729_1920.jpg',
            'potato-3440360_1920.jpg',
            'strawberries-1330459_1920.jpg',
            'sugar-cane-276242_1920.jpg',
            'teddy-bear-3599680_1920.jpg'
        ]));
        $image->setSize($this->faker->randomNumber(6, false));
        $image->setMimeType($this->faker->randomElement(['image/jpeg','image/png','image/jpg']));


        $this->em->persist($image);
        $this->em->flush();

        return $image;
    }

    public function createSupplier(): Supplier
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
        $supplier->setImage($this->createImageSupplier());
        $supplier->addAddress($this->createAddress());
        $supplier->addBankAccount($this->createBankAccount());


        $this->em->persist($supplier);
        $this->em->flush();

        return $supplier;
    }

    public function createOrderDetail($orderSet)
    {
        $orderDetail = new OrderDetail();

        $orderDetail->setStatus($this->faker->randomElement(['pending', 'in progress', 'shipped', 'finalized', 'blocked']));
        $orderDetail->setQuantity($this->faker->numberBetween(1, 20));
        $orderDetail->setUnitCost($this->faker->numberBetween(2, 5000));
        $orderDetail->setTotalCost();

        /* Relations */
        $orderDetail->setSupplierProduct($this->faker->randomElement($this->supplierProducts));
        //$orderDetail->setOrderSet($orderSet);

        //$this->em->persist($orderDetail);
        //$this->em->flush();

        return $orderDetail;
    }

    public function createOrderSet($customer = null)
    {
        $orderSet = new OrderSet();

        $orderSet->setSessionId('cs_test_' . $this->faker->sha1);
        $orderSet->setTotalWeight($this->faker->randomFloat(2, 1));
        $orderSet->setDateCreated($this->faker->dateTimeBetween('-2 years', 'now'));

        for ($i = 0; $i < 2; $i++) {
            $orderSet->addOrderDetail($this->createOrderDetail($orderSet));
        }


        $totalCost = 0;
        $taille = count($orderSet->getOrderDetails());
        $cpt = 0;

        while ($cpt < $taille) {
            $totalCost += $orderSet->getOrderDetails()[$cpt]->getTotalCost();
            $cpt++;
        }

        $orderSet->setNbPackage($taille);
        $orderSet->setTotalCost($totalCost);

        /* Relations */
        $customer = $customer === null ? $this->createCustomer() : $customer;

        $orderSet->setCustomer($customer);
        $orderSet->setAddress($customer->getAddresses()[0]);


        // Ajout à la liste des clients
        $this->customers[] = $customer;

        $this->em->persist($orderSet);

        $this->em->flush();

        return $orderSet;
    }

    public function createCustomer()
    {
        $customer = new Customer();

        /* User data */
        $this->setUserCustomerInfo($customer);
        $customer->setUserType('customer');

        /* Customer data  */
        $customer->setCustomerKey($this->faker->unique()->sha1);
        $customer->setNbAbuseIdentified(0);
        $customer->setAverageRating($this->faker->randomFloat(1, 0, 10));
        $customer->setNbOrderCompleted(count($customer->getOrderSets()));
        $customer->setNbOrderWithdrawn(0);

        $this->em->persist($customer);
        $this->em->flush();

        return $customer;


    }

    public function setUserCustomerInfo(User $user)
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

        $user->setRoles(["ROLE_CUSTOMER", "ROLE_MEMBER", "ROLE_ALLOWED_TO_SWICTH"]);
        /* Relations */

        $user->setImage($this->createImageUser());
        $user->addAddress($this->createAddress());
        $user->addBankAccount($this->createBankAccount());

    }

    public function createBankAccount(): BankAccount
    {
        $bankAccount = new BankAccount();

        $bankAccount->setIdCard($this->faker->unique()->iban());
        $bankAccount->setOwnerFullname($this->faker->name());
        $bankAccount->setBrand($this->faker->creditCardType);
        $bankAccount->setCountryCode($this->faker->countryCode);
        $bankAccount->setLast4($this->faker->randomNumber(4, true));
        $bankAccount->setExpiryMonth($this->faker->numberBetween(1,12));
        $bankAccount->setExpiryYear($this->faker->numberBetween(19,99));
        $bankAccount->setFingerprint($this->faker->unique()->swiftBicNumber);
        $bankAccount->setFunding($this->faker->randomElement(["debit","credit"]));
        $bankAccount->setAccountBalance(0);

        /* Relations */


        $this->em->persist($bankAccount);
        //$this->em->flush();

        return $bankAccount;
    }

    public function createImageUser()
    {
        $image = new Image();

        $image->setPlace(1);
        $image->setTitle($this->faker->sentence(7, true));
        $image->setAlt($this->faker->sentence(7, true));
        $image->setUrl($this->faker->randomElement([
            'emotions-371238_1920.jpg',
            'hijab-3064633_1920.jpg',
            'lonely-814631_1920.jpg',
            'people-2605526_1920.jpg',
            'qsdfsdf-5ee1a8694d13a.jpg',
            'Skavar-5f6d8c405722d.jpeg',
            'Skoll-5f7d425f1b035.jpeg',
            'Skull-5ef4440403024.jpeg',
            'Skully-5f3c431b16c8f.jpeg',
            'Skully-5f7f9f2318a8b.jpeg',
            'sunset-570881_1920.jpg',
            'woman-586185_1920.jpg'
        ]));
        $image->setSize($this->faker->numberBetween(3000, 8000));
        $image->setMimeType($this->faker->randomElement(['image/jpeg', 'image/png', 'image/jpg']));

        $this->em->persist($image);

        $this->em->flush();

        return $image;
    }

    public function createImageSupplier()
    {
        $image = new Image();

        $image->setPlace(1);
        $image->setTitle($this->faker->sentence(7, true));
        $image->setAlt($this->faker->sentence(7, true));
        $image->setUrl($this->faker->randomElement([
            'arazezr-5f34f68bd0d4d.jpeg',
            'baby-1399332_1920.jpg',
            'Buja-Market-5ef435b532f92.jpeg',
            'Buja-Market-5f6cd5d29b689.jpeg',
            'Buja-Market-5f7fa16274223.jpeg',
            'Buja-Market-5f3615c181493.jpeg',
            'Buja-Market-5f3861560894a.jpeg',
            'Delta-S-P-R-L-5ef0753edcecb.jpg',
            'entrepreneur-593358_1920.jpg',
            'kid-849363_1920.jpg',
            'men-2425121_1920.jpg',
            'senior-3336451_1920.jpg',
            'suit-673697_1920.jpg',
            'tie-690084_1920.jpg'
        ]));
        $image->setSize($this->faker->numberBetween(3000, 8000));
        $image->setMimeType($this->faker->randomElement(['image/jpeg', 'image/png', 'image/jpg']));

        $this->em->persist($image);

        $this->em->flush();

        return $image;
    }

    public function createAddress(): Address
    {
        $address = new Address();

        $address->setLocationName("siége social");
        $address->setStreet($this->faker->streetName);
        $address->setNumber($this->faker->buildingNumber);
        $address->setState($this->faker->city);
        $address->setTown($this->faker->city);
        $address->setZipCode($this->faker->postcode);
        $address->setCountry($this->faker->country);

        /* Relation */


        $this->em->persist($address);
        $this->em->flush();

        return $address;
    }

    public function createComment(Customer $customer, OrderDetail $orderDetail): void
    {
        $comment = new Comment();

        /*  */
        $comment->setRating($this->faker->numberBetween(1, 10));
        $comment->setContent($this->faker->text(40));
        $comment->setDateCreated($this->faker->dateTimeBetween('-2 years', 'now'));

        /* Relations */
        $comment->setCustomer($customer);
        $comment->setSupplierProduct($orderDetail->getSupplierProduct());
        $comment->setOrderDetail($orderDetail);

        $this->em->persist($comment);

        $this->em->flush();
    }

    public function createFavorite(Customer $customer, SupplierProduct $supplierProduct): void
    {
        $favorite = new Favorite();

        /* Relations */
        $favorite->setSupplierProduct($supplierProduct);
        $favorite->setCustomer($customer);

        $this->em->persist($favorite);

        $this->em->flush();
    }

    public function createBillCustomer(OrderSet $orderSet)
    {
        $billCustomer = new BillCustomer();

        /* General info */
        $this->setBillInfo($billCustomer);

        /* Customer information */
        $billCustomer->setAdditionalCost($this->faker->randomFloat(2, 0, 10000));
        $billCustomer->setAdditionalFee($this->faker->randomFloat(2, 0, 1));
        $billCustomer->setAdditionalInformation($this->faker->text(50));
        $billCustomer->setTotalShippingCost($this->faker->numberBetween(0, 20000));
        $billCustomer->setTotalExclTax($this->faker->numberBetween(0, 50000));
        $billCustomer->setTotalInclTax($this->faker->randomFloat(2, 10, 20000));

        /* Relations */
        $billCustomer->setCustomer($orderSet->getCustomer());
        $billCustomer->setOrderSet($orderSet);


        $this->em->persist($billCustomer);
        //$this->em->flush();

        return $billCustomer;
    }

    public function setBillInfo(Bill $bill): void
    {
        $bill->setStatus($this->faker->randomElement(["paid", "pending", "failed", "withdrawn"]));
        $bill->setDateCreated($this->faker->dateTimeBetween('-2 years', 'now'));
        $bill->setDatePayment($this->faker->dateTimeBetween('-2 years', 'now'));
        $bill->setCurrencyUsed($this->faker->randomElement(["USD", "EUR", "BIF"]));
        $bill->setVatRateUsed($this->faker->randomElement([0.18, 0.21]));
        $bill->setReference($this->faker->unique()->creditCardNumber());
        //$bill->setTotalExclTax($this->faker->numberBetween(0, 50000));
        //$bill->setTotalInclTax(($bill->getTotalExclTax() * ($bill->getAdditionalFee() + $bill->getVatRateUsed() )) + $bill->getTotalShippingCost() + $bill->getAdditionalCost());
        $bill->setUrl($this->faker->url);

    }

    public function createPayment(OrderSet $orderSet = null, OrderDetail $orderDetail = null)
    {
        $payment = new Payment();

        /* Outrepasser la limite de mémoire -1 = pas de limite  */
        ini_set('memory_limit', '-1');
        $payment->setSessionId('cs_test_' . $this->faker->sha1);
        $payment->setPaymentIntent('pi_' . $this->faker->sha1);
        $payment->setReference('bjmktp_' . $this->faker->sha1);
        $payment->setDateCreated($this->faker->dateTimeBetween('-2 years', 'now'));
        $payment->setCurrency($this->faker->randomElement(['BIF', 'EUR', 'USD']));
        $payment->setDescription($this->faker->realText(50));
        $payment->setStatus($this->faker->randomElement(['pending', 'confirmed', 'failed', 'refused', 'processing']));
        $payment->setAmount($this->faker->randomFloat(2, 10, 20000));

        $payment->setBalanceTransaction($this->faker->md5);
        $payment->setEmailReceipt($this->faker->safeEmail);
        $payment->setSource($this->faker->randomElement(['debit', 'credit']));


        /* Relations */
        if ($orderSet !== null && $orderDetail === null) {
            $payment->setBill($this->createBillCustomer($orderSet));
        }


        if ($orderSet !== null  && $orderDetail !== null) {
            $payment->setBill($this->createBillRefund($orderSet, $orderDetail));
        }


        $this->em->persist($payment);

        $this->em->flush();
    }

    public function createDeliverySet(OrderSet $orderSet): void
    {
        $deliverySet = new DeliverySet();

        /* Informations */
        $deliverySet->setShippingCost($this->faker->numberBetween(0, 10000));
        $deliverySet->setDateCreated($this->faker->dateTimeBetween('-2 years', 'now'));
        $deliverySet->setAllShipped($this->faker->boolean(80));
        $deliverySet->setAllReceived($this->faker->boolean(40));


        /* Relations */
        $deliverySet->setShipper($this->faker->randomElement($this->shippers));
        $deliverySet->setOrderSet($orderSet);

        foreach ($orderSet->getOrderDetails() as $orderDetail) {
            $deliverySet->addDeliveryDetail($this->createDeliveryDetail($orderDetail));
        }

        $this->em->persist($deliverySet);

        $this->em->flush();
    }

    public function createDeliveryDetail(OrderDetail $orderDetail): DeliveryDetail
    {
        $deliveryDetail = new DeliveryDetail();

        /* informations  */
        $deliveryDetail->setReference($this->faker->bothify("????######"));
        $deliveryDetail->setDescription($this->faker->text(50));
        $deliveryDetail->setDateCreated($this->faker->dateTimeBetween('-2 years', 'now'));
        $deliveryDetail->setAttachmentFile($this->faker->url());
        $deliveryDetail->setIsShipped($this->faker->boolean(80));

        if ($this->faker->boolean(80)) {
            $deliveryDetail->setIsReceived($this->faker->boolean(60));
        } else {
            $deliveryDetail->setIsReceived(false);
        }

        /* relations */
        $deliveryDetail->setOrderDetail($orderDetail);


        $this->em->persist($deliveryDetail);

        //$this->em->flush();

        return $deliveryDetail;
    }

    public function createShipper(): Shipper
    {
        $shipper = new Shipper();

        $shipper->setName($this->faker->company());
        $shipper->setDescription($this->faker->realText(100));
        $shipper->setSocialReason($this->faker->company . " " . $this->faker->companySuffix);
        $shipper->setTradeRegisterNumber($this->faker->isbn10);
        $shipper->setVatNumber($this->faker->isbn13);
        $shipper->setService('Import/Export');
        $shipper->setDeliveryCommitment($this->faker->realText(100));
        $shipper->setContactNumber($this->faker->phoneNumber);


        /* Relations */
        $shipper->setAddress($this->createAddress());


        $this->em->persist($shipper);
        $this->em->flush();

        return $shipper;
    }

    public function createWithdrawal(OrderDetail $orderDetail): Withdrawal
    {
        $withdrawal = new Withdrawal();

        $withdrawal->setStatus($this->faker->randomElement(['pending', 'processing', 'confirmed', 'refused', 'failed']));
        $withdrawal->setDateCreated($this->faker->dateTimeBetween('-2 years', 'now'));
        $withdrawal->setIsValid($this->faker->boolean(50));

        if ($withdrawal->getIsValid() == false) {
            $withdrawal->setOrderDelivered($this->faker->boolean(70));

        } else {
            $withdrawal->setOrderDelivered($this->faker->boolean(0));
        }

        /* Relations */
        $withdrawal->setOrderDetail($orderDetail);

        $this->em->persist($withdrawal);

        //$this->em->flush();

        return $withdrawal;
    }

    public function createOrderReturned(OrderDetail $orderDetail): OrderReturned
    {
        $orderReturned = new OrderReturned();

        $orderReturned->setDescription($this->faker->realText(100));
        $orderReturned->setReason($this->faker->randomElement(['defective', 'unwanted', 'broken', 'unsatisfied']));
        $orderReturned->setIsIntact($this->faker->boolean(60));
        $orderReturned->setFileUrl($this->faker->url());


        /* Relations */
        $orderReturned->setOrderDetail($orderDetail);


        $this->em->persist($orderReturned);

        //$this->em->flush();

        return $orderReturned;
    }

    public function createBillRefund(OrderSet $orderSet, OrderDetail $orderDetail): BillRefund
    {
        $billRefund = new BillRefund();

        /* General info */
        $this->setBillInfo($billRefund);

        /* Refund information */
        $billRefund->setReason($this->faker->randomElement(['Withdrawal', 'Order returned']));
        $billRefund->setDescription($this->faker->text(100));
        $billRefund->setAdditionalFee($this->faker->randomFloat(0, 1));
        $billRefund->setAdditionalCost($this->faker->numberBetween(0, 10000));
        $billRefund->setAdditionalInformation($this->faker->text(50));

        $billRefund->setTotalInclTax((($billRefund->getTotalExclTax() - $billRefund->getAdditionalCost()) * (1 + $billRefund->getVatRateUsed() + $billRefund->getAdditionalFee())));

        /* Relations */
        $billRefund->setCustomer($orderDetail->getOrderSet()->getCustomer());
        $billRefund->setValidator($this->faker->randomElement($this->admins));

        if ($billRefund->getReason() == 'Withdrawal') {
            $billRefund->setOrderReturned($this->createOrderReturned($orderDetail));
        } else {
            $billRefund->setWithdrawal($this->createWithdrawal($orderDetail));
        }


        $billRefund->setCustomer($orderSet->getCustomer());
        $billRefund->setValidator($this->faker->randomElement($this->admins));


        $this->em->persist($billRefund);
        $this->em->flush();

        return $billRefund;
    }

    public function createAdmin(): Admin
    {
        $admin = new Admin();

        /* User data */
        $this->setUserInfo($admin);
        $admin->setUserType('admin');

        /* Admin data  */
        $admin->setAdminKey($this->faker->unique()->sha1());
        $admin->setNbRefundValidated(count($admin->getBillRefunds()));
        $admin->setNbIssueResolved(0);


        $this->em->persist($admin);
        $this->em->flush();

        return $admin;
    }

    public function setUserInfo(User $user)
    {
        $user->setEmail($this->faker->unique()->email);

        $password = $this->encoder->encodePassword($user, getenv('FIXTURE_ADMIN_PASSWORD'));
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
        $user->setRoles(["ROLE_ADMIN","ROLE_SUPPLIER","ROLE_CUSTOMER","ROLE_MEMBER","ROLE_ALLOWED_TO_SWICTH"]);

        /* Relations */

        $user->setImage($this->createImageUser());

    }

    public function createForum(OrderSet $orderSet): void
    {
        $forum = new Forum();

        /* Informations */
        $forum->setTitle($this->faker->sentence(7, true));
        $forum->setStatus($this->faker->randomElement(['open','pending','resolved']));
        $forum->setType($this->faker->randomElement(['information', 'dispute','abuse']));
        $forum->setIsClosed($this->faker->boolean(30));
        $forum->setDateCreated($this->faker->dateTimeBetween('-2 years', 'now'));

        for($i=0;$i < 3; $i++){
            $forum->addMessage($this->createMessage($orderSet->getCustomer()));
            $forum->addMessage($this->createMessage($orderSet->getOrderDetails()[0]->getSupplierProduct()->getSupplier()));
        }


        /* Relation */
        $forum->setAuthor($orderSet->getCustomer());
        $forum->setResponder($orderSet->getOrderDetails()[0]->getSupplierProduct()->getSupplier());

        $this->em->persist($forum);

        $this->em->flush();
    }

    public function createMessage(User $user): Message
    {
        $message = new Message();

        $message->setContent($this->faker->realText(50));
        $message->setDateCreated($this->faker->dateTimeBetween('-2 years', 'now'));
        $message->setAttachmentFile($this->faker->url());
        $message->setAttachmentUrl($this->faker->url());

        if($this->faker->boolean(20))
        {
            $message->setAttachmentImage($this->faker->imageUrl(640,480));
        }


        /* Relation */
        $message->setUser($user);


        $this->em->persist($message);

        return $message;
    }

    public function getDependencies()
    {
        return [
            SupplierGroupTestFixtures::class,
            CustomerGroupTestFixtures::class,
        ];
    }

    public static function getGroups(): array
    {
        return ["related"];
    }

}
