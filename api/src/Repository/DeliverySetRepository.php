<?php

namespace App\Repository;

use App\Entity\DeliverySet;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method DeliverySet|null find($id, $lockMode = null, $lockVersion = null)
 * @method DeliverySet|null findOneBy(array $criteria, array $orderBy = null)
 * @method DeliverySet[]    findAll()
 * @method DeliverySet[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class DeliverySetRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, DeliverySet::class);
    }

    // /**
    //  * @return DeliverySet[] Returns an array of DeliverySet objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('d')
            ->andWhere('d.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('d.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?DeliverySet
    {
        return $this->createQueryBuilder('d')
            ->andWhere('d.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
