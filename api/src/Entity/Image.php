<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\HttpFoundation\File\File;
use Vich\UploaderBundle\Entity\File as EmbeddedFile;
use Vich\UploaderBundle\Mapping\Annotation as Vich;

/**
 * @ApiResource(attributes={
        "normalization_context"={"groups"={"category:output","product:output","customer:output","supplier:output","admin:output","favorite:output"}}
 * })
 * @ORM\Table(name="bjmkt_image")
 * @ORM\Entity(repositoryClass="App\Repository\ImageRepository")
 */
class Image
{
    /**
     * @var integer $id ID of this image
     *
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"product:output","supplier:output","profile:output","supplier_product_owner:output","supplier_product:output"})
     */
    private $id;

    /**
     * @var integer $place Place of this image
     *
     * @ORM\Column(type="integer")
     * @Assert\Range(
     *     min=1,
     *     max=10,
     *     notInRangeMessage="The value's limit for place attribute is {{ limit }}.\nThe current value is {{ value }}."
     * )
     * @Groups({"profile:output","product:output","supplier:output","favorite:output","supplier_product:output","supplier_product_owner:output"})
     */
    private $place;

    /**
     * @var string $title Title of this image
     *
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"category:output","supplier_product:output","supplier:output","favorite:output","supplier_product_owner:output"})
     */
    private $title;

    /**
     * @var string $alt Alternative title of this image
     *
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"category:output","supplier_product:output","supplier:output","favorite:output"})
     */
    private $alt;

    /**
     * @var string $url URL to the file of this image
     *
     * @ORM\Column(type="string", length=255)
     * @Assert\NotNull()
     * @Assert\Url()
     * @Groups({
     *     "profile:output",
     *     "category:output",
     *     "supplier_product:output",
     *     "supplier:output",
     *     "favorite:output",
     *     "order_set:output",
     *     "supplier_product_owner:output",
     *     "comment:output",
     *     "product_name:output"
     * })
     */
    private $url;

    /**
     * @var integer $size Size of this image
     *
     * @ORM\Column(type="integer")
     * @Assert\NotNull()
     * @Groups({"category:output","product:output","supplier:output","supplier_product_owner:output"})
     */
    private $size;

    /**
     * @var User $user User represented by this image
     *
     * @ORM\OneToOne(targetEntity="App\Entity\User", mappedBy="image", cascade={"persist", "remove"})
     */
    private $user;

    /**
     * @var SupplierProduct $supplierProduct Supplier's product represented by this image
     * @ORM\ManyToOne(targetEntity="App\Entity\SupplierProduct", inversedBy="images")
     */
    private $supplierProduct;

    /**
     * @ORM\OneToOne(targetEntity="App\Entity\Category", mappedBy="image", cascade={"persist", "remove"})
     */
    private $category;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $mimeType;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPlace(): ?int
    {
        return $this->place;
    }

    public function setPlace(int $place): self
    {
        $this->place = $place;

        return $this;
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

    public function getAlt(): ?string
    {
        return $this->alt;
    }

    public function setAlt(string $alt): self
    {
        $this->alt = $alt;

        return $this;
    }

    public function getUrl(): ?string
    {
        return $this->url;
    }

    public function setUrl(string $url): self
    {
        $this->url = $url;

        return $this;
    }


    /**
     * @return \DateTimeInterface|null
     */
    public function getUpdatedAt()
    {
        return $this->updatedAt;
    }

    /**
     * @return int|null
     */
    public function getSize(): ?int
    {
        return $this->size;
    }

    public function setSize(int $size): self
    {
        $this->size = $size;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        // set (or unset) the owning side of the relation if necessary
        $newImage = $user === null ? null : $this;
        if ($newImage !== $user->getImage()) {
            $user->setImage($newImage);
        }

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

    public function getCategory(): ?Category
    {
        return $this->category;
    }

    public function setCategory(Category $category): self
    {
        $this->category = $category;

        // set the owning side of the relation if necessary
        if ($this !== $category->getImage()) {
            $category->setImage($this);
        }

        return $this;
    }

    public function getMimeType(): ?string
    {
        return $this->mimeType;
    }

    public function setMimeType(string $mimeType): self
    {
        $this->mimeType = $mimeType;

        return $this;
    }
}
