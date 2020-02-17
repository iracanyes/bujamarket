<?php

namespace App\Repository;

use App\Entity\BillSupplier;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;
/**
 * @method BillSupplier|null find($id, $lockMode = null, $lockVersion = null)
 * @method BillSupplier|null findOneBy(array $criteria, array $orderBy = null)
 * @method BillSupplier[]    findAll()
 * @method BillSupplier[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class BillSupplierRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, BillSupplier::class);
    }

    // /**
    //  * @return BillSupplier[] Returns an array of BillSupplier objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('b')
            ->andWhere('b.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('b.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?BillSupplier
    {
        return $this->createQueryBuilder('b')
            ->andWhere('b.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
