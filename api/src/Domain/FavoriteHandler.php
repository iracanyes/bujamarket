<?php


namespace App\Domain;

use App\Entity\Customer;
use App\Entity\Favorite;
use App\Entity\SupplierProduct;
use App\Exception\Favorite\DeleteOperationException;
use App\Exception\Favorite\FavoriteNotFoundException;
use App\Exception\Favorite\FavoritesNotFoundException;
use App\Exception\SupplierProduct\SupplierProductNotFoundException;
use App\Exception\User\MemberNotFoundException;
use App\Responder\JsonResponder;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Exception\UserNotFoundException;
use Psr\Log\LoggerInterface;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpFoundation\RequestStack;

class FavoriteHandler
{
    const SECURITY_EMAIL_PROPERTY = "email";

    private $security;

    private $request;

    private $em;

    private $logger;

    private $imageHandler;

    private $jsonResponder;

    public function __construct(RequestStack $requestStack, Security $security, EntityManagerInterface $entityManager, ImageHandler $imageHandler, JsonResponder $jsonResponder, LoggerInterface $logger)
    {
        $this->security = $security;
        $this->request = $requestStack->getCurrentRequest();
        $this->em = $entityManager;
        $this->imageHandler = $imageHandler;
        $this->jsonResponder = $jsonResponder;
        $this->logger = $logger;
    }

    public function getIds()
    {
        try{
            // If an authenticated user exists, get the ids of supplier's product liked by this user the favorite
            if($this->security->getUser() !== null)
            {
                $ids = $this->em->getRepository(Favorite::class)
                    ->findIdsByCustomerEmail($this->security->getUser()->getUsername());
            }else{
                throw new UserNotFoundException(self::SECURITY_EMAIL_PROPERTY, "??");
            }



        } catch (\Exception $exception){
            $this->logger->error($exception->getMessage(), ['context' => $exception]);
            throw new UserNotFoundException(self::SECURITY_EMAIL_PROPERTY, $this->security->getUser()->getUsername());
        }

        return $this->jsonResponder->success(['favorites' => $ids]);

    }

    public function create()
    {
        $supplierProductId = json_decode($this->request->getContent());

        try{
            $customer = $this->em->getRepository(Customer::class)
                ->findOneBy([self::SECURITY_EMAIL_PROPERTY => $this->security->getUser()->getUsername()]);
        }catch(\Exception $exception){
            $this->logger->error($exception->getMessage(), ['context' => $exception]);
            throw new UserNotFoundException(self::SECURITY_EMAIL_PROPERTY , $this->security->getUser()->getUsername());
        }

        try{
            $supplierProduct = $this->em->getRepository(SupplierProduct::class)
                ->find($supplierProductId);
        }catch (\Exception $exception){
            $this->logger->error($exception->getMessage(), ['context' => $exception]);
            throw new SupplierProductNotFoundException(sprintf("The supplier's product ID %s not found!", $supplierProductId));
        }

        $favorite = new Favorite();

        $favorite->setCustomer($customer);
        $favorite->setSupplierProduct($supplierProduct);

        try{
            $this->em->persist($favorite);
            $this->em->flush();
        }catch(\Exception $exception){
            $this->logger->error($exception->getMessage(), ['context' => $exception]);
            throw new \Exception(sprintf("Error during the persisting process of the favorite!"));
        }

        return $favorite;
    }

    public function deleteFavorite()
    {
        $id =( int ) $this->request->attributes->get('id');

        try{
            $customer = $this->em->getRepository(Customer::class)
                ->findOneBy([self::SECURITY_EMAIL_PROPERTY => $this->security->getUser()->getUsername()]);

            if(!$customer instanceof Customer){
                throw new UserNotFoundException(self::SECURITY_EMAIL_PROPERTY, $this->security->getUser()->getUsername());
            }
        }catch (\Exception $exception){
            $this->logger->error($exception->getMessage(), ['context' => $exception]);
            return $this->jsonResponder->error([
                '@context' => '/context/Favorite',
                '@id' => '/favorite/'.$id,
                'hydra:description' => sprintf("Customer  not found", $id)
            ],403);
        }


        try{

            $favorite = $this->em->getRepository(Favorite::class)
                ->getFavorite( $id, $customer->getId() );

            if(!$favorite instanceof Favorite){
                throw new FavoriteNotFoundException(sprintf("Favorite ID %d not found", $id),404);
            }
        }catch (\Exception $exception){
            $this->logger->error($exception->getMessage(), ['context' => $exception]);
            return $this->jsonResponder->error([
                '@context' => '/context/Favorite',
                '@id' => '/favorite/'.$id,
                'hydra:description' => sprintf("Favorite ID %d not found", $id)
            ]);
        }


        try{
            $this->em->remove($favorite);
            $this->em->flush();
        }catch (\Exception $exception){
            $this->logger->error($exception->getMessage(), ['context' => $exception]);
            return $this->jsonResponder->error([
                '@context' => '/context/Favorite',
                '@id' => '/favorite/'.$id,
                'hydra:description' => sprintf('Error during the deletion process of the supplier product %d', $id)
            ]);
        }

        return $this->jsonResponder->success(['id'=> $id, 'message' => 'OK']);

    }

    public function getMyFavorites()
    {
        try{
            $customer = $this->em->getRepository(Customer::class)
                ->findOneBy(["email" => $this->security->getUser()->getUsername()]);

            if(!$customer instanceof Customer){
                throw new MemberNotFoundException('User not found!');
            }

        }catch (\Exception $exception){
            $this->logger->error($exception->getMessage(), ['context' => $exception]);
            return $this->jsonResponder->error([
                '@context' => '/context/Favorite',
                '@id' => '/favorites',
                'hydra:description' => 'Customer not found!'
            ]);
        }

        try {
            $favorites = $this->em->getRepository(Favorite::class)
                ->findBy(["customer" => $customer]);
        }catch(\Exception $exception)
        {
            $this->logger->error($exception->getMessage(), ['context' => $exception]);
            throw new FavoritesNotFoundException($exception->getMessage());
        }

        // Mise à jour de url public des images
        foreach($favorites as $favorite){
            foreach($favorite->getSupplierProduct()->getImages() as $image){
                $this->imageHandler->setSupplierProductPublicDirectory($image);
            }
        }

        return $favorites;
    }


}
