<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Annotation\ApiResource;

/**
 * @ApiResource()
 * @ORM\Table(name="bjmkt_payment")
 * @ORM\Entity(repositoryClass="App\Repository\PaymentRepository")
 */
class Payment
{
    /**
     * @var integer $id ID of this payment
     *
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @var string $reference Reference of this payment
     *
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank()
     */
    private $reference;

    /**
     * @var \DateTime $dateCreated Date when this payment was made
     *
     * @ORM\Column(type="datetime")
     * @Assert\DateTime()
     */
    private $dateCreated;

    /**
     * @var string $currency Currency used for this payment
     *
     * @ORM\Column(type="string", length=5)
     * @Assert\Currency()
     */
    private $currency;

    /**
     * @var string $description Optional description of the reason of this payment
     *
     * @ORM\Column(type="text")
     */
    private $description;

    /**
     * @var string $status Status of this payment
     *
     * @ORM\Column(type="string", length=50)
     * @Assert\NotBlank()
     */
    private $status;

    /**
     * @var float $amount Amount for this payment
     *
     * @ORM\Column(type="float")
     * @Assert\Range(
     *     min=0.0,
     *     minMessage="The minimum value is {{ limit }}.\nThe current value is {{ value }}"
     * )
     */
    private $amount;

    /**
     * @var float $amountRefund Amount refund for this payment
     *
     * @ORM\Column(type="float")
     * @Assert\Range(
     *     min=0.0,
     *     minMessage="The minimum value is {{ limit }}.\nThe current value is {{ value }}"
     * )
     */
    private $amountRefund;

    /**
     * @var string $balanceTransaction Balance transaction
     *
     * @ORM\Column(type="string", length=255)
     *
     */
    private $balanceTransaction;

    /**
     * @var string $emailReceipt Email for the receipt
     *
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank()
     * @Assert\Email()
     */
    private $emailReceipt;

    /**
     * @var string $source Source (Credit or Debit card). A hash describing that card
     *
     * @ORM\Column(type="string", length=30)
     * @Assert\NotBlank()
     */
    private $source;

    /**
     * @var Bill $bill Bill registered for this payment
     *
     * @ORM\OneToOne(targetEntity="App\Entity\Bill", inversedBy="payment", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     * @Assert\Type("App\Entity\Bill")
     * @Assert\NotNull()
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
