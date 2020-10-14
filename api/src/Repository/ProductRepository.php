<?php

namespace App\Repository;

use ApiPlatform\Core\DataProvider\PaginatorInterface;
use App\Entity\Product;
use App\Exception\Product\SearchParameterNotFoundException;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method Product|null find($id, $lockMode = null, $lockVersion = null)
 * @method Product|null findOneBy(array $criteria, array $orderBy = null)
 * @method Product[]    findAll()
 * @method Product[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ProductRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Product::class);
    }

    public function getNames()
    {
        return $this->createQueryBuilder('p')
            ->leftJoin('p.productSuppliers', 'sp')
            ->leftJoin('sp.images', 'i')
            ->addSelect('p', "sp", "i")
            ->orderBy('p.title', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function getProductsWithImages($options = [])
    {
         $qb = $this->createQueryBuilder('p')
            ->select('p.id','p.title','p.resume','p.minimumPrice')
            ->leftJoin('p.productSuppliers', 'sp')
            ->leftJoin('p.category', 'c')
            ->addSelect(array('c.name as category_name'))
            ->leftJoin('sp.images', 'i')
            ->addSelect(array('i.title as image_title','i.alt','i.url'))
            ->groupBy('p.id');

         /* Recherche dans le titre, le résumé ou la description du produit */
         if($options['title'] !== null)
             $qb->andWhere("p.title LIKE :title OR p.resume LIKE :title OR p.description LIKE :title")
                 ->setParameter("title", "%".$options['title']."%");

         if($options['resume'] !== null)
             $qb->andWhere("p.resume LIKE :resume")
                 ->setParameter("resume", $options['resume']);


         if($options['category'] !== null)
         {
             $qb->andWhere('c.id LIKE :category')
                 ->setParameter('category',$options['category']);
         }

        if($options['id'] !== null)
        {
            $qb->andWhere('p.id = :id')
                ->setParameter('id', $options['id']);
        }

         if($options['itemsPerPage'] !== null)
         {
             $qb->setMaxResults($options["itemsPerPage"]);
         }



         return $qb->getQuery()
             ->getResult();
    }

    public function getProductWithImage($options = [])
    {
        $qb = $this->createQueryBuilder('p')
            ->select('p.id','p.title','p.resume','p.description','p.minimumPrice')
            ->leftJoin('p.productSuppliers', 'sp')
            ->leftJoin('p.category', 'c')
            ->addSelect(array('c.name as category_name'))
            ->leftJoin('sp.images', 'i')
            ->addSelect(array('i.title as image_title','i.alt','i.url'));

        if($options['id'] !== null)
        {
            $qb->andWhere('p.id = :product_id')
                ->setParameter('product_id', $options['id']);
        }


        if($options['category'] !== null)
        {
            $qb->andWhere('c.id LIKE :category')
                ->setParameter('category',$options['category']);
        }


        return $qb->groupBy('p.id')
            ->getQuery()
            ->getResult();
    }



    public function searchProducts($options = [])
    {
        if($options['title'] == null)
            throw new SearchParameterNotFoundException("Missing parameter 'title' for searching products!");

        $qb = $this->createQueryBuilder('p')
            ->select("p.title, p.resume, p.description, p.minimumPrice")
            ->leftJoin('p.productSuppliers', 'sp')
            ->leftJoin('p.category', 'c')
            ->addSelect(array('c.name as category_name'))
            ->leftJoin('sp.images', 'i')
            ->addSelect(array('i.title as image_title','i.alt','i.url'))
            ->addSelect("MATCH_AGAINST (p.title, p.resume, p.description) AGAINST (:searchterm ) AS score")
            ->where("MATCH_AGAINST(p.title, p.resume, p.description) AGAINST (:searchterm ) > 0")
            ->setParameter("searchterm", $options['title'])
            ->groupBy("p.id")
            ->orderBy("score", "DESC");


        return $qb->getQuery()
            ->getResult();

    }

    // /**
    //  * @return Product[] Returns an array of Product objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('p.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Product
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
