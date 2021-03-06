<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Annotation\MaxDepth;

/**
 * @ApiResource(attributes={
 *     "normalization_context"={"groups"={"supplier_product:output","supplier_product_owner:output"}},
 *     "denormalization_context"={"groups"={"supplier_product:input"}}
 * })
 * @ORM\Table(name="bjmkt_supplier_product")
 * @ORM\Entity(repositoryClass="App\Repository\SupplierProductRepository")
 * @ORM\HasLifecycleCallbacks()
 */
class SupplierProduct
{
    /**
     * @var integer $id ID of this supplier product
     *
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"favorite:output","supplier_product:output","supplier_product_owner:output","order_set:output"})
     *
     */
    private $id;

    /**
     * @var float $initialPrice Initial price of this supplier product
     *
     * @ORM\Column(type="float")
     * @Assert\Range(
     *     min=0.0,
     *     notInRangeMessage="The minimum value is {{ limit }}.\nThe current value is {{ value }}."
     * )
     * @Groups({"favorite:output","supplier_product:output","supplier_product_owner:output"})
     */
    private $initialPrice;

    /**
     * @var integer $quantity Quantity available of this supplier product.
     *
     * @ORM\Column(type="integer", nullable=true)
     * @Assert\Range(
     *     min=0,
     *     notInRangeMessage="The minimum value is {{ limit }}.\nThe current value is {{ value }}."
     * )
     * @Groups({"favorite:output","supplier_product:output","supplier_product_owner:output"})
     */
    private $quantity;

    /**
     * @var float $additionalFee Additional fee for this supplier product
     *
     * @ORM\Column(type="float")
     * @Assert\Range(
     *     min=0,
     *     notInRangeMessage="The minimum value is {{ limit }}.\nThe current value is {{ value }}."
     * )
     * @Groups({"favorite:output","supplier_product:output","supplier_product_owner:output"})
     */
    private $additionalFee;

    /**
     * @var string $additionalInformation Additional information for this supplier product
     *
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"favorite:output","supplier_product:output","supplier_product_owner:output"})
     */
    private $additionalInformation;

    /**
     * @var boolean $isAvailable Is this supplier product available
     *
     * @ORM\Column(type="boolean")
     * @Assert\Type("boolean")
     * @Groups({"favorite:output","supplier_product:output","supplier_product_owner:output"})
     */
    private $isAvailable;

    /**
     * @var boolean $isLimited Is this supplier product limited
     *
     * @ORM\Column(type="boolean")
     * @Assert\Type("boolean")
     * @Groups({"favorite:output","supplier_product:output","supplier_product_owner:output"})
     */
    private $isLimited;

    /**
     * @var Supplier $supplier Supplier who sell this supplier product
     *
     * @ORM\ManyToOne(targetEntity="App\Entity\Supplier", inversedBy="supplierProducts")
     * @ORM\JoinColumn(nullable=false)
     * @Assert\Type("App\Entity\Supplier")
     * @Assert\NotNull()
     * @Groups({"supplier_product:output"})
     * @ ApiSubresource()
     */
    private $supplier;


    /**
     * @var Product $product Product made available by the supplier
     * @ORM\ManyToOne(targetEntity="App\Entity\Product", inversedBy="productSuppliers", cascade={"persist"})
     * @ORM\JoinColumn(nullable=false)
     * @Assert\Type("App\Entity\Product")
     * @Assert\NotNull()
     * @Groups({"favorite:output","supplier_product:output","order_set:output","supplier_product_owner:output"})
     *
     */
    private $product;

    /**
     * @var Collection $images Images of the product
     * @ORM\OneToMany(targetEntity="App\Entity\Image", mappedBy="supplierProduct", cascade={"persist","remove"})
     * @ApiSubresource()
     * @Groups({"supplier_product:output","favorite:output","order_set:output","supplier_product_owner:output","product_name:output"})
     * @MaxDepth(1)
     */
    private $images;

