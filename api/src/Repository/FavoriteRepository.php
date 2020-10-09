<?php

namespace App\Repository;

use App\Entity\Favorite;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method Favorite|null find($id, $lockMode = null, $lockVersion = null)
 * @method Favorite|null findOneBy(array $criteria, array $orderBy = null)
 * @method Favorite[]    findAll()
 * @method Favorite[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class FavoriteRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Favorite::class);
    }

    public function findIdsByCustomerEmail($email)
    {
        return $this->createQueryBuilder('f')
            ->leftJoin('f.customer', 'c')
            ->andWhere('c.email=:email')
            ->setParameter('email', $email)
            ->leftJoin('f.supplierProduct', 'sp')
            ->select('sp.id')
            ->getQuery()
            ->execute();
    }

    public function getFavorite(int $idSupplierProduct,int $idCustomer)
    {
        return $this->createQueryBuilder('f')
            ->leftJoin('f.customer', 'cu')
            ->leftJoin('f.supplierProduct', 'sp')
            ->addSelect('cu', "sp")
            ->andWhere('cu.id = :id')
            ->setParameter('id' , $idCustomer)
            ->andWhere('sp.id = :idSP')
            ->setParameter('idSP' , $idSupplierProduct)
            ->getQuery()
            ->getOneOrNullResult();
    }
    // /**
    //  * @return Favorite[] Returns an array of Favorite objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('f')
            ->andWhere('f.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('f.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Favorite
    {
        return $this->createQueryBuilder('f')
            ->andWhere('f.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
