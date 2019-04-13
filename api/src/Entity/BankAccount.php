<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\BankAccountRepository")
 */
class BankAccount
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
    private $idCard;

    /**
     * @ORM\Column(type="string", length=50)
     */
    private $brand;

    /**
     * @ORM\Column(type="string", length=4)
     */
    private $countryCode;

    /**
     * @ORM\Column(type="integer")
     */
    private $last4;

    /**
     * @ORM\Column(type="smallint")
     */
    private $expiry_month;

    /**
     * @ORM\Column(type="smallint")
     */
    private $expiryYear;

    /**
     * @ORM\Column(type="string", length=50)
     */
    private $fingerprint;

    /**
     * @ORM\Column(type="string", length=50)
     */
    private $funding;

    /**
     * @ORM\Column(type="float", nullable=true)
     */
    private $accountBalance;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="bankAccounts")
     * @ORM\JoinColumn(nullable=false)
     */
    private $user;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getIdCard(): ?string
    {
        return $this->idCard;
    }

    public function setIdCard(string $idCard): self
    {
        $this->idCard = $idCard;

        return $this;
    }

    public function getBrand(): ?string
    {
        return $this->brand;
    }

    public function setBrand(string $brand): self
    {
        $this->brand = $brand;

        return $this;
    }

    public function getCountryCode(): ?string
    {
        return $this->countryCode;
    }

    public function setCountryCode(string $countryCode): self
    {
        $this->countryCode = $countryCode;

        return $this;
    }

    public function getLast4(): ?int
    {
        return $this->last4;
    }

    public function setLast4(int $last4): self
    {
        $this->last4 = $last4;

        return $this;
    }

    public function getExpiryMonth(): ?int
    {
        return $this->expiry_month;
    }

    public function setExpiryMonth(int $expiry_month): self
    {
        $this->expiry_month = $expiry_month;

        return $this;
    }

    public function getExpiryYear(): ?int
    {
        return $this->expiryYear;
    }

    public function setExpiryYear(int $expiryYear): self
    {
        $this->expiryYear = $expiryYear;

        return $this;
    }

    public function getFingerprint(): ?string
    {
        return $this->fingerprint;
    }

    public function setFingerprint(string $fingerprint): self
    {
        $this->fingerprint = $fingerprint;

        return $this;
    }

    public function getFunding(): ?string
    {
        return $this->funding;
    }

    public function setFunding(string $funding): self
    {
        $this->funding = $funding;

        return $this;
    }

    public function getAccountBalance(): ?float
    {
        return $this->accountBalance;
    }

    public function setAccountBalance(?float $accountBalance): self
    {
        $this->accountBalance = $accountBalance;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }
}
