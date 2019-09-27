<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\ORM\Mapping as ORM;

/**
 *
 * @ApiResource(attributes={
 *     "normalization_context"={"shopping_card:output"},
 *     "denormalization_context"={{"shopping_card:input"}}
 * })
 * @ORM\Table(name="bjmkt_shopping_card_supplier_product")
 * @ORM\Entity(repositoryClass="App\Repository\ShoppingCardSupplierProductRepository")
 */
class ShoppingCardSupplierProduct
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="integer")
     */
    private $quantity;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\ShoppingCard", inversedBy="shoppingCardSupplierProducts", cascade={"persist"})
     * @ORM\JoinColumn(nullable=false)
     */
    private $shoppingCard;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\SupplierProduct", inversedBy="shoppingCardSupplierProducts", cascade={"persist"})
     * @ORM\JoinColumn(nullable=false)
     */
    private $supplierProduct;

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

    public function getShoppingCard(): ?ShoppingCard
    {
        return $this->shoppingCard;
    }

    public function setShoppingCard(?ShoppingCard $shoppingCard): self
    {
        $this->shoppingCard = $shoppingCard;

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
}
