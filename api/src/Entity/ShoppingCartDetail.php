<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use App\Repository\ShoppingCartDetailRepository;

/**
 *
 * @ApiResource(attributes={
 *     "normalization_context"={"shopping_cart_detail:output"},
 *     "denormalization_context"={{"shopping_cart_detail:input"}}
 * })
 * @ORM\Table(name="bjmkt_shopping_cart_detail")
 * @ORM\Entity(repositoryClass="App\Repository\ShoppingCartDetailRepository")
 */
class ShoppingCartDetail
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"shopping_cart_detail:output"})
     * @Assert\Type("integer")
     */
    private $quantity;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Customer", inversedBy="shoppingCartDetails", cascade={"persist"})
     * @ORM\JoinColumn(nullable=false)
     * @Assert\Type("App\Entity\Customer")
     */
    private $customer;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\SupplierProduct", inversedBy="shoppingCartDetails", cascade={"persist"})
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"shopping_cart_detail:output"})
     * @Assert\Type("App\Entity\SupplierProduct")
     */
    private $supplierProduct;

    /**
     * @ORM\Column(type="datetime")
     */
    private $dateCreated;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getQuantity(): ?int
    {
        return $this->quantity;
    }

    public function setQuantity(int $quantity): self
    {
        $this->quantity = $quantity;

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

    public function getSupplierProduct(): ?SupplierProduct
    {
        return $this->supplierProduct;
    }

    public function setSupplierProduct(?SupplierProduct $supplierProduct): self
    {
        $this->supplierProduct = $supplierProduct;

        return $this;
    }

    public function getDateCreated(): ?\DateTimeInterface
    {
        return $this->dateCreated;
    }

    public function setDateCreated(\DateTimeInterface $dateCreated): self
    {
        $this->dateCreated = $dateCreated;

        return $this;
    }
}
