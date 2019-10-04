<?php

namespace App\Repository;

use App\Entity\OrderSet;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method OrderSet|null find($id, $lockMode = null, $lockVersion = null)
 * @method OrderSet|null findOneBy(array $criteria, array $orderBy = null)
 * @method OrderSet[]    findAll()
 * @method OrderSet[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class OrderSetRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, OrderSet::class);
    }

    // /**
    //  * @return OrderSet[] Returns an array of OrderSet objects
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
    public function findOneBySomeField($value): ?OrderSet
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
