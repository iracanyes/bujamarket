<?php

namespace App\Repository;

use App\Entity\Supplier;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method Supplier|null find($id, $lockMode = null, $lockVersion = null)
 * @method Supplier|null findOneBy(array $criteria, array $orderBy = null)
 * @method Supplier[]    findAll()
 * @method Supplier[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SupplierRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Supplier::class);
    }

    public function getProfile(string $email)
    {
        return $this->createQueryBuilder('s')
            ->leftJoin('s.image','i')
            ->addSelect('i')
            ->leftJoin('s.addresses', 'a')
            ->addSelect('a')
            ->leftJoin('s.bankAccounts', 'ba')
            ->addSelect('ba')
            ->where('s.email LIKE :email')
            ->setParameter('email', $email)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function searchSuppliers(array $options = [])
    {
        $qb = $this->createQueryBuilder('s')
            ->select('s.id','s.brandName','s.socialReason', 's.contactPhoneNumber', 's.website')
            ->leftJoin('s.image', 'i')
            ->addSelect('i.url')
            ->groupBy('s.id');

        if($options['id'] !== null)
        {
            $qb->andWhere('s.id = :id')
                ->setParameter('id', $options['id']);
        }

        if($options['brandName'] !== null)
        {
            $qb->andWhere('s.brandName LIKE :brandName')
                ->setParameter('brandName', '%'.$options['brandName'].'%');
        }

        if($options['socialReason'] !== null)
        {
            $qb->andWhere('s.socialReason LIKE :socialReason')
                ->setParameter('socialReason', $options['socialReason']);
        }

        return $qb->getQuery()->getResult();
    }

    // /**
    //  * @return Supplier[] Returns an array of Supplier objects
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
    public function findOneBySomeField($value): ?Supplier
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
