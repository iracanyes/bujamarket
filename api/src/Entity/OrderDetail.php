<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Annotation\ApiResource;

/**
 * @ApiResource()
 * @ORM\Table(name="bjmkt_order_detail")
 * @ORM\Entity(repositoryClass="App\Repository\OrderDetailRepository")
 */
class OrderDetail
{
    /**
     * @var integer $id ID of this order detail
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @var string $status Status of this order detail
     *
     * @ORM\Column(type="string", length=100)
     * @Assert\NotBlank()
     */
    private $status;

    /**
     * @var integer $quantity Quantity of product for this order detail
     *
     * @ORM\Column(type="integer")
     * @Assert\Range(
     *     min=0,
     *     minMessage="The minimum value is {{ limit }}.\nThe current value is {{ value }}."
     * )
     */
    private $quantity;

    /**
     * @var float $unitCost Cost by unit of the product concerned by this order detail
     *
     * @ORM\Column(type="float")
     * @Assert\Range(
     *     min=0.0,
     *     minMessage="The minimum value is {{ limit }}.\nThe current value is {{ value }}."
     * )
     */
    private $unitCost;

    /**
     * @var float $totalCost Total cost of this order detail
     *
     * @ORM\Column(type="float")
     * @Assert\NotNull()
     * @Assert\Range(
     *     min=0.0,
     *     minMessage="The minimum value is {{ limit }}.\nThe current value is {{ value }}."
     * )
     */
    private $totalCost;

    /**
     * @var OrderReturned $orderReturned Order returned associated to this order detail
     *
     * @ORM\OneToOne(targetEntity="App\Entity\OrderReturned", mappedBy="orderDetail", cascade={"persist", "remove"})
     * @Assert\Type("App\Entity\OrderReturned")
     */
    private $orderReturned;

    /**
     * @var Withdrawal $withdrawal Withdrawal associated to this order detail
     *
     * @ORM\OneToOne(targetEntity="App\Entity\Withdrawal", mappedBy="orderDetail", cascade={"persist", "remove"})
     * @Assert\Type("App\Entity\Withdrawal")
     */
    private $withdrawal;

    /**
     * @var BillSupplier $supplierBill Supplier bill for this order detail
     *
     * @ORM\OneToOne(targetEntity="App\Entity\BillSupplier", mappedBy="orderDetail", cascade={"persist", "remove"})
     * @Assert\Type("App\Entity\BillSupplier")
     */
    private $supplierBill;

    /**
     * @var DeliveryDetail $deliveryDetail Delivery detail for this order detail
     *
     * @ORM\OneToOne(targetEntity="App\Entity\DeliveryDetail", mappedBy="orderDetail", cascade={"persist", "remove"})
     * @Assert\Type("App\Entity\DeliveryDetail")
     */
    private $deliveryDetail;

    /**
     * @var OrderGlobal $orderGlobal Order set which is a part of
     * @ORM\ManyToOne(targetEntity="App\Entity\OrderGlobal", inversedBy="orderDetails")
     * @ORM\JoinColumn(nullable=false)
     * @Assert\Type("App\Entity\OrderGlobal")
     * @Assert\NotNull()
     */
    private $orderGlobal;

    /**
     * @var SupplierProduct $supplierProduct Supplier product concerned by this order detail
     *
     * @ORM\ManyToOne(targetEntity="App\Entity\SupplierProduct", inversedBy="orderDetails")
     * @ORM\JoinColumn(nullable=false)
     * @Assert\Type("App\Entity\SupplierProduct")
     * @Assert\NotNull()
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
