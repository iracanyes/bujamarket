<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;

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
     * @Groups({"profile:output"})
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
     * @var string $ownerFullname Bank account owner fullname
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank
     * @Groups({"profile:output"})
     */
    private $ownerFullname;

    /**
     * @var string $brand Brand of this card (Bank name)
     *
     * @ORM\Column(type="string", length=50, nullable=true)
     * @Assert\NotBlank()
     * @Groups({"profile:output"})
     */
    private $brand;

    /**
     * @var string $countryCode Country code of the owner (ISO3166-1Alpha2)
     *
     * @ORM\Column(type="string", length=4)
     * @Assert\NotBlank()
     * @Groups({"profile:output"})
     */
    private $countryCode;

    /**
     * @var integer $last4 Last 4 digit of the card number
     *
     * @ORM\Column(type="integer")
     * @Assert\Type("integer")
     * @Groups({"profile:output"})
     */
    private $last4;

    /**
     * @var integer $expiryMonth Expiry month of this card
     *
     * @ORM\Column(type="smallint", nullable=true)
     * @Assert\Type("integer")
     * @Assert\Range(
     *     min=0,
     *     max=12,
     *     minMessage="The minimum value for the expiry month is {{ limit }}. \n The current value is {{ value }}",
     *     maxMessage="The maximum value for the expiry month is {{ limit }}.\nThe current value is {{ value }}"
     * )
     * @Groups({"profile:output"})
     */
    private $expiryMonth;

    /**
     * @var integer $expiryYear Expiry year of this card
     *
     * @ORM\Column(type="smallint", nullable=true)
     * @Assert\Type("integer")
     * @Assert\Range(
     *     min=2019,
     *     max=3000,
     *     minMessage="The minimum value for the expiry year is {{ limit }}.\nThe current value is {{ value }}",
     *     maxMessage="The maximum value for the expiry year is {{ limit }}.\nThe current value is {{ value }}"
     * )
     * @Groups({"profile:output"})
     */
    private $expiryYear;

    /**
     * @var string $fingerprint Fingerprint of this card
     *
     * @ORM\Column(type="string", length=50, nullable=true)
     *
     */
    private $fingerprint;

    /**
     * @var string $funding Funding type of this card (e.g. credit, debit)
     *
     * @ORM\Column(type="string", length=50)
     * @Assert\Choice({"credit","debit"})
     * @Groups({"profile:output"})
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

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $mandate;

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

    /**
     * @param string|null $brand
     * @return $this
     */
    public function setBrand($brand): self
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
        return $this->expiryMonth;
    }

    /**
     * @param int|null $expiryMonth
     * @return $this
     */
    public function setExpiryMonth($expiryMonth): self
    {
        $this->expiryMonth = $expiryMonth;

        return $this;
    }

    public function getExpiryYear(): ?int
    {
        return $this->expiryYear;
    }

    /**
     * @param int|null $expiryYear
     * @return $this
     */
    public function setExpiryYear($expiryYear): self
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

    public function getOwnerFullname(): ?string
    {
        return $this->ownerFullname;
    }

    public function setOwnerFullname(string $ownerFullname): self
    {
        $this->ownerFullname = $ownerFullname;

        return $this;
    }

    public function getMandate(): ?string
    {
        return $this->mandate;
    }

    public function setMandate(?string $mandate): self
    {
        $this->mandate = $mandate;

        return $this;
    }
}
