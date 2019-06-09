<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Annotation\ApiResource;

/**
 * @ApiResource()
 * @ORM\Table(name="bjmkt_comment")
 * @ORM\Entity(repositoryClass="App\Repository\CommentRepository")
 */
class Comment
{
    /**
     * @var integer $id ID of this commment
     *
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @var integer $rating Rating given to the vendor product
     *
     * @ORM\Column(type="integer")
     * @Assert\Range(
     *     min=0,
     *     max=10,
     *     minMessage="The minimum value is {{ limit }}.\nThe current value is {{ value }}",
     *     maxMessage="he maximum value is {{ limit }}.\nThe current value is {{ value }}"
     * )
     */
    private $rating;

    /**
     * @var string $content Content of the comment
     *
     * @ORM\Column(type="text")
     * @Assert\NotBlank()
     */
    private $content;

    /**
     * @var \DateTime $dateCreated Date when the comment was created
     *
     * @ORM\Column(type="datetime")
     * @Assert\DateTime()
     */
    private $dateCreated;

    /**
     * @var Customer $customer Customer who wrote this comment
     *
     * @ORM\ManyToOne(targetEntity="App\Entity\Customer", inversedBy="comments")
     * @ORM\JoinColumn(nullable=false)
     * @Assert\NotNull()
     */
    private $customer;

    /**
     * @var SupplierProduct $supplierProduct Supplier product commented
     *
     * @ORM\ManyToOne(targetEntity="App\Entity\SupplierProduct", inversedBy="comments")
     * @ORM\JoinColumn(nullable=false)
     * @Assert\NotNull()
     */
    private $supplierProduct;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getRating(): ?int
    {
        return $this->rating;
    }

    public function setRating(int $rating): self
    {
        $this->rating = $rating;

        return $this;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): self
    {
        $this->content = $content;

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
}
