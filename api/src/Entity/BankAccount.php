<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Annotation\ApiResource;

/**
 * @ApiResource()
 * @ORM\Table(name="bjmkt_bank_account")
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
     * @var string $idCard ID of this card on Stripe platform
     *
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank()
     */
    private $idCard;

    /**
     * @var string $brand Brand of this card
     *
     * @ORM\Column(type="string", length=50)
     * @Assert\NotBlank()
     */
    private $brand;

    /**
     * @var string $countryCode Country code of the owner
     *
     * @ORM\Column(type="string", length=4)
     * @Assert\NotBlank()
     */
    private $countryCode;

    /**
     * @var integer $last4 Last 4 digit of the card number
     *
     * @ORM\Column(type="integer")
     * @Assert\Type("integer")
     */
    private $last4;

    /**
     * @var integer $expiry_month Expiry month of this card
     *
     * @ORM\Column(type="smallint")
     * @Assert\Type("integer")
     * @Assert\Range(
     *     min=0,
     *     max=12,
     *     minMessage="The minimum value for the expiry month is {{ limit }}. \n The current value is {{ value }}",
     *     maxMessage="The maximum value for the expiry month is {{ limit }}.\nThe current value is {{ value }}"
     * )
     */
    private $expiry_month;

    /**
     * @var integer $expiryYear Expiry year of this card
     *
     * @ORM\Column(type="smallint")
     * @Assert\Type("integer")
     * @Assert\Range(
     *     min=2019,
     *     max=3000,
     *     minMessage="The minimum value for the expiry year is {{ limit }}.\nThe current value is {{ value }}",
     *     maxMessage="The maximum value for the expiry year is {{ limit }}.\nThe current value is {{ value }}"
     * )
     */
    private $expiryYear;

    /**
     * @var string $fingerprint Fingerprint of this card
     *
     * @ORM\Column(type="string", length=50)
     * @Assert\NotBlank()
     */
    private $fingerprint;

    /**
     * @var string $funding Funding type of this card (e.g. credit, debit)
     *
     * @ORM\Column(type="string", length=50)
     * @Assert\Choice({"credit","debit"})
     */
    private $funding;

    /**
     * @var float $accountBalance Account's balance of this card
     *
     * @ORM\Column(type="float", nullable=true)
     * @Assert\Type("float")
     */
    private $accountBalance;

    /**
     * @var User|Customer|Supplier $user User who owned this card
     *
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="bankAccounts")
     * @ORM\JoinColumn(nullable=false)
     * @Assert\NotNull()
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
