<?php

namespace App\Repository;

use App\Entity\OrderSet;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method OrderSet|null find($id, $lockMode = null, $lockVersion = null)
 * @method OrderSet|null findOneBy(array $criteria, array $orderBy = null)
 * @method OrderSet[]    findAll()
 * @method OrderSet[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class OrderSetRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, OrderSet::class);
    }

    public function getCustomerOrders(string $email)
    {
        return $this->createQueryBuilder('os')
            ->leftJoin('os.customer', 'c')
            ->leftJoin('os.deliverySet', 'ds')
            ->leftJoin('os.billCustomer', 'bc')
            ->leftJoin('os.orderDetails', 'od')
            ->leftJoin('od.supplierProduct', 'sp')
            ->leftJoin('sp.product', 'p')
            ->leftJoin('sp.images', 'i')
            ->select('os', 'od', 'p', 'sp', 'i', 'ds', 'c', 'bc')
            ->andWhere('c.email LIKE :email')
            ->setParameter('email', $email)
            ->getQuery()
            ->getResult();
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
