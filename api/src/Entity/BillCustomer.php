<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ApiResource(attributes={
 *     "normalization_context"={"groups"={"bill_customer:output","payment:output"}}
 * })
 * @ORM\Table(name="bjmkt_customer_bill")
 * @ORM\Entity(repositoryClass="App\Repository\BillCustomerRepository")
 */
class BillCustomer extends  Bill
{
    /**
     * @var integer $id ID of this customer bill
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @var float $additionalCost Additional cost added to the customer's bill
     *
     * @ORM\Column(type="float")
     * @Assert\Type("float")
     * @Assert\Range(
     *     min=0,
     *     notInRangeMessage="The value's limit is {{ limit }}.\nThe current value is {{ value }}"
     * )
     * @Groups({"bill_customer:output","payment:output"})
     */
    private $additionalCost;

    /**
     * @var float $additionalFee Additional fee added to this bill
     *
     * @ORM\Column(type="float")
     * @Assert\Range(
     *     min=0.0,
     *     max=2.0,
     *     notInRangeMessage="The value's limit is {{ limit }}.\nThe current value is {{ value }}",
     * )
     * @Groups({"bill_customer:output","payment:output"})
     */
    private $additionalFee;

    /**
     * @var string $additionalInformation Reason of the additonal fee or charges
     *
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"bill_customer:output","payment:output"})
     */
    private $additionalInformation;

    /**
     * @var float $totalShippingCost Total shipping cost for this bill
     *
     * @ORM\Column(type="float")
     * @Assert\NotBlank()
     * @Groups({"bill_customer:output","payment:output"})
     */
    private $totalShippingCost;

    /**
     * @var OrderSet $orderSet Order set associated to this bill
     *
     * @ORM\OneToOne(targetEntity="OrderSet", inversedBy="billCustomer", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=true)
     * @Assert\NotNull()
     *
     */
    private $orderSet;

    /**
     * @var Customer $customer Customer associated  to this bill
     *
     * @ORM\ManyToOne(targetEntity="App\Entity\Customer", inversedBy="customerBills")
     * @ORM\JoinColumn(nullable=false)
     * @Assert\NotNull()
     * @Groups({"bill_customer:output","payment:output"})
     */
    private $customer;

    public function __construct()
    {
        parent::__construct();
        $this->additionalCost = 0;
        $this->additionalFee = 0;
        $this->totalShippingCost = 0;

    }

    public function getBillType(): string
    {
        return $this::TYPE_CUSTOMER_BILL;
    }

    public function getAdditionalCost(): ?float
    {
        return $this->additionalCost;
    }

    public function setAdditionalCost(float $additionalCost): self
    {
        $this->additionalCost = $additionalCost;

        return $this;
    }

    public function getAdditionalFee(): ?float
    {
        return $this->additionalFee;
    }

    /**
     * @param float $additionalFee
     * @return BillCustomer
     */
    public function setAdditionalFee(float $additionalFee): self
    {
        $this->additionalFee = $additionalFee;

        return $this;
    }

    /**
     * @return string
     */
    public function getAdditionalInformation(): string
    {
        return $this->additionalInformation;
    }

    /**
     * @param string $additionalInformation
     * @return BillCustomer
     */
    public function setAdditionalInformation(string $additionalInformation): self
    {
        $this->additionalInformation = $additionalInformation;

        return $this;
    }


    /**
     * @return float|null
     */
    public function getTotalShippingCost(): ?float
    {
        return $this->totalShippingCost;
    }

    public function setTotalShippingCost(float $totalShippingCost): self
    {
        $this->totalShippingCost = $totalShippingCost;

        return $this;
    }

    public function getOrderSet(): ?OrderSet
    {
        return $this->orderSet;
    }

    public function setOrderSet(OrderSet $orderSet): self
    {
        $this->orderSet = $orderSet;

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
}
