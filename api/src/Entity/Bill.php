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
 * @ORM\Table(name="bjmkt_bill")
 * @ORM\Entity(repositoryClass="App\Repository\BillRepository")
 *
 * Héritage de cette classe : "Bill customer", "Bill supplier" et "Bill refund" hériteront des attributs de cette classe
 *
 * @ORM\InheritanceType("JOINED")
 * @ORM\DiscriminatorColumn(name="billType", type="string", length=30)
 * @ORM\DiscriminatorMap({"bill"="Bill", "customer"="BillCustomer", "supplier"="BillSupplier", "refund"="BillRefund"})
 */
class Bill
{
    public const TYPE_CUSTOMER_BILL = 'customer';

    public const TYPE_SUPPLIER_BILL = 'supplier';

    public const TYPE_REFUND_BILL = 'refund';

    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @var string $status Status of this bill
     *
     * @ORM\Column(type="string", length=100)
     * @Assert\Choice({"completed","paid","pending","failed","withdrawn"})
     * @Groups({"bill_customer:output","bill_refund:output","bill_supplier:output","payment:output"})
     */
    private $status;

    /**
     * @var string $reference Reference (unique) of this bill
     *
     * @ORM\Column(type="string", length=30, unique=true)
     * @Assert\NotBlank()
     * @Groups({"bill_customer:output","bill_refund:output","bill_supplier:output","payment:output"})
     */
    private $reference;

    /**
     * @var \DateTime $dateCreated Creation's date of this bill
     *
     * @ORM\Column(type="datetime")
     * @Assert\Type("DateTime")
     * @Groups({"bill_customer:output","bill_refund:output","bill_supplier:output","payment:output"})
     */
    private $dateCreated;

    /**
     * @var \DateTime $datePayment Date of the payment:output of this bill
     *
     * @ORM\Column(type="datetime", nullable=true)
     * @Assert\Type("DateTime")
     * @Groups({"bill_customer:output","bill_refund:output","bill_supplier:output","payment:output"})
     */
    private $datePayment;

    /**
     * @var string $currencyUsed Currency used for this bill
     *
     * @ORM\Column(type="string", length=3)
     * @Assert\Currency()
     * @Groups({"bill_customer:output","bill_refund:output","bill_supplier:output","payment:output"})
     */
    private $currencyUsed;

    /**
     * @var float $vatRateUsed VAT rate used for this bill
     *
     * @ORM\Column(type="float")
     * @Assert\Type("float")
     * @Groups({"bill_customer:output","bill_refund:output","bill_supplier:output","payment:output"})
     */
    private $vatRateUsed;

    /**
     * @var float $totalExclTax Total exclude tax
     *
     * @ORM\Column(type="float")
     * @Assert\Type("float")
     * @Groups({"bill_customer:output","bill_refund:output","bill_supplier:output","payment:output"})
     */
    private $totalExclTax;

    /**
     * @var float $totalInclTax Total include tax
     *
     * @ORM\Column(type="float")
     * @Assert\Type("float")
     * @Groups({"bill_customer:output","bill_refund:output","bill_supplier:output","payment:output"})
     */
    private $totalInclTax;

    /**
     * @var string $url URL to the pdf format of this bill
     *
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank()
     * @Groups({"bill_customer:output","bill_refund:output","bill_supplier:output","payment:output"})
     */
    private $url;

    /**
     * @var Payment $payment Payment associated to this bill
     *
     * @ORM\OneToOne(targetEntity="App\Entity\Payment", mappedBy="bill", cascade={"persist", "remove"})
     * @Assert\NotNull()
     * @Groups({"bill_customer:output","bill_refund:output","bill_supplier:output"})
     */
    private $payment;

    public function __construct()
    {
        $this->vatRateUsed = 0;
        $this->totalInclTax = 0;
        $this->totalExclTax = 0;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getBillType() :string
    {
        return $this->billType;
    }

    public function setBillType(string $billType): self
    {
        $this->billType = $billType;

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

    /**
     * @return string
     */
    public function getReference(): string
    {
        return $this->reference;
    }

    /**
     * @param string $reference
     */
    public function setReference(string $reference): void
    {
        $this->reference = $reference;
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

    public function getDatePayment(): ?\DateTimeInterface
    {
        return $this->datePayment;
    }

    public function setDatePayment(?\DateTimeInterface $datePayment): self
    {
        $this->datePayment = $datePayment;

        return $this;
    }

    public function getCurrencyUsed(): ?string
    {
        return $this->currencyUsed;
    }

    public function setCurrencyUsed(string $currencyUsed): self
    {
        $this->currencyUsed = $currencyUsed;

        return $this;
    }

    public function getVatRateUsed(): ?float
    {
        return $this->vatRateUsed;
    }

    public function setVatRateUsed(float $vatRateUsed): self
    {
        $this->vatRateUsed = $vatRateUsed;

        return $this;
    }

    public function getTotalExclTax(): ?float
    {
        return $this->totalExclTax;
    }

    public function setTotalExclTax(float $totalExclTax): self
    {
        $this->totalExclTax = $totalExclTax;

        return $this;
    }

    public function getTotalInclTax(): ?float
    {
        return $this->totalInclTax;
    }

    public function setTotalInclTax(float $totalInclTax): self
    {
        $this->totalInclTax = $totalInclTax;

        return $this;
    }

    public function getUrl(): ?string
    {
        return $this->url;
    }

    public function setUrl(string $url): self
    {
        $this->url = $url;

        return $this;
    }

    public function getPayment(): ?Payment
    {
        return $this->payment;
    }

    public function setPayment(Payment $payment): self
    {
        $this->payment = $payment;

        // set the owning side of the relation if necessary
        if ($this !== $payment->getBill()) {
            $payment->setBill($this);
        }

        return $this;
    }
}
