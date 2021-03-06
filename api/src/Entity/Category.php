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
        "normalization_context"={"groups"={"category:output"}}
 * })
 * @ORM\Table(name="bjmkt_category")
 * @ORM\Entity(repositoryClass="App\Repository\CategoryRepository")
 */
class Category
{
    /**
     * @var integer $id ID of this category
     *
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"category:output","product:output","supplier_product_owner:output"})
     *
     */
    private $id;

    /**
     * @var string $name Name of this category
     *
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank()
     * @Groups({"category:output","supplier_product:output","supplier_product_owner:output"})
     */
    private $name;

    /**
     * @var string $description Description of the category
     *
     * @ORM\Column(type="text")
     * @Assert\NotBlank()
     * @Groups({"category:output","supplier_product:output"})
     */
    private $description;

    /**
     * @var \DateTime $dateCreated When the category was created
     *
     * @ORM\Column(type="datetime")
     * @Assert\Type("DateTime")
     * @Groups({"category:output"})
     */
    private $dateCreated;

    /**
     * @var boolean $isValid Is valided?
     *
     * @ORM\Column(type="boolean")
     * @Assert\Type("boolean")
     * @Groups("category:output")
     */
    private $isValid;

    /**
     * @var float $platformFee Platform fee for the sale of this products' category
     *
     * @ORM\Column(type="float")
     * @Assert\Range(
     *     min=0.0 ,
     *     max=0.95,
     *     notInRangeMessage="The value's limit is {{ limit }}. Your value is {{ value }}"
     * )
     * @Groups({"category:output"})
     *
     *
     */
    private $platformFee;



    /**
     * @var Collection $products Products of this category
     *
     * @ORM\OneToMany(targetEntity="App\Entity\Product", mappedBy="category")
     * @ApiSubresource()
     * @Groups({"category:output"})
     * @MaxDepth(1)
     */
    private $products;

    /**
     * @ORM\OneToOne(targetEntity="App\Entity\Image", inversedBy="category", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"category:output","supplier_product:output"})
     */
    private $image;



    public function __construct()
    {
        $this->products = new ArrayCollection();
        $this->platformFee = 0.0;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

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

    public function getIsValid(): ?bool
    {
        return $this->isValid;
    }

    public function setIsValid(bool $isValid): self
    {
        $this->isValid = $isValid;

        return $this;
    }

    /**
     * @return float
     */
    public function getPlatformFee(): float
    {
        return $this->platformFee;
    }

    /**
     * @param float $platformFee
     * @return Category
     */
    public function setPlatformFee(float $platformFee): self
    {
        $this->platformFee = $platformFee;

        return $this;
    }



    /**
     * @return Collection|Product[]
     */
    public function getProducts(): Collection
    {
        return $this->products;
    }

    public function addProduct(Product $product): self
    {
        if (!$this->products->contains($product)) {
            $this->products[] = $product;
            $product->setCategory($this);
        }

        return $this;
    }

    public function removeProduct(Product $product): self
    {
        if ($this->products->contains($product)) {
            $this->products->removeElement($product);
            // set the owning side to null (unless already changed)
            if ($product->getCategory() === $this) {
                $product->setCategory(null);
            }
        }

        return $this;
    }

    public function getImage(): ?Image
    {
        return $this->image;
    }

    public function setImage(Image $image): self
    {
        $this->image = $image;

        return $this;
    }
}
