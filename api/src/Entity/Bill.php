<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\BillRepository")
 */
class Bill
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=100)
     */
    private $status;

    /**
     * @ORM\Column(type="datetime")
     */
    private $dateCreated;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $datePayment;

    /**
     * @ORM\Column(type="string", length=4)
     */
    private $currencyUsed;

    /**
     * @ORM\Column(type="float")
     */
    private $vatRateUsed;

    /**
     * @ORM\Column(type="float")
     */
    private $totalExclTax;

    /**
     * @ORM\Column(type="float")
     */
    private $totalInclTax;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $url;

    /**
     * @ORM\OneToOne(targetEntity="App\Entity\Payment", mappedBy="bill", cascade={"persist", "remove"})
     */
    private $payment;

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
