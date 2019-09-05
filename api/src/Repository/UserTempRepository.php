<?php

namespace App\Repository;

use App\Entity\UserTemp;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method UserTemp|null find($id, $lockMode = null, $lockVersion = null)
 * @method UserTemp|null findOneBy(array $criteria, array $orderBy = null)
 * @method UserTemp[]    findAll()
 * @method UserTemp[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserTempRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, UserTemp::class);
    }

    // /**
    //  * @return UserTemp[] Returns an array of UserTemp objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('u.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?UserTemp
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
