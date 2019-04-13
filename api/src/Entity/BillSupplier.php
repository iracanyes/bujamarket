<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\BillSupplierRepository")
 */
class BillSupplier
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
    private $deliveryCost;

    /**
     * @ORM\OneToOne(targetEntity="App\Entity\OrderDetail", inversedBy="supplierBill", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     */
    private $orderDetail;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Supplier", inversedBy="supplierBills")
     * @ORM\JoinColumn(nullable=false)
     */
    private $supplier;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDeliveryCost(): ?float
    {
        return $this->deliveryCost;
    }

    public function setDeliveryCost(float $deliveryCost): self
    {
        $this->deliveryCost = $deliveryCost;

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

    public function getSupplier(): ?Supplier
    {
        return $this->supplier;
    }

    public function setSupplier(?Supplier $supplier): self
    {
        $this->supplier = $supplier;

        return $this;
    }
}
