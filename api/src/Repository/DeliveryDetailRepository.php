<?php

namespace App\Repository;

use App\Entity\DeliveryDetail;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method DeliveryDetail|null find($id, $lockMode = null, $lockVersion = null)
 * @method DeliveryDetail|null findOneBy(array $criteria, array $orderBy = null)
 * @method DeliveryDetail[]    findAll()
 * @method DeliveryDetail[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class DeliveryDetailRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, DeliveryDetail::class);
    }

    // /**
    //  * @return DeliveryDetail[] Returns an array of DeliveryDetail objects
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
    public function findOneBySomeField($value): ?DeliveryDetail
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
