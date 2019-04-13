<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\OrderDetailRepository")
 */
class OrderDetail
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=100)
     */
    private $status;

    /**
     * @ORM\Column(type="integer")
     */
    private $quantity;

    /**
     * @ORM\Column(type="float")
     */
    private $unitCost;

    /**
     * @ORM\Column(type="float")
     */
    private $totalCost;

    /**
     * @ORM\OneToOne(targetEntity="App\Entity\OrderReturned", mappedBy="orderDetail", cascade={"persist", "remove"})
     */
    private $orderReturned;

    /**
     * @ORM\OneToOne(targetEntity="App\Entity\Withdrawal", mappedBy="orderDetail", cascade={"persist", "remove"})
     */
    private $withdrawal;

    /**
     * @ORM\OneToOne(targetEntity="App\Entity\BillSupplier", mappedBy="orderDetail", cascade={"persist", "remove"})
     */
    private $supplierBill;

    /**
     * @ORM\OneToOne(targetEntity="App\Entity\DeliveryDetail", mappedBy="orderDetail", cascade={"persist", "remove"})
     */
    private $deliveryDetail;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\OrderGlobal", inversedBy="orderDetails")
     * @ORM\JoinColumn(nullable=false)
     */
    private $orderGlobal;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\SupplierProduct", inversedBy="orderDetails")
     * @ORM\JoinColumn(nullable=false)
     */
    private $supplierProduct;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getQuantity(): ?int
    {
        return $this->quantity;
    }

    public function setQuantity(int $quantity): self
    {
        $this->quantity = $quantity;

        return $this;
    }

    public function getUnitCost(): ?float
    {
        return $this->unitCost;
    }

    public function setUnitCost(float $unitCost): self
    {
        $this->unitCost = $unitCost;

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

    public function getOrderReturned(): ?OrderReturned
    {
        return $this->orderReturned;
    }

    public function setOrderReturned(OrderReturned $orderReturned): self
    {
        $this->orderReturned = $orderReturned;

        // set the owning side of the relation if necessary
        if ($this !== $orderReturned->getOrderDetail()) {
            $orderReturned->setOrderDetail($this);
        }

        return $this;
    }

    public function getWithdrawal(): ?Withdrawal
    {
        return $this->withdrawal;
    }

    public function setWithdrawal(Withdrawal $withdrawal): self
    {
        $this->withdrawal = $withdrawal;

        // set the owning side of the relation if necessary
        if ($this !== $withdrawal->getOrderDetail()) {
            $withdrawal->setOrderDetail($this);
        }

        return $this;
    }

    public function getSupplierBill(): ?BillSupplier
    {
        return $this->supplierBill;
    }

    public function setSupplierBill(BillSupplier $supplierBill): self
    {
        $this->supplierBill = $supplierBill;

        // set the owning side of the relation if necessary
        if ($this !== $supplierBill->getOrderDetail()) {
            $supplierBill->setOrderDetail($this);
        }

        return $this;
    }

    public function getDeliveryDetail(): ?DeliveryDetail
    {
        return $this->deliveryDetail;
    }

    public function setDeliveryDetail(DeliveryDetail $deliveryDetail): self
    {
        $this->deliveryDetail = $deliveryDetail;

        // set the owning side of the relation if necessary
        if ($this !== $deliveryDetail->getOrderDetail()) {
            $deliveryDetail->setOrderDetail($this);
        }

        return $this;
    }

    public function getOrderGlobal(): ?OrderGlobal
    {
        return $this->orderGlobal;
    }

    public function setOrderGlobal(?OrderGlobal $orderGlobal): self
    {
        $this->orderGlobal = $orderGlobal;

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
