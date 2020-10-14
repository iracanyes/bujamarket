<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;

/**
 * @ApiResource(attributes={
 *     "normalization_context"={"groups"={"order_set:output"}}
 * })
 * @ApiFilter(SearchFilter::class, properties={"id": "exact", "sessionId": "exact" })
 * @ORM\Table(name="bjmkt_order_set")
 * @ORM\Entity(repositoryClass="App\Repository\OrderSetRepository")
 * @ORM\HasLifecycleCallbacks()
 */
class OrderSet
{
    /**
     * @var integer $id ID of this order set
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"order_set:output","order_detail:output"})
     */
    private $id;

    /**
     * @var \DateTime $dateCreated Creation's date of the order set
     * @ORM\Column(type="datetime")
     * @Assert\Type("DateTime")
     * @Groups({"order_set:output"})
     */
    private $dateCreated;

    /**
     * @var float $totalWeight Total weight of the order set
     *
     * @ORM\Column(type="float")
     * @Assert\Range(
     *     min=0.0,
     *     notInRangeMessage="The minimum value is {{ limit }}.\nThe current value is {{ value }}."
     *
     * )
     * @Groups({"order_set:output"})
     */
    private $totalWeight;

    /**
     * @var integer $nbPackage Number of package for the order set
     *
     * @ORM\Column(type="integer")
     * @Assert\GreaterThanOrEqual(0)
     * @Groups({"order_set:output"})
     */
    private $nbPackage;

    /**
     * @var float $totalCost Total cost of the order set
     * @ORM\Column(type="float")
     * @Assert\GreaterThanOrEqual(0)
     * @Groups({"order_set:output"})
     */
    private $totalCost;

    /**
     * @var \App\Entity\Customer $customer Customer who made the order set
     *
     * @ORM\ManyToOne(targetEntity="App\Entity\Customer", inversedBy="orderSets")
     * @ORM\JoinColumn(nullable=false)
     * @Assert\Type("App\Entity\Customer")
     * @Assert\NotNull()
     * @Groups({"order_set:output"})
     */
    private $customer;

    /**
     * @var \App\Entity\BillCustomer $billCustomer Customer's bill for the order set
     *
     * @ORM\OneToOne(targetEntity="App\Entity\BillCustomer", mappedBy="orderSet", cascade={"persist", "remove"})
     * @Assert\Type("App\Entity\BillCustomer")
     * @Groups({"order_set:output","order_detail:output"})
     */
    private $billCustomer;

    /**
     * @var DeliverySet $deliverySet Delivery set for the order set
     *
     * @ORM\OneToOne(targetEntity="DeliverySet", mappedBy="orderSet", cascade={"persist", "remove"})
     * @Assert\Type("App\Entity\DeliverySet")
     * @Groups({"order_set:output"})
     */
    private $deliverySet;

    /**
     * @var Collection $orderDetails Each details  for this order set
     *
     * @ORM\OneToMany(targetEntity="App\Entity\OrderDetail", cascade={"persist","remove"}, mappedBy="orderSet", orphanRemoval=true)
     * @Groups({"order_set:output"})
     */
    private $orderDetails;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Address", inversedBy="orderSets")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"order_set:output","order_detail:output"})
     */
    private $address;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $sessionId;

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

    /**
     * @ORM\PrePersist()
     * @return $this
     */
    public function setTotalCost(): self
    {
        $totalCost = 0;

        /* Somme des achats  */
        foreach( $this->getOrderDetails() as $item)
        {
            $totalCost += $item->getTotalCost();
        }

        /* Calcul de la taxe */


        /* Ajout du coût d'expédition du colis */
        if($this->getDeliverySet() !== null)
        {
            $totalCost += $this->getDeliverySet()->getShippingCost();
        }


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
        if ($this !== $billCustomer->getOrderSet()) {
            $billCustomer->setOrderSet($this);
        }

        return $this;
    }

    public function getDeliverySet(): ?DeliverySet
    {
        return $this->deliverySet;
    }

    public function setDeliverySet(DeliverySet $deliverySet): self
    {
        $this->deliverySet = $deliverySet;

        // set the owning side of the relation if necessary
        if ($this !== $deliverySet->getOrderSet()) {
            $deliverySet->setOrderSet($this);
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
            $orderDetail->setOrderSet($this);
        }

        return $this;
    }

    public function removeOrderDetail(OrderDetail $orderDetail): self
    {
        if ($this->orderDetails->contains($orderDetail)) {
            $this->orderDetails->removeElement($orderDetail);
            // set the owning side to null (unless already changed)
            if ($orderDetail->getOrderSet() === $this) {
                $orderDetail->setOrderSet(null);
            }
        }

        return $this;
    }

    public function getAddress(): ?Address
    {
        return $this->address;
    }

    public function setAddress(?Address $address): self
    {
        $this->address = $address;

        return $this;
    }

    public function getSessionId(): ?string
    {
        return $this->sessionId;
    }

    public function setSessionId(string $sessionId): self
    {
        $this->sessionId = $sessionId;

        return $this;
    }
}
