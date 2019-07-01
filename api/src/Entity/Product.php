<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ApiResource()
 * @ApiFilter(SearchFilter::class, properties={"title":"partial", "resume":"partial"})
 * @ORM\Table(name="bjmkt_product")
 * @ORM\Entity(repositoryClass="App\Repository\ProductRepository")
 */
class Product
{
    /**
     * @var integer $id ID of this product
     *
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @var string $title Title of the product
     *
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank()
     */
    private $title;

    /**
     * @var string $resume Resume of the product's description
     *
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank()
     */
    private $resume;

    /**
     * @var string $description Complete description of the product
     *
     * @ORM\Column(type="text")
     * @Assert\NotBlank()
     */
    private $description;

    /**
     * @var string $countryOrigin Country where this product was made
     *
     * @ORM\Column(name="country_origin", type="string", length=3)
     */
    private $countryOrigin;

    /**
     * @var float $weight Weight of the product packed up
     *
     * @ORM\Column(type="float")
     * @Assert\NotNull()
     * @Assert\Range(
     *     min=0.0,
     *     maxMessage="The minimum value is {{ limit }}.\The current value is {{ value }}"
     * )
     */
    private $weight;

    /**
     * @var float $length Length of this product packed up
     *
     * @ORM\Column(type="float")
     * @Assert\Range(
     *     min=0.0,
     *     maxMessage="The minimum value is {{ limit }}.\The current value is {{ value }}"
     * )
     */
    private $length;

    /**
     * @var float $width Width of this product packed up
     *
     * @ORM\Column(type="float")
     * @Assert\Range(
     *     min=0.0,
     *     maxMessage="The minimum value is {{ limit }}.\The current value is {{ value }}"
     * )
     */
    private $width;

    /**
     * @var float $height Height of this product packed up
     *
     * @ORM\Column(type="float")
     * @Assert\Range(
     *     min=0.0,
     *     maxMessage="The minimum value is {{ limit }}.\The current value is {{ value }}"
     * )
     */
    private $height;

    /**
     * @var Category $category Classification category of this product
     * @ORM\ManyToOne(targetEntity="App\Entity\Category", inversedBy="products")
     * @ORM\JoinColumn(nullable=false)
     * @Assert\Type("App\Entity\Category")
     */
    private $category;

    /**
     * @var Collection $productSuppliers Product's supplier
     *
     * @ORM\OneToMany(targetEntity="App\Entity\SupplierProduct", mappedBy="product", orphanRemoval=true)
     */
    private $productSuppliers;

    /**
     * @var Collection $images Images of the product
     * @ORM\OneToMany(targetEntity="App\Entity\Image", mappedBy="product")
     */
    private $images;

    public function __construct()
    {
        $this->productSuppliers = new ArrayCollection();
        $this->images = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function getResume(): ?string
    {
        return $this->resume;
    }

    public function setResume(string $resume): self
    {
        $this->resume = $resume;

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

    /**
     * @return string
     */
    public function getCountryOrigin(): string
    {
        return $this->countryOrigin;
    }

    /**
     * @param string $countryOrigin
     */
    public function setCountryOrigin(string $countryOrigin): void
    {
        $this->countryOrigin = $countryOrigin;
    }



    public function getWeight(): ?float
    {
        return $this->weight;
    }

    public function setWeight(float $weight): self
    {
        $this->weight = $weight;

        return $this;
    }

    public function getLength(): ?float
    {
        return $this->length;
    }

    public function setLength(float $length): self
    {
        $this->length = $length;

        return $this;
    }

    public function getWidth(): ?float
    {
        return $this->width;
    }

    public function setWidth(float $width): self
    {
        $this->width = $width;

        return $this;
    }

    public function getHeight(): ?float
    {
        return $this->height;
    }

    public function setHeight(float $height): self
    {
        $this->height = $height;

        return $this;
    }

    public function getCategory(): ?Category
    {
        return $this->category;
    }

    public function setCategory(?Category $category): self
    {
        $this->category = $category;

        return $this;
    }

    /**
     * @return Collection|SupplierProduct[]
     */
    public function getProductSuppliers(): Collection
    {
        return $this->productSuppliers;
    }

    public function addProductSupplier(SupplierProduct $productSupplier): self
    {
        if (!$this->productSuppliers->contains($productSupplier)) {
            $this->productSuppliers[] = $productSupplier;
            $productSupplier->setProduct($this);
        }

        return $this;
    }

    public function removeProductSupplier(SupplierProduct $productSupplier): self
    {
        if ($this->productSuppliers->contains($productSupplier)) {
            $this->productSuppliers->removeElement($productSupplier);
            // set the owning side to null (unless already changed)
            if ($productSupplier->getProduct() === $this) {
                $productSupplier->setProduct(null);
            }
        }

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
            $image->setProduct($this);
        }

        return $this;
    }

    public function removeImage(Image $image): self
    {
        if ($this->images->contains($image)) {
            $this->images->removeElement($image);
            // set the owning side to null (unless already changed)
            if ($image->getProduct() === $this) {
                $image->setProduct(null);
            }
        }

        return $this;
    }
}
