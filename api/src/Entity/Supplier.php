<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ApiResource()
 * @ORM\Entity(repositoryClass="App\Repository\SupplierRepository")
 */
class Supplier
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
    private $socialReason;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $tradeRegisterNumber;

    /**
     * @ORM\Column(type="string", length=30)
     */
    private $vatNumber;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $contactFullname;

    /**
     * @ORM\Column(type="string", length=50)
     */
    private $contactPhoneNumber;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $contactEmail;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $website;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\SupplierProduct", mappedBy="supplier", orphanRemoval=true)
     */
    private $supplierProducts;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\BillSupplier", mappedBy="supplier", orphanRemoval=true)
     */
    private $supplierBills;

    public function __construct()
    {
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
}
