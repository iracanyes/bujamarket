<?php

namespace App\Repository;

use App\Entity\Shipper;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method Shipper|null find($id, $lockMode = null, $lockVersion = null)
 * @method Shipper|null findOneBy(array $criteria, array $orderBy = null)
 * @method Shipper[]    findAll()
 * @method Shipper[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ShipperRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Shipper::class);
    }

    // /**
    //  * @return Shipper[] Returns an array of Shipper objects
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
    public function findOneBySomeField($value): ?Shipper
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
