<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Annotation\ApiResource;

/**
 * @ApiResource()
 * @ORM\Table(name="bjmkt_order_global")
 * @ORM\Entity(repositoryClass="App\Repository\OrderGlobalRepository")
 */
class OrderGlobal
{
    /**
     * @var integer $id ID of this order set
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @var \DateTime $dateCreated Creation's date of the order set
     * @ORM\Column(type="datetime")
     * @Assert\DateTime()
     */
    private $dateCreated;

    /**
     * @var float $totalWeight Total weight of the order set
     *
     * @ORM\Column(type="float")
     * @Assert\Range(
     *     min=0.0,
     *     minMessage="The minimum value is {{ limit }}.\nThe current value is {{ value }}."
     *
     * )
     */
    private $totalWeight;

    /**
     * @var integer $nbPackage Number of package for the order set
     *
     * @ORM\Column(type="integer")
     * @Assert\GreaterThanOrEqual(0)
     */
    private $nbPackage;

    /**
     * @var float $totalCost Total cost of the order set
     * @ORM\Column(type="float")
     * @Assert\GreaterThanOrEqual(0)
     */
    private $totalCost;

    /**
     * @var \App\Entity\Customer $customer Customer who made the order set
     *
     * @ORM\ManyToOne(targetEntity="App\Entity\Customer", inversedBy="orderGlobals")
     * @ORM\JoinColumn(nullable=false)
     * @Assert\Type("App\Entity\Customer")
     * @Assert\NotNull()
     */
    private $customer;

    /**
     * @var \App\Entity\BillCustomer $billCustomer Customer's bill for the order set
     *
     * @ORM\OneToOne(targetEntity="App\Entity\BillCustomer", mappedBy="orderGlobal", cascade={"persist", "remove"})
     * @Assert\Type("App\Entity\BillCustomer")
     */
    private $billCustomer;

    /**
     * @var DeliveryGlobal $deliveryGlobal Delivery set for the order set
     *
     * @ORM\OneToOne(targetEntity="App\Entity\DeliveryGlobal", mappedBy="orderGlobal", cascade={"persist", "remove"})
     * @Assert\Type("App\Entity\DeliveryGlobal")
     */
    private $deliveryGlobal;

    /**
     * @var Collection $orderDetails Each details  for this order set
     *
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
