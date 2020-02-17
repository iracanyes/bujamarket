<?php

namespace App\Repository;

use App\Entity\BillRefund;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;
/**
 * @method BillRefund|null find($id, $lockMode = null, $lockVersion = null)
 * @method BillRefund|null findOneBy(array $criteria, array $orderBy = null)
 * @method BillRefund[]    findAll()
 * @method BillRefund[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class BillRefundRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, BillRefund::class);
    }

    // /**
    //  * @return BillRefund[] Returns an array of BillRefund objects
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
    public function findOneBySomeField($value): ?BillRefund
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
