<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Annotation\ApiResource;

/**
 * @ApiResource()
 * @ORM\Table(name="bjmkt_bill_refund")
 * @ORM\Entity(repositoryClass="App\Repository\BillRefundRepository")
 */
class BillRefund extends Bill
{
    /**
     * @var integer $id ID of this refund's bill
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @var string $reason Reason for this refund's bill
     *
     * @ORM\Column(type="string", length=50)
     * @Assert\NotBlank()
     */
    private $reason;

    /**
     * @var string $description Complete description of the reason for this refund's bill
     *
     * @ORM\Column(type="text")
     * @Assert\NotBlank()
     */
    private $description;

    /**
     * @var float $additionalCost Additional cost added to this refund's bill
     *
     * @ORM\Column(type="float")
     * @Assert\Range(
     *     min=0,
     *     notInRangeMessage="The value's limit is {{ limit }}.\nThe current value is {{ value }}"
     * )
     */
    private $additionalCost;

    /**
     * @var float $additionalFee Additional fee added to this refund's bill
     *
     * @ORM\Column(type="float")
     * @Assert\Range(
     *     min=0.0,
     *     max=2.0,
     *     notInRangeMessage="The value's limit is {{ limit }}.\nThe current value is {{ value }}",
     * )
     */
    private $additionalFee;

    /**
     * @var string $additionalInformation Reason of the additonal fee or charges
     *
     * @ORM\Column(type="text", nullable=true)
     */
    private $additionalInformation;


    /**
     * @var OrderReturned $orderReturned Order returned associated to this refund's bill
     *
     * @ORM\OneToOne(targetEntity="App\Entity\OrderReturned", mappedBy="billRefund", cascade={"persist", "remove"})
     */
    private $orderReturned;

    /**
     * @var Withdrawal $withdrawal Withdrawal associated to this refund's bill
     *
     * @ORM\OneToOne(targetEntity="App\Entity\Withdrawal", mappedBy="billRefund", cascade={"persist", "remove"})
     */
    private $withdrawal;

    /**
     * @var Customer $customer Customer concerned by this refund's bill
     *
     * @ORM\ManyToOne(targetEntity="App\Entity\Customer", inversedBy="refundBills")
     * @ORM\JoinColumn(nullable=false)
     * @Assert\NotNull()
     */
    private $customer;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Admin", inversedBy="billRefunds")
     * @ORM\JoinColumn(nullable=false)
     */
    private $validator;

    public function __construct()
    {
        parent::__construct();
        $this->additionalFee = 0;
        $this->additionalCost = 0;
    }

    public function getBillType(): string
    {
        return $this::TYPE_REFUND_BILL;
    }

    public function getReason(): ?string
    {
        return $this->reason;
    }

    public function setReason(string $reason): self
    {
        $this->reason = $reason;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
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
     * @return BillRefund
     */
    public function setAdditionalInformation(string $additionalInformation): self
    {
        $this->additionalInformation = $additionalInformation;

        return $this;
    }



    public function getOrderReturned(): ?OrderReturned
    {
        return $this->orderReturned;
    }

    public function setOrderReturned(?OrderReturned $orderReturned): self
    {
        $this->orderReturned = $orderReturned;

        // set (or unset) the owning side of the relation if necessary
        $newBillRefund = $orderReturned === null ? null : $this;
        if ($newBillRefund !== $orderReturned->getBillRefund()) {
            $orderReturned->setBillRefund($newBillRefund);
        }

        return $this;
    }

    public function getWithdrawal(): ?Withdrawal
    {
        return $this->withdrawal;
    }

    public function setWithdrawal(?Withdrawal $withdrawal): self
    {
        $this->withdrawal = $withdrawal;

        // set (or unset) the owning side of the relation if necessary
        $newBillRefund = $withdrawal === null ? null : $this;
        if ($newBillRefund !== $withdrawal->getBillRefund()) {
            $withdrawal->setBillRefund($newBillRefund);
        }

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

    public function getValidator(): ?Admin
    {
        return $this->validator;
    }

    public function setValidator(?Admin $validator): self
    {
        $this->validator = $validator;

        return $this;
    }
}
