<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\DeliveryDetailRepository")
 */
class DeliveryDetail
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=50)
     */
    private $reference;

    /**
     * @ORM\Column(type="text")
     */
    private $description;

    /**
     * @ORM\Column(type="datetime")
     */
    private $dateCreated;

    /**
     * @ORM\Column(type="boolean")
     */
    private $isShipped;

    /**
     * @ORM\Column(type="boolean")
     */
    private $isReceived;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $attachmentFile;

    /**
     * @ORM\OneToOne(targetEntity="App\Entity\OrderDetail", inversedBy="deliveryDetail", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     */
    private $orderDetail;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\DeliveryGlobal", inversedBy="deliveryDetails")
     * @ORM\JoinColumn(nullable=false)
     */
    private $deliveryGlobal;

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

    public function getDeliveryGlobal(): ?DeliveryGlobal
    {
        return $this->deliveryGlobal;
    }

    public function setDeliveryGlobal(?DeliveryGlobal $deliveryGlobal): self
    {
        $this->deliveryGlobal = $deliveryGlobal;

        return $this;
    }
}
