<?php

namespace App\Repository;

use App\Entity\OrderGlobal;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method OrderGlobal|null find($id, $lockMode = null, $lockVersion = null)
 * @method OrderGlobal|null findOneBy(array $criteria, array $orderBy = null)
 * @method OrderGlobal[]    findAll()
 * @method OrderGlobal[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class OrderGlobalRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, OrderGlobal::class);
    }

    // /**
    //  * @return OrderGlobal[] Returns an array of OrderGlobal objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('o')
            ->andWhere('o.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('o.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?OrderGlobal
    {
        return $this->createQueryBuilder('o')
            ->andWhere('o.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
