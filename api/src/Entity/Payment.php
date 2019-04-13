<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\PaymentRepository")
 */
class Payment
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $reference;

    /**
     * @ORM\Column(type="datetime")
     */
    private $dateCreated;

    /**
     * @ORM\Column(type="string", length=5)
     */
    private $currency;

    /**
     * @ORM\Column(type="text")
     */
    private $description;

    /**
     * @ORM\Column(type="string", length=50)
     */
    private $status;

    /**
     * @ORM\Column(type="float")
     */
    private $amount;

    /**
     * @ORM\Column(type="float")
     */
    private $amountRefund;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $balanceTransaction;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $emailReceipt;

    /**
     * @ORM\Column(type="string", length=30)
     */
    private $source;

    /**
     * @ORM\OneToOne(targetEntity="App\Entity\Bill", inversedBy="payment", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     */
    private $bill;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getReference(): ?string
    {
        return $this->reference;
    }

    public function setReference(string $reference): self
    {
        $this->reference = $reference;

        return $this;
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

    public function getCurrency(): ?string
    {
        return $this->currency;
    }

    public function setCurrency(string $currency): self
    {
        $this->currency = $currency;

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

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getAmount(): ?float
    {
        return $this->amount;
    }

    public function setAmount(float $amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    public function getAmountRefund(): ?float
    {
        return $this->amountRefund;
    }

    public function setAmountRefund(float $amountRefund): self
    {
        $this->amountRefund = $amountRefund;

        return $this;
    }

    public function getBalanceTransaction(): ?string
    {
        return $this->balanceTransaction;
    }

    public function setBalanceTransaction(string $balanceTransaction): self
    {
        $this->balanceTransaction = $balanceTransaction;

        return $this;
    }

    public function getEmailReceipt(): ?string
    {
        return $this->emailReceipt;
    }

    public function setEmailReceipt(string $emailReceipt): self
    {
        $this->emailReceipt = $emailReceipt;

        return $this;
    }

    public function getSource(): ?string
    {
        return $this->source;
    }

    public function setSource(string $source): self
    {
        $this->source = $source;

        return $this;
    }

    public function getBill(): ?Bill
    {
        return $this->bill;
    }

    public function setBill(Bill $bill): self
    {
        $this->bill = $bill;

        return $this;
    }
}
