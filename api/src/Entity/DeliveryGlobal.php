<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Annotation\ApiResource;

/**
 * @ApiResource()
 * @ORM\Table(name="bjmkt_delivery_global")
 * @ORM\Entity(repositoryClass="App\Repository\DeliveryGlobalRepository")
 */
class DeliveryGlobal
{
    /**
     * @var integer $id ID of this delivery set
     *
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @var float $shippingCost Shipping cost of this delivery set
     *
     * @ORM\Column(type="float")
     * @Assert\NotBlank()
     * @Assert\Range(
     *     min=0,
     *     minMessage="The minimum value is {{ limit }}.\nThe current value is {{ value }}."
     * )
     */
    private $shippingCost;

    /**
     * @var \DateTime $dateCreated Date when this delivery set was created
     *
     * @ORM\Column(type="datetime")
     * @Assert\DateTime()
     */
    private $dateCreated;

    /**
     * @var boolean $allShipped All the element of this delivery set were shipped
     *
     * @ORM\Column(type="boolean")
     * @Assert\Type("boolean")
     */
    private $allShipped;

    /**
     * @var boolean $allReceived All the element of this delivery set were received by the customer who made the order set
     *
     * @ORM\Column(type="boolean")
     * @Assert\Type("boolean")
     */
    private $allReceived;

    /**
     * @var Collection $deliveryDetails Delivery detail of each element composing this delivery set
     *
     * @ORM\OneToMany(targetEntity="App\Entity\DeliveryDetail", mappedBy="deliveryGlobal", orphanRemoval=true)
     */
    private $deliveryDetails;

    /**
     * @var OrderGlobal $orderGlobal Order set shipped as this delivery set
     * @ORM\OneToOne(targetEntity="App\Entity\OrderGlobal", inversedBy="deliveryGlobal", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     * @Assert\NotNull()
     */
    private $orderGlobal;

    /**
     * @var Shipper $shipper Shipper which is responsible to send the order set
     *
     * @ORM\ManyToOne(targetEntity="App\Entity\Shipper", inversedBy="globalDeliveries")
     * @ORM\JoinColumn(nullable=false)
     * @Assert\NotNull()
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
