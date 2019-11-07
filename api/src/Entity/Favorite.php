<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

/**
 * @ApiResource(attributes={
 *      "normalization_context"={"groups"={"favorite:output"}},
 *      "denormalization_context"={"groups"={"favorite:input"}}
 * })
 * @ORM\Table(name="bjmkt_favorite")
 * @ORM\Entity(repositoryClass="App\Repository\FavoriteRepository")
 * @ UniqueEntity(fields={"supplierProduct","customer"})
 */
class Favorite
{
    /**
     * @var integer $id ID of this favorite
     *
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"favorite:output"})
     */
    private $id;

    /**
     * @var SupplierProduct $supplierProduct Supplier product added to the favorite
     *
     * @ORM\ManyToOne(targetEntity="App\Entity\SupplierProduct", inversedBy="favorites")
     * @ORM\JoinColumn(nullable=false)
     * @Assert\NotNull()
     * @Assert\Type("App\Entity\SupplierProduct")
     * @Groups({"favorite:output"})
     *
     */
    private $supplierProduct;

    /**
     * @var Customer $customer Favorite added by this customer
     *
     * @ORM\ManyToOne(targetEntity="App\Entity\Customer", inversedBy="favorites")
     * @ORM\JoinColumn(nullable=false)
     * @Assert\Type("App\Entity\Customer")
     * @Assert\NotNull()
     */
    private $customer;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSupplierProduct(): ?SupplierProduct
    {
        return $this->supplierProduct;
    }

    public function setSupplierProduct(?SupplierProduct $supplierProduct): self
    {
        $this->supplierProduct = $supplierProduct;

        return $this;
    }

    public function getCustomer(): ?Customer
    {
        return $this->customer;
    }

    public function setCustomer(?Customer $customer): self
    {
        $this->customer = $customer;

        return $this;
    }
}
