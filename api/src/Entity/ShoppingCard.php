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
     * @var \DateTime $dateCreated Date of creation of this shopping card
     * @ORM\Column(type="datetime")
     * @Assert\Type("DateTime")
     * @Groups({"shopping_card:output"})
     */
    private $dateCreated;



    /**
     * @var Customer $customer Customer who made this shopping card
     * @ORM\OneToOne(targetEntity="App\Entity\Customer", inversedBy="shoppingCard", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     */
    private $customer;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\ShoppingCardSupplierProduct", cascade={"persist"}, mappedBy="shoppingCard", orphanRemoval=true)
     */
    private $shoppingCardSupplierProducts;



    public function __construct()
    {
        $this->shoppingCardSupplierProducts = new ArrayCollection();
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

    public function setCustomer(Customer $customer): self
    {
        $this->customer = $customer;

        /* Ajouter dans l'objet Customer la relation à ce panier de commande */
        if($this !== $customer->getShoppingCard())
        {
            $customer->setShoppingCard($this);
        }

        return $this;
    }

    /**
     * @return Collection|ShoppingCardSupplierProduct[]
     */
    public function getShoppingCardSupplierProducts(): Collection
    {
        return $this->shoppingCardSupplierProducts;
    }

    public function addShoppingCardSupplierProduct(ShoppingCardSupplierProduct $shoppingCardSupplierProduct): self
    {
        if (!$this->shoppingCardSupplierProducts->contains($shoppingCardSupplierProduct)) {
            $this->shoppingCardSupplierProducts[] = $shoppingCardSupplierProduct;
            $shoppingCardSupplierProduct->setShoppingCard($this);
        }

        return $this;
    }

    public function removeShoppingCardSupplierProduct(ShoppingCardSupplierProduct $shoppingCardSupplierProduct): self
    {
        if ($this->shoppingCardSupplierProducts->contains($shoppingCardSupplierProduct)) {
            $this->shoppingCardSupplierProducts->removeElement($shoppingCardSupplierProduct);
            // set the owning side to null (unless already changed)
            if ($shoppingCardSupplierProduct->getShoppingCard() === $this) {
                $shoppingCardSupplierProduct->setShoppingCard(null);
            }
        }

        return $this;
    }


}
