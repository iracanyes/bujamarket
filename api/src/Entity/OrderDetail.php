<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ApiResource(attributes={
 *     "normalization_context"={"groups"={"order_detail:output","order_set:output"}}
 * })
 * @ORM\Table(name="bjmkt_order_detail")
 * @ORM\Entity(repositoryClass="App\Repository\OrderDetailRepository")
 * @ORM\HasLifecycleCallbacks()
 */
class OrderDetail
{
    /**
     * @var integer $id ID of this order detail
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"order_set:output"})
     */
    private $id;

    /**
     * @var string $status Status of this order detail
     *
     * @ORM\Column(type="string", length=100)
     * @Assert\NotBlank()
     * @Groups({"order_set:output","order_detail:output"})
     */
    private $status;

    /**
     * @var integer $quantity Quantity of product for this order detail
     *
     * @ORM\Column(type="integer")
     * @Assert\Range(
     *     min=0,
     *     notInRangeMessage="The value's limit is {{ limit }}.\nThe current value is {{ value }}."
     * )
     * @Groups({"order_set:output","order_detail:output"})
     */
    private $quantity;

    /**
     * @var float $unitCost Cost by unit of the product concerned by this order detail
     *
     * @ORM\Column(type="float")
     * @Assert\Range(
     *     min=0.0,
     *     notInRangeMessage="The minimum value is {{ limit }}.\nThe current value is {{ value }}."
     * )
     * @Groups({"order_set:output","order_detail:output"})
     */
    private $unitCost;

    /**
     * @var float $totalCost Total cost of this order detail
     *
     * @ORM\Column(type="float")
     * @Assert\NotNull()
     * @Assert\Range(
     *     min=0.0,
     *     notInRangeMessage="The value's limit is {{ limit }}.\nThe current value is {{ value }}."
     * )
     * @Groups({"order_set:output","order_detail:output"})
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
     * @var DeliveryDetail $deliveryDetail Delivery detail for this order detail
     *
     * @ORM\OneToOne(targetEntity="App\Entity\DeliveryDetail", mappedBy="orderDetail", cascade={"persist", "remove"})
     * @Assert\Type("App\Entity\DeliveryDetail")
     * @Groups({"order_set:output","order_detail:output"})
     */
    private $deliveryDetail;

    /**
     * @var OrderSet $orderSet Order set which is a part of
     * @ORM\ManyToOne(targetEntity="OrderSet", inversedBy="orderDetails", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     * @Assert\Type("App\Entity\OrderSet")
     * @Assert\NotNull()
     * @Groups({"order_detail:output"})
     */
    private $orderSet;

    /**
     * @var SupplierProduct $supplierProduct Supplier product concerned by this order detail
     *
     * @ORM\ManyToOne(targetEntity="App\Entity\SupplierProduct", inversedBy="orderDetails")
     * @ORM\JoinColumn(nullable=false)
     * @Assert\Type("App\Entity\SupplierProduct")
     * @Assert\NotNull()
     * @Groups({"order_set:output","order_detail:output"})
     */
    private $supplierProduct;

    /**
     * @ORM\OneToOne(targetEntity=Comment::class, mappedBy="orderDetail", cascade={"persist", "remove"})
     */
    private $comment;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({"order_set:output","order_detail:output"})
     */
    private $commented;

    public function __construct(){
        $this->commented = false;
    }

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

    /**
     *
     * @return $this
     */
    public function setTotalCost()
    {
        $this->totalCost = $this->getUnitCost() * $this->getQuantity();

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

    public function getOrderSet(): ?OrderSet
    {
        return $this->orderSet;
    }

    public function setOrderSet(?OrderSet $orderSet): self
    {
        $this->orderSet = $orderSet;

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

    public function getComment(): ?Comment
    {
        return $this->comment;
    }

    public function setComment(Comment $comment): self
    {
        $this->comment = $comment;

        // set the owning side of the relation if necessary
        if ($comment->getOrderDetail() !== $this) {
            $comment->setOrderDetail($this);
        }

        return $this;
    }

    public function getCommented(): ?bool
    {
        return $this->commented;
    }

    public function setCommented(bool $commented): self
    {
        $this->commented = $commented;

        return $this;
    }
}
