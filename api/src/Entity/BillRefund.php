<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\BillRefundRepository")
 */
class BillRefund
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=50)
     */
    private $reason;

    /**
     * @ORM\Column(type="text")
     */
    private $description;

    /**
     * @ORM\Column(type="float")
     */
    private $additionalCost;

    /**
     * @ORM\Column(type="float")
     */
    private $additionalFee;

    /**
     * @ORM\OneToOne(targetEntity="App\Entity\OrderReturned", mappedBy="billRefund", cascade={"persist", "remove"})
     */
    private $orderReturned;

    /**
     * @ORM\OneToOne(targetEntity="App\Entity\Withdrawal", mappedBy="billRefund", cascade={"persist", "remove"})
     */
    private $withdrawal;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Customer", inversedBy="refundBills")
     * @ORM\JoinColumn(nullable=false)
     */
    private $customer;

    public function getId(): ?int
    {
        return $this->id;
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
}
