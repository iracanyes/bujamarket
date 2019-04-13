<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\DeliveryGlobalRepository")
 */
class DeliveryGlobal
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="float")
     */
    private $shippingCost;

    /**
     * @ORM\Column(type="datetime")
     */
    private $dateCreated;

    /**
     * @ORM\Column(type="boolean")
     */
    private $allShipped;

    /**
     * @ORM\Column(type="boolean")
     */
    private $allReceived;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\DeliveryDetail", mappedBy="deliveryGlobal", orphanRemoval=true)
     */
    private $deliveryDetails;

    /**
     * @ORM\OneToOne(targetEntity="App\Entity\OrderGlobal", inversedBy="deliveryGlobal", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     */
    private $orderGlobal;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Shipper", inversedBy="globalDeliveries")
     * @ORM\JoinColumn(nullable=false)
     */
    private $shipper;

    public function __construct()
    {
        $this->deliveryDetails = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getShippingCost(): ?float
    {
        return $this->shippingCost;
    }

    public function setShippingCost(float $shippingCost): self
    {
        $this->shippingCost = $shippingCost;

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

    public function getAllShipped(): ?bool
    {
        return $this->allShipped;
    }

    public function setAllShipped(bool $allShipped): self
    {
        $this->allShipped = $allShipped;

        return $this;
    }

    public function getAllReceived(): ?bool
    {
        return $this->allReceived;
    }

    public function setAllReceived(bool $allReceived): self
    {
        $this->allReceived = $allReceived;

        return $this;
    }

    /**
     * @return Collection|DeliveryDetail[]
     */
    public function getDeliveryDetails(): Collection
    {
        return $this->deliveryDetails;
    }

    public function addDeliveryDetail(DeliveryDetail $deliveryDetail): self
    {
        if (!$this->deliveryDetails->contains($deliveryDetail)) {
            $this->deliveryDetails[] = $deliveryDetail;
            $deliveryDetail->setDeliveryGlobal($this);
        }

        return $this;
    }

    public function removeDeliveryDetail(DeliveryDetail $deliveryDetail): self
    {
        if ($this->deliveryDetails->contains($deliveryDetail)) {
            $this->deliveryDetails->removeElement($deliveryDetail);
            // set the owning side to null (unless already changed)
            if ($deliveryDetail->getDeliveryGlobal() === $this) {
                $deliveryDetail->setDeliveryGlobal(null);
            }
        }

        return $this;
    }

    public function getOrderGlobal(): ?OrderGlobal
    {
        return $this->orderGlobal;
    }

    public function setOrderGlobal(OrderGlobal $orderGlobal): self
    {
        $this->orderGlobal = $orderGlobal;

        return $this;
    }

    public function getShipper(): ?Shipper
    {
        return $this->shipper;
    }

    public function setShipper(?Shipper $shipper): self
    {
        $this->shipper = $shipper;

        return $this;
    }
}
