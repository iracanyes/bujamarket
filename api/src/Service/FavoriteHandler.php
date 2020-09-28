<?php


namespace App\Service;

use App\Entity\Customer;
use App\Entity\Favorite;
use App\Entity\SupplierProduct;
use App\Exception\Favorite\DeleteOperationException;
use App\Exception\Favorite\FavoriteNotFoundException;
use App\Exception\Favorite\FavoritesNotFoundException;
use App\Exception\SupplierProduct\SupplierProductNotFoundException;
use App\Exception\User\MemberNotFoundException;
use Doctrine\DBAL\Driver\PDOException;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Exception\UserNotFoundException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpFoundation\RequestStack;

class FavoriteHandler
{
    const SECURITY_EMAIL_PROPERTY = "email";

    private $security;

    private $request;

    private $em;

    private $imageHandler;

    public function __construct(RequestStack $requestStack, Security $security, EntityManagerInterface $entityManager, ImageHandler $imageHandler)
    {
        $this->security = $security;

        $this->request = $requestStack->getCurrentRequest();

        $this->em = $entityManager;

        $this->imageHandler = $imageHandler;
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



        } catch (PDOException $exception){
            throw new UserNotFoundException(self::SECURITY_EMAIL_PROPERTY, $this->security->getUser()->getUsername());
        }

        return new JsonResponse(['favorites' => $ids], 200);

    }

    public function create()
    {
        $supplierProductId = json_decode($this->request->getContent());
        dump($this->request->getContent());
        dump(json_decode($this->request->getContent()));

        try{
            $customer = $this->em->getRepository(Customer::class)
                ->findOneBy([self::SECURITY_EMAIL_PROPERTY => $this->security->getUser()->getUsername()]);
        }catch(PDOException $exception){
            throw new UserNotFoundException(self::SECURITY_EMAIL_PROPERTY , $this->security->getUser()->getUsername());
        }

        try{
            $supplierProduct = $this->em->getRepository(SupplierProduct::class)
                ->find($supplierProductId);
        }catch (PDOException $exception){
            throw new SupplierProductNotFoundException(sprintf("The supplier's product ID %s not found!", $supplierProductId));
        }

        $favorite = new Favorite();

        $favorite->setCustomer($customer);
        $favorite->setSupplierProduct($supplierProduct);

        try{
            $this->em->persist($favorite);
            $this->em->flush();
        }catch(PDOException $exception){
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
        }catch (PDOException $exception){
            throw new UserNotFoundException(self::SECURITY_EMAIL_PROPERTY, $this->security->getUser()->getUsername());
        }


        try{
            $favorite = $this->em->getRepository(Favorite::class)
                ->findOneBy(['id' => $id, 'customer' => $customer ]);
        }catch (PDOException $exception){
            throw new FavoriteNotFoundException(sprintf("Favorite ID %d not found", $id),404);
        }

        dump($favorite);

        try{
            $this->em->remove($favorite);
            $this->em->flush();
        }catch (\Exception $exception){
            throw new DeleteOperationException(sprintf('Error during the deletion process of the supplier product %d', $favorite->getSupplierProduct()->getId()));
        }

        return new JsonResponse(['id'=> $id, 'message' => 'OK'], 200);

    }

    public function getMyFavorites()
    {
        try{
            $customer = $this->em->getRepository(Customer::class)
                ->findOneBy(["email" => $this->security->getUser()->getUsername()]);

        }catch (\PDOException $exception){
            throw new MemberNotFoundException($exception->getMessage());
        }

        try {
            $favorites = $this->em->getRepository(Favorite::class)
                ->findBy(["customer" => $customer]);
        }catch(\PDOException $exception)
        {
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
