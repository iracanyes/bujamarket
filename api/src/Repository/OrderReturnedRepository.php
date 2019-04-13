<?php

namespace App\Repository;

use App\Entity\OrderReturned;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method OrderReturned|null find($id, $lockMode = null, $lockVersion = null)
 * @method OrderReturned|null findOneBy(array $criteria, array $orderBy = null)
 * @method OrderReturned[]    findAll()
 * @method OrderReturned[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class OrderReturnedRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, OrderReturned::class);
    }

    // /**
    //  * @return OrderReturned[] Returns an array of OrderReturned objects
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
    public function findOneBySomeField($value): ?OrderReturned
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
