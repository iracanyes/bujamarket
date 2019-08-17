<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ApiResource(attributes={
 *     "normalization_context"={"shopping_card:output"},
 *     "denormalization_context"={{"shopping_card:input"}}
 * })
 * @ORM\Table(name="bjmkt_shopping_card")
 * @ORM\Entity(repositoryClass="App\Repository\ShoppingCardRepository")
 * @ORM\HasLifecycleCallbacks()
 */
class ShoppingCard
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;
    /**
     * @ORM\Column(type="datetime")
     * @Assert\DateTime()
     * @Groups({"shopping_card:output"})
     */
    private $dateCreated;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Customer", inversedBy="shoppingCards")
     * @ORM\JoinColumn(nullable=false)
     * @Assert\Type("App\Entity\Customer")
     */
    private $customer;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\SupplierProduct", inversedBy="shoppingCards")
     * @ApiSubresource()
     * @Groups({"shopping_card:output"})
     *
     */
    private $suppliersProducts;



    public function __construct()
    {
        $this->suppliersProducts = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDateCreated(): ?\DateTimeInterface
    {
        return $this->dateCreated;
    }

    /**
     * @ORM\PrePersist()
     */
    public function setDateCreated(): self
    {
        $this->dateCreated = new \DateTime();

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

    /**
     * @return Collection|SupplierProduct[]
     */
    public function getSuppliersProducts(): Collection
    {
        return $this->suppliersProducts;
    }

    public function addSuppliersProduct(SupplierProduct $suppliersProduct): self
    {
        if (!$this->suppliersProducts->contains($suppliersProduct)) {
            $this->suppliersProducts[] = $suppliersProduct;
        }

        return $this;
    }

    public function removeSuppliersProduct(SupplierProduct $suppliersProduct): self
    {
        if ($this->suppliersProducts->contains($suppliersProduct)) {
            $this->suppliersProducts->removeElement($suppliersProduct);
        }

        return $this;
    }


}
