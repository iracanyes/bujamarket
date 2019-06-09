<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ApiResource()
 * @ORM\Table(name="bjmkt_supplier")
 * @ORM\Entity(repositoryClass="App\Repository\SupplierRepository")
 */
class Supplier extends User
{
    /**
     * @var integer $id ID of this supplier
     *
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @var integer $socialReason Social reason of this supplier
     *
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank()
     */
    private $socialReason;

    /**
     * @var string $tradeRegisterNumber Trade register number
     *
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank()
     */
    private $tradeRegisterNumber;

    /**
     * @var string $vatNumber VAT number of this supplier
     *
     * @ORM\Column(type="string", length=30)
     * @Assert\NotBlank()
     */
    private $vatNumber;

    /**
     * @var string $contactFullname Fullname of the contact's person
     *
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank()
     */
    private $contactFullname;

    /**
     * @var string $contactPhoneNumber Phone number of this supplier
     * @ORM\Column(type="string", length=50)
     * @Assert\NotBlank()
     */
    private $contactPhoneNumber;

    /**
     * @var string $contactEmail Email for contacting this supplier
     *
     * @ORM\Column(type="string", length=255)
     * @Assert\Email()
     */
    private $contactEmail;

    /**
     * @var string $website Website URL of this supplier
     *
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Assert\Url()
     */
    private $website;

    /**
     * @var string $supplierKey Supplier key on Stripe platform
     *
     * @ORM\Column(type="string", length=50)
     */
    private $supplierKey;

    /**
     * @var Collection $supplierProducts Supplier products
     * @ORM\OneToMany(targetEntity="App\Entity\SupplierProduct", mappedBy="supplier", orphanRemoval=true)
     */
    private $supplierProducts;

    /**
     * @var Collection $supplierBills Supplier bills received for product purchased
     *
     * @ORM\OneToMany(targetEntity="App\Entity\BillSupplier", mappedBy="supplier", orphanRemoval=true)
     */
    private $supplierBills;



    public function __construct()
    {
        User::__construct();
        $this->supplierProducts = new ArrayCollection();
        $this->supplierBills = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSocialReason(): ?string
    {
        return $this->socialReason;
    }

    public function setSocialReason(string $socialReason): self
    {
        $this->socialReason = $socialReason;

        return $this;
    }

    public function getTradeRegisterNumber(): ?string
    {
        return $this->tradeRegisterNumber;
    }

    public function setTradeRegisterNumber(string $tradeRegisterNumber): self
    {
        $this->tradeRegisterNumber = $tradeRegisterNumber;

        return $this;
    }

    public function getVatNumber(): ?string
    {
        return $this->vatNumber;
    }

    public function setVatNumber(string $vatNumber): self
    {
        $this->vatNumber = $vatNumber;

        return $this;
    }

    public function getContactFullname(): ?string
    {
        return $this->contactFullname;
    }

    public function setContactFullname(string $contactFullname): self
    {
        $this->contactFullname = $contactFullname;

        return $this;
    }

    public function getContactPhoneNumber(): ?string
    {
        return $this->contactPhoneNumber;
    }

    public function setContactPhoneNumber(string $contactPhoneNumber): self
    {
        $this->contactPhoneNumber = $contactPhoneNumber;

        return $this;
    }

    public function getContactEmail(): ?string
    {
        return $this->contactEmail;
    }

    public function setContactEmail(string $contactEmail): self
    {
        $this->contactEmail = $contactEmail;

        return $this;
    }

    public function getWebsite(): ?string
    {
        return $this->website;
    }

    public function setWebsite(?string $website): self
    {
        $this->website = $website;

        return $this;
    }

    /**
     * @return Collection|SupplierProduct[]
     */
    public function getSupplierProducts(): Collection
    {
        return $this->supplierProducts;
    }

    public function addSupplierProduct(SupplierProduct $supplierProduct): self
    {
        if (!$this->supplierProducts->contains($supplierProduct)) {
            $this->supplierProducts[] = $supplierProduct;
            $supplierProduct->setSupplier($this);
        }

        return $this;
    }

    public function removeSupplierProduct(SupplierProduct $supplierProduct): self
    {
        if ($this->supplierProducts->contains($supplierProduct)) {
            $this->supplierProducts->removeElement($supplierProduct);
            // set the owning side to null (unless already changed)
            if ($supplierProduct->getSupplier() === $this) {
                $supplierProduct->setSupplier(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|BillSupplier[]
     */
    public function getSupplierBills(): Collection
    {
        return $this->supplierBills;
    }

    public function addSupplierBill(BillSupplier $supplierBill): self
    {
        if (!$this->supplierBills->contains($supplierBill)) {
            $this->supplierBills[] = $supplierBill;
            $supplierBill->setSupplier($this);
        }

        return $this;
    }

    public function removeSupplierBill(BillSupplier $supplierBill): self
    {
        if ($this->supplierBills->contains($supplierBill)) {
            $this->supplierBills->removeElement($supplierBill);
            // set the owning side to null (unless already changed)
            if ($supplierBill->getSupplier() === $this) {
                $supplierBill->setSupplier(null);
            }
        }

        return $this;
    }

    public function getSupplierKey(): ?string
    {
        return $this->supplierKey;
    }

    public function setSupplierKey(string $supplierKey): self
    {
        $this->supplierKey = $supplierKey;

        return $this;
    }
}
