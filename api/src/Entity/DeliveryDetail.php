<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Annotation\ApiResource;

/**
 * @ApiResource()
 * @ORM\Table(name="bjmkt_delivery_detail")
 * @ORM\Entity(repositoryClass="App\Repository\DeliveryDetailRepository")
 */
class DeliveryDetail
{
    /**
     * @var integer $id ID of this delivery detail
     *
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @var string $reference Reference of this delivery detail
     *
     * @ORM\Column(type="string", length=50)
     * @Assert\NotBlank()
     */
    private $reference;

    /**
     * @var string $description Description of this delivery detail
     *
     * @ORM\Column(type="text")
     * @Assert\NotBlank()
     */
    private $description;

    /**
     * @var \DateTime $dateCreated Date when this delivery detail was created
     *
     * @ORM\Column(type="datetime")
     * @Assert\Type("DateTime")
     */
    private $dateCreated;

    /**
     * @var boolean $isShipped Is this delivery detail shipped
     *
     * @ORM\Column(type="boolean")
     * @Assert\Type("boolean")
     */
    private $isShipped;

    /**
     * @var boolean $isReceived Is this delivery detail received by the customer
     *
     * @ORM\Column(type="boolean")
     * @Assert\Type("boolean")
     */
    private $isReceived;

    /**
     * @var string $attachmentFile Attachment file (proof of shipping)
     *
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank()
     * @Assert\Url()
     */
    private $attachmentFile;

    /**
     * @var OrderDetail $orderDetail Order detail associated to this delivery detail
     *
     * @ORM\OneToOne(targetEntity="App\Entity\OrderDetail", inversedBy="deliveryDetail", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     * @Assert\NotNull()
     */
    private $orderDetail;

    /**
     * @var DeliverySet $deliverySet Delivery set which is in
     *
     * @ORM\ManyToOne(targetEntity="DeliverySet", inversedBy="deliveryDetails")
     * @ORM\JoinColumn(nullable=false)
     * @Assert\NotNull()
     */
    private $deliverySet;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getReference(): ?string
    {
        return $this->reference;
    }

    public function setReference(string $reference): self
    {
        $this->reference = $reference;

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

    public function getIsShipped(): ?bool
    {
        return $this->isShipped;
    }

    public function setIsShipped(bool $isShipped): self
    {
        $this->isShipped = $isShipped;

        return $this;
    }

    public function getIsReceived(): ?bool
    {
        return $this->isReceived;
    }

    public function setIsReceived(bool $isReceived): self
    {
        $this->isReceived = $isReceived;

        return $this;
    }

    public function getAttachmentFile(): ?string
    {
        return $this->attachmentFile;
    }

    public function setAttachmentFile(string $attachmentFile): self
    {
        $this->attachmentFile = $attachmentFile;

        return $this;
    }

    public function getOrderDetail(): ?OrderDetail
    {
        return $this->orderDetail;
    }

    public function setOrderDetail(OrderDetail $orderDetail): self
    {
        $this->orderDetail = $orderDetail;

        return $this;
    }

    public function getDeliverySet(): ?DeliverySet
    {
        return $this->deliverySet;
    }

    public function setDeliverySet(?DeliverySet $deliverySet): self
    {
        $this->deliverySet = $deliverySet;

        return $this;
    }
}
