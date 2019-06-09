<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Annotation\ApiResource;

/**
 * @ApiResource()
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
     */
    private $id;

    /**
     * @var integer $place Place of this image
     *
     * @ORM\Column(type="integer")
     * @Assert\Range(
     *     min=1,
     *     max=10,
     *     minMessage="The minimum value is {{ limit }}.\nThe current value is {{ value }}.",
     *     maxMessage="The maximum value is {{ limit }}.\nThe current value is {{ value }}."
     * )
     */
    private $place;

    /**
     * @var string $title Title of this image
     *
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $title;

    /**
     * @var string $alt Alternative title of this image
     *
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $alt;

    /**
     * @var string $url URL to the file of this image
     *
     * @ORM\Column(type="string", length=255)
     * @Assert\NotNull()
     * @Assert\Url()
     */
    private $url;

    /**
     * @var integer $size Size of this image
     *
     * @ORM\Column(type="integer")
     * @Assert\NotNull()
     */
    private $size;

    /**
     * @var User $user User represented by this image
     *
     * @ORM\OneToOne(targetEntity="App\Entity\User", mappedBy="image", cascade={"persist", "remove"})
     */
    private $user;

    /**
     * @var Product $product Product represented by this image
     * @ORM\ManyToOne(targetEntity="App\Entity\Product", inversedBy="images")
     */
    private $product;

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

    public function getProduct(): ?Product
    {
        return $this->product;
    }

    public function setProduct(?Product $product): self
    {
        $this->product = $product;

        return $this;
    }
}