    /**
     * @var Collection $comments Comments made on this supplier product
     *
     * @ORM\OneToMany(targetEntity="App\Entity\Comment", mappedBy="supplierProduct", orphanRemoval=true)
     * @ApiSubresource()
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



    /**
     * @var float $rating Rating of this product
     * @ORM\Column(type="float")
     * @Assert\Type("float")
     * @Assert\Range(
     *      min = 0,
     *      max = 10,
     *      notInRangeMessage = "The rating's limit is {{ limit }}. Current value {{ value }}!"
     * )
     * @Groups({"supplier_product:output","supplier_product_owner:output"})
     */
    private $rating;

    /**
     * @ORM\OneToMany(targetEntity="ShoppingCartDetail", mappedBy="supplierProduct", orphanRemoval=true)
     */
    private $shoppingCartDetails;

    /**
     * @ORM\Column(type="float")
     * @Groups({"supplier_product:output","order_set:output","favorite:output","supplier_product_owner:output"})
     */
    private $finalPrice;

    /**
     * @var int
     * @Groups({"supplier_product:output","supplier_product_owner:output"})
     */
    private $nbComments;

    /**
     * @var int
     * @Groups({"supplier_product:output","supplier_product_owner:output"})
     */
    private $nbLikes;

    /**
     * @var int
     * @Groups({"supplier_product_owner:output"})
     */
    private $nbOrders;

    public function __construct()
    {
        $this->initialPrice = 0;
        $this->rating = 5;
        $this->nbComments = 0;
        $this->nbLikes = 0;
        $this->nbOrders = 0;
        $this->images = new ArrayCollection();
        $this->comments = new ArrayCollection();
        $this->favorites = new ArrayCollection();
        $this->orderDetails = new ArrayCollection();
        $this->shoppingCartDetails = new ArrayCollection();
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
     * @return Collection|Image[]
     */
    public function getImages(): Collection
    {
        return $this->images;
    }

    public function addImage(Image $image): self
    {
        if (!$this->images->contains($image)) {
            $this->images[] = $image;
            $image->setSupplierProduct($this);
        }

        return $this;
    }

    public function removeImage(Image $image): self
    {
        if ($this->images->contains($image)) {
            $this->images->removeElement($image);
            // set the owning side to null (unless already changed)
            if ($image->getSupplierProduct() === $this) {
                $image->setSupplierProduct(null);
            }
        }

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


    /**
     * Update the minimum price for the product
     */
    public function updateMinimumPrice(): void
    {
        $this->getProduct()->setMinimumPrice($this->getFinalPrice());
    }

    public function getRating(): ?float
    {
        return $this->rating;
    }

    public function setRating(float $rating): self
    {
        $this->rating = $rating;

        return $this;
    }

    /**
     * @return Collection|ShoppingCartDetail[]
     */
    public function getShoppingCartDetails(): Collection
    {
        return $this->shoppingCartDetails;
    }

    public function addShoppingCartDetail(ShoppingCartDetail $shoppingCartDetail): self
    {
        if (!$this->shoppingCartDetails->contains($shoppingCartDetail)) {
            $this->shoppingCartDetails[] = $shoppingCartDetail;
            $shoppingCartDetail->setSupplierProduct($this);
        }

        return $this;
    }

    public function removeShoppingCartDetail(ShoppingCartDetail $shoppingCartDetail): self
    {
        if ($this->shoppingCartDetails->contains($shoppingCartDetail)) {
            $this->shoppingCartDetails->removeElement($shoppingCartDetail);
            // set the owning side to null (unless already changed)
            if ($shoppingCartDetail->getSupplierProduct() === $this) {
                $shoppingCartDetail->setSupplierProduct(null);
            }
        }

        return $this;
    }

    public function getFinalPrice(): ?float
    {
        return $this->finalPrice;
    }

    /**
     * @ORM\PrePersist()
     * @return $this
     */
    public function setFinalPrice(): self
    {
        $rate = $this->getProduct()->getCategory()->getPlatformFee();
        $this->finalPrice = $this->getInitialPrice() + ($this->getInitialPrice() * $rate) + ($this->getInitialPrice() * $this->getAdditionalFee());
        $this->updateMinimumPrice();

        return $this;
    }

    public function getNbComments(): ?int
    {
        return count($this->comments);
    }


    public function getNbLikes(): ?int
    {
        return count($this->favorites);
    }

    public function getNbOrders(): ?int
    {
        return count($this->orderDetails);
    }
}
