<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Annotation\ApiResource;

/**
 * @ApiResource()
 * @ORM\Table(name="bjmkt_supplier_bill")
 * @ORM\Entity(repositoryClass="App\Repository\BillSupplierRepository")
 */
class BillSupplier extends Bill
{
    /**
     * @var integer $id ID of this supplier bill
     *
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @var float $deliveryCost Delivery cost paid to the supplier
     *
     * @ORM\Column(type="float")
     * @Assert\NotBlank()
     */
    private $deliveryCost;

    /**
     * @var  OrderDetail $orderDetail Order detail associated to this supplier bill
     *
     * @ORM\OneToOne(targetEntity="App\Entity\OrderDetail", inversedBy="supplierBill", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     * @Assert\NotNull()
     */
    private $orderDetail;

    /**
     * @var Supplier $supplier Supplier concerned by this supplier bill
     *
     * @ORM\ManyToOne(targetEntity="App\Entity\Supplier", inversedBy="supplierBills")
     * @ORM\JoinColumn(nullable=false)
     * @Assert\NotNull()
     */
    private $supplier;

    public function __construct()
    {
        parent::__construct();
    }

    public function getBillType(): string
    {
        return $this::TYPE_SUPPLIER_BILL;
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
