<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\OrderGlobalRepository")
 */
class OrderGlobal
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="datetime")
     */
    private $dateCreated;

    /**
     * @ORM\Column(type="float")
     */
    private $totalWeight;

    /**
     * @ORM\Column(type="integer")
     */
    private $nbPackage;

    /**
     * @ORM\Column(type="float")
     */
    private $totalCost;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Customer", inversedBy="orderGlobals")
     * @ORM\JoinColumn(nullable=false)
     */
    private $customer;

    /**
     * @ORM\OneToOne(targetEntity="App\Entity\BillCustomer", mappedBy="orderGlobal", cascade={"persist", "remove"})
     */
    private $billCustomer;

    /**
     * @ORM\OneToOne(targetEntity="App\Entity\DeliveryGlobal", mappedBy="orderGlobal", cascade={"persist", "remove"})
     */
    private $deliveryGlobal;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\OrderDetail", mappedBy="orderGlobal", orphanRemoval=true)
     */
    private $orderDetails;

    public function __construct()
    {
        $this->orderDetails = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
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

    public function getTotalWeight(): ?float
    {
        return $this->totalWeight;
    }

    public function setTotalWeight(float $totalWeight): self
    {
        $this->totalWeight = $totalWeight;

        return $this;
    }

    public function getNbPackage(): ?int
    {
        return $this->nbPackage;
    }

    public function setNbPackage(int $nbPackage): self
    {
        $this->nbPackage = $nbPackage;

        return $this;
    }

    public function getTotalCost(): ?float
    {
        return $this->totalCost;
    }

    public function setTotalCost(float $totalCost): self
    {
        $this->totalCost = $totalCost;

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

    public function getBillCustomer(): ?BillCustomer
    {
        return $this->billCustomer;
    }

    public function setBillCustomer(BillCustomer $billCustomer): self
    {
        $this->billCustomer = $billCustomer;

        // set the owning side of the relation if necessary
        if ($this !== $billCustomer->getOrderGlobal()) {
            $billCustomer->setOrderGlobal($this);
        }

        return $this;
    }

    public function getDeliveryGlobal(): ?DeliveryGlobal
    {
        return $this->deliveryGlobal;
    }

    public function setDeliveryGlobal(DeliveryGlobal $deliveryGlobal): self
    {
        $this->deliveryGlobal = $deliveryGlobal;

        // set the owning side of the relation if necessary
        if ($this !== $deliveryGlobal->getOrderGlobal()) {
            $deliveryGlobal->setOrderGlobal($this);
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
            $orderDetail->setOrderGlobal($this);
        }

        return $this;
    }

    public function removeOrderDetail(OrderDetail $orderDetail): self
    {
        if ($this->orderDetails->contains($orderDetail)) {
            $this->orderDetails->removeElement($orderDetail);
            // set the owning side to null (unless already changed)
            if ($orderDetail->getOrderGlobal() === $this) {
                $orderDetail->setOrderGlobal(null);
            }
        }

        return $this;
    }
}
