<?php

namespace App\Repository;

use App\Entity\BillCustomer;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method BillCustomer|null find($id, $lockMode = null, $lockVersion = null)
 * @method BillCustomer|null findOneBy(array $criteria, array $orderBy = null)
 * @method BillCustomer[]    findAll()
 * @method BillCustomer[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class BillCustomerRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, BillCustomer::class);
    }

    public function findOneByUrlAndCustomer($value)
    {
        return $this->createQueryBuilder('bc')
            ->leftJoin('bc.customer', 'c')
            ->andWhere('bc.url = :url')
            ->setParameter('url', $value['url'])
            ->andWhere('c.email = :email')
            ->setParameter('email', $value['email'])
            ->getQuery()
            ->execute();

    }

    // /**
    //  * @return BillCustomer[] Returns an array of BillCustomer objects
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
    public function findOneBySomeField($value): ?BillCustomer
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
