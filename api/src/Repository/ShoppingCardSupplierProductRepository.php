<?php

namespace App\Repository;

use App\Entity\ShoppingCardSupplierProduct;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method ShoppingCardSupplierProduct|null find($id, $lockMode = null, $lockVersion = null)
 * @method ShoppingCardSupplierProduct|null findOneBy(array $criteria, array $orderBy = null)
 * @method ShoppingCardSupplierProduct[]    findAll()
 * @method ShoppingCardSupplierProduct[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ShoppingCardSupplierProductRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ShoppingCardSupplierProduct::class);
    }

    // /**
    //  * @return ShoppingCardSupplierProduct[] Returns an array of ShoppingCardSupplierProduct objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('s.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?ShoppingCardSupplierProduct
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
