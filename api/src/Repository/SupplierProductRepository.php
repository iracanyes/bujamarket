<?php

namespace App\Repository;

use App\Entity\SupplierProduct;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method SupplierProduct|null find($id, $lockMode = null, $lockVersion = null)
 * @method SupplierProduct|null findOneBy(array $criteria, array $orderBy = null)
 * @method SupplierProduct[]    findAll()
 * @method SupplierProduct[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SupplierProductRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, SupplierProduct::class);
    }

    public function myFind(int $id)
    {
        return $this->createQueryBuilder('sp')
            ->leftJoin('sp.product', 'p')
            ->addSelect('p')
            ->leftJoin('sp.images', 'i')
            ->addSelect('i')
            ->leftJoin('sp.supplier', 's')
            ->addSelect('s')
            ->andWhere('sp.id = :id')
            ->setParameter('id', $id)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function getMyProducts(int $id)
    {
        return $this->createQueryBuilder('sp')
            ->leftJoin('sp.product', 'p')
            ->addSelect('p')
            ->leftJoin('sp.images', 'i','sp.id = i.supplier_product_id')
            ->addSelect('i')
            ->leftJoin('sp.comments', 'c','sp = c.supplierProduct')
            ->addSelect('c')
            ->leftJoin('sp.favorites','f','sp = f.supplierProduct')
            ->addSelect('f')
            ->leftJoin('sp.orderDetails', 'od','sp = od.supplierProduct')
            ->addSelect('od')
            ->leftJoin('sp.supplier', 's')
            ->addSelect('s')
            ->groupBy('sp.id')
            ->andWhere('s.id = :id')
            ->setParameter('id', $id)
            ->getQuery()
            ->getResult();
    }

    public function getOneSupplierProduct(int $id, string $email)
    {
        return $this->createQueryBuilder('sp')
            ->leftJoin('sp.product', 'p')
            ->addSelect('p')
            ->leftJoin('sp.images', 'i','sp.id = i.supplier_product_id')
            ->addSelect('i')
            ->leftJoin('sp.comments', 'c','sp = c.supplierProduct')
            ->addSelect('c')
            ->leftJoin('sp.favorites','f','sp = f.supplierProduct')
            ->addSelect('f')
            ->leftJoin('sp.orderDetails', 'od','sp = od.supplierProduct')
            ->addSelect('od')
            ->leftJoin('sp.supplier', 's')
            ->addSelect('s')
            ->groupBy('sp.id')
            ->andWhere('s.email = :email')
            ->andWhere('sp.id = :id')
            ->setParameter('email', $email)
            ->setParameter('id', $id)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function getProductSuppliersByProductId(int $id)
    {
        $qb = $this->createQueryBuilder('sp')
            ->select('sp')
            ->leftJoin('sp.product', 'p')
            ->addSelect('p')
            ->leftJoin('sp.supplier', 's')
            ->addSelect('s' )
            ->leftJoin('sp.images', 'i')
            ->addSelect('i');

        if($id !== null){
            $qb->andWhere('p.id = :id')
                ->setParameter('id', $id);

        }

        return $qb->groupBy('sp.id')
            ->getQuery()
            ->getResult();

    }

    public function getSupplierProductWithProductInfo(int $id)
    {
        return $this->createQueryBuilder('sp')
            ->select('sp')
            ->leftJoin('sp.product', 'p')
            ->addSelect('p')
            ->andWhere('sp.id = :id')
            ->setParameter('id', $id)
            ->getQuery()
            ->getOneOrNullResult();

    }

    // /**
    //  * @return SupplierProduct[] Returns an array of SupplierProduct objects
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
    public function findOneBySomeField($value): ?SupplierProduct
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
