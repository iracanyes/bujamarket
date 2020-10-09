<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ApiResource(attributes={
 *     "normalization_context"={"groups"={"payment:output"}}
 * })
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
     * @Groups({"payment:output"})
     */
    private $reference;

    /**
     * @var \DateTime $dateCreated Date when this payment was made
     *
     * @ORM\Column(type="datetime")
     * @Assert\Type("DateTime")
     * @Groups({"payment:output"})
     */
    private $dateCreated;

    /**
     * @var string $currency Currency used for this payment
     *
     * @ORM\Column(type="string", length=5)
     * @Assert\Currency()
     * @Groups({"payment:output"})
     */
    private $currency;

    /**
     * @var string $description Optional description of the reason of this payment
     *
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"payment:output"})
     */
    private $description;

    /**
     * @var string $status Status of this payment
     *
     * @ORM\Column(type="string", length=50)
     * @Assert\NotBlank()
     * @Groups({"payment:output"})
     */
    private $status;

    /**
     * @var float $amount Amount for this payment
     *
     * @ORM\Column(type="float")
     * @Assert\Range(
     *     min=0.0,
     *     notInRangeMessage="The minimum value is {{ limit }}.\nThe current value is {{ value }}"
     * )
     * @Groups({"payment:output"})
     */
    private $amount;

    /**
     * @var float $amountRefund Amount refund for this payment
     *
     * @ORM\Column(type="float")
     * @Assert\Range(
     *     min=0.0,
     *     notInRangeMessage="The minimum value is {{ limit }}.\nThe current value is {{ value }}"
     * )
     * @Groups({"payment:output"})
     */
    private $amountRefund;

    /**
     * @var string $balanceTransaction Balance transaction
     *
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"payment:output"})
     */
    private $balanceTransaction;

    /**
     * @var string $emailReceipt Email for the receipt
     *
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank()
     * @Assert\Email()
     * @Groups({"payment:output"})
     */
    private $emailReceipt;

    /**
     * @var string $source Source (Credit or Debit card). A hash describing that card
     *
     * @ORM\Column(type="string", length=30, nullable=true)
     * @Assert\NotBlank()
     * @Groups({"payment:output"})
     */
    private $source;

    /**
     * @var Bill $bill Bill registered for this payment
     *
     * @ORM\ManyToOne(targetEntity="App\Entity\Bill", inversedBy="payments", cascade={"persist"})
     * @ORM\JoinColumn(nullable=false)
     * @Assert\Type("App\Entity\Bill")
     * @Assert\NotNull()
     * @Groups({"payment:output"})
     */
    private $bill;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"payment:output"})
     */
    private $sessionId;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"payment:output"})
     */
    private $paymentIntent;

    public function __construct()
    {
        $this->amountRefund = 0;
        $this->amount = 0;
    }

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

    public function getSessionId(): ?string
    {
        return $this->sessionId;
    }

    public function setSessionId(string $sessionId): self
    {
        $this->sessionId = $sessionId;

        return $this;
    }

    public function getPaymentIntent(): ?string
    {
        return $this->paymentIntent;
    }

    public function setPaymentIntent(string $paymentIntent): self
    {
        $this->paymentIntent = $paymentIntent;

        return $this;
    }
}
