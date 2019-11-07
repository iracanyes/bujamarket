<?php


namespace App\Service;

use App\Entity\Customer;
use App\Entity\Favorite;
use App\Entity\SupplierProduct;
use App\Exception\Favorite\DeleteOperationException;
use App\Exception\Favorite\FavoriteNotFoundException;
use App\Exception\SupplierProduct\SupplierProductNotFoundException;
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

    public function __construct(RequestStack $requestStack, Security $security, EntityManagerInterface $entityManager)
    {
        $this->security = $security;

        $this->request = $requestStack->getCurrentRequest();

        $this->em = $entityManager;
    }

    public function getIds()
    {
        try{
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
        dump($id);


        try{
            $customer = $this->em->getRepository(Customer::class)
                ->findOneBy([self::SECURITY_EMAIL_PROPERTY => $this->security->getUser()->getUsername()]);
        }catch (PDOException $exception){
            throw new UserNotFoundException(self::SECURITY_EMAIL_PROPERTY, $this->security->getUser()->getUsername());
        }

        dump($id);
        dump($customer->getId());

        try{
            $favorite = $this->em->getRepository(Favorite::class)
                ->findOneBy(['supplierProduct' => $id, 'customer' => $customer->getId() ]);
        }catch (PDOException $exception){
            throw new FavoriteNotFoundException(sprintf("Favorite ID %d not found", $id),404);
        }

        try{
            $this->em->remove($favorite);
            $this->em->flush();
        }catch (PDOException $exception){
            throw new DeleteOperationException(sprintf('Error during the deletion process of the supplier product %d', $favorite->getSupplierProduct()->getId()));
        }

        return new JsonResponse(['id'=> $id, 'message' => 'OK'], 200);



    }


}
