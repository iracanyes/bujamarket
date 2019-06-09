<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use http\Cookie;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ApiResource()
 * @ORM\Entity(repositoryClass="App\Repository\SupplierProductRepository")
 */
class SupplierProduct
{
    /**
     * @var integer $id ID of this supplier product
     *
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @var float $initialPrice Initial price of this supplier product
     *
     * @ORM\Column(type="float")
     * @Assert\Range(
     *     min=0.0,
     *     minMessage="The minimum value is {{ limit }}.\nThe current value is {{ value }}."
     * )
     */
    private $initialPrice;

    /**
     * @var integer $quantity Quantity available of this supplier product.
     *
     * @ORM\Column(type="integer", nullable=true)
     * @Assert\Range(
     *     min=0,
     *     minMessage="The minimum value is {{ limit }}.\nThe current value is {{ value }}."
     * )
     */
    private $quantity;

    /**
     * @var float $additionalFee Additional fee for this supplier product
     *
     * @ORM\Column(type="float")
     * @Assert\Range(
     *     min=0,
     *     minMessage="The minimum value is {{ limit }}.\nThe current value is {{ value }}."
     * )
     */
    private $additionalFee;

    /**
     * @var string $additionalInformation Additional information for this supplier product
     *
     * @ORM\Column(type="text", nullable=true)
     */
    private $additionalInformation;

    /**
     * @var boolean $isAvailable Is this supplier product available
     *
     * @ORM\Column(type="boolean")
     * @Assert\Type("boolean")
     */
    private $isAvailable;

    /**
     * @var boolean $isLimited Is this supplier product limited
     *
     * @ORM\Column(type="boolean")
     * @Assert\Type("boolean")
     */
    private $isLimited;

    /**
     * @var Supplier $supplier Supplier who sell this supplier product
     *
     * @ORM\ManyToOne(targetEntity="App\Entity\Supplier", inversedBy="supplierProducts")
     * @ORM\JoinColumn(nullable=false)
     * @Assert\Type("App\Entity\Supplier")
     * @Assert\NotNull()
     */
    private $supplier;

    /**
     * @var Product $product Product made available by the supplier
     * @ORM\ManyToOne(targetEntity="App\Entity\Product", inversedBy="productSuppliers")
     * @ORM\JoinColumn(nullable=false)
     * @Assert\Type("App\Entity\Product")
     * @Assert\NotNull()
     */
    private $product;

    /**
     * @var Collection $comments Comments made on this supplier product
     *
     * @ORM\OneToMany(targetEntity="App\Entity\Comment", mappedBy="supplierProduct", orphanRemoval=true)
     */
    private $comments;

    /**
     * @var Collection $favorites Customers who loved this supplier product
     *
     * @ORM\OneToMany(targetEntity="App\Entity\Favorite", mappedBy="supplierProduct", orphanRemoval=true)
     */
    private $favorites;

    /**
     * @var Collection $orderDetails Order details made for this supplier product
     *
     * @ORM\OneToMany(targetEntity="App\Entity\OrderDetail", mappedBy="supplierProduct", orphanRemoval=true)
     */
    private $orderDetails;

    public function __construct()
    {
        $this->initialPrice = 0;
        $this->comments = new ArrayCollection();
        $this->favorites = new ArrayCollection();
        $this->orderDetails = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getInitialPrice(): ?float
    {
        return $this->initialPrice;
    }

    public function setInitialPrice(float $initialPrice): self
    {
        $this->initialPrice = $initialPrice;

        return $this;
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

    public function getAdditionalFee(): ?float
    {
        return $this->additionalFee;
    }

    public function setAdditionalFee(float $additionalFee): self
    {
        $this->additionalFee = $additionalFee;

        return $this;
    }

    public function getAdditionalInformation(): ?string
    {
        return $this->additionalInformation;
    }

    public function setAdditionalInformation(?string $additionalInformation): self
    {
        $this->additionalInformation = $additionalInformation;

        return $this;
    }

    public function getIsAvailable(): ?bool
    {
        return $this->isAvailable;
    }

    public function setIsAvailable(bool $isAvailable): self
    {
        $this->isAvailable = $isAvailable;

        return $this;
    }

    public function getIsLimited(): ?bool
    {
        return $this->isLimited;
    }

    public function setIsLimited(bool $isLimited): self
    {
        $this->isLimited = $isLimited;

        return $this;
    }

    public function getSupplier(): ?Supplier
    {
        return $this->supplier;
    }

    public function setSupplier(?Supplier $supplier): self
    {
        $this->supplier = $supplier;

        return $this;
    }

    public function getProduct(): ?Product
    {
        return $this->product;
    }

    public function setProduct(?Product $product): self
    {
        $this->product = $product;

        return $this;
    }

    /**
     * @return Collection|Comment[]
     */
    public function getComments(): Collection
    {
        return $this->comments;
    }

    public function addComment(Comment $comment): self
    {
        if (!$this->comments->contains($comment)) {
            $this->comments[] = $comment;
            $comment->setSupplierProduct($this);
        }

        return $this;
    }

    public function removeComment(Comment $comment): self
    {
        if ($this->comments->contains($comment)) {
            $this->comments->removeElement($comment);
            // set the owning side to null (unless already changed)
            if ($comment->getSupplierProduct() === $this) {
                $comment->setSupplierProduct(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Favorite[]
     */
    public function getFavorites(): Collection
    {
        return $this->favorites;
    }

    public function addFavorite(Favorite $favorite): self
    {
        if (!$this->favorites->contains($favorite)) {
            $this->favorites[] = $favorite;
            $favorite->setSupplierProduct($this);
        }

        return $this;
    }

    public function removeFavorite(Favorite $favorite): self
    {
        if ($this->favorites->contains($favorite)) {
            $this->favorites->removeElement($favorite);
            // set the owning side to null (unless already changed)
            if ($favorite->getSupplierProduct() === $this) {
                $favorite->setSupplierProduct(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|OrderDetail[]
     */
    public function getOrderDetails(): Collection
    {
        return $this->orderDetails;
    }

    public function addOrderDetail(OrderDetail $orderDetail): self
    {
        if (!$this->orderDetails->contains($orderDetail)) {
            $this->orderDetails[] = $orderDetail;
            $orderDetail->setSupplierProduct($this);
        }

        return $this;
    }

    public function removeOrderDetail(OrderDetail $orderDetail): self
    {
        if ($this->orderDetails->contains($orderDetail)) {
            $this->orderDetails->removeElement($orderDetail);
            // set the owning side to null (unless already changed)
            if ($orderDetail->getSupplierProduct() === $this) {
                $orderDetail->setSupplierProduct(null);
            }
        }

        return $this;
    }
}
