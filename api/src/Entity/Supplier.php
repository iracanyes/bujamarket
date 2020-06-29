<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ApiResource(attributes={
       "normalization_context"={"groups"={"supplier:output"}},
 *     "denormalization_context"={"groups"={"supplier:input"}}
 * })
 * @ApiFilter(SearchFilter::class, properties={"brandName":"partial"})
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
     * @Groups({"supplier:output", "supplier_product:output"})
     */
    private $id;

    /**
     * @var string $socialReason Social reason of this supplier
     *
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank()
     * @Groups({"profile:output","supplier:output","supplier_product:output"})
     */
    private $socialReason;

    /**
     * @var string $brandName Commercial name/Trade name used by this supplier
     *
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank()
     * @Groups({"profile:output","supplier:output","supplier_product:output"})
     */
    private $brandName;

    /**
     * @var string $tradeRegistryNumber Trade registry number
     *
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank()
     * @Groups({"profile:output","supplier:output"})
     */
    private $tradeRegistryNumber;

    /**
     * @var string $vatNumber VAT number of this supplier
     *
     * @ORM\Column(type="string", length=30)
     * @Assert\NotBlank()
     * @Groups({"profile:output","supplier:output"})
     */
    private $vatNumber;

    /**
     * @var string $contactFullname Fullname of the contact's person
     *
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank()
     * @Groups({"profile:output","supplier:output"})
     */
    private $contactFullname;

    /**
     * @var string $contactPhoneNumber Phone number of this supplier
     * @ORM\Column(type="string", length=50)
     * @Assert\NotBlank()
     * @Groups({"profile:output","supplier:output"})
     */
    private $contactPhoneNumber;

    /**
     * @var string $contactEmail Email for contacting this supplier
     *
     * @ORM\Column(type="string", length=255)
     * @Assert\Email()
     * @Groups({"profile:output","supplier:output"})
     */
    private $contactEmail;

    /**
     * @var string $website Website URL of this supplier
     *
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Assert\Url()
     * @Groups({"profile:output","supplier:output"})
     */
    private $website;

    /**
     * @var string $supplierKey Supplier key on Stripe platform
     *
     * @ORM\Column(type="string", length=255)
     */
    private $supplierKey;

    /**
     * @var Collection $supplierProducts Supplier products
     * @ORM\OneToMany(targetEntity="App\Entity\SupplierProduct", mappedBy="supplier", orphanRemoval=true)
     * @Groups({"supplier:output"})
     * @ApiSubresource()
     */
    private $supplierProducts;


    public function __construct()
    {
        parent::__construct();
        $this->supplierProducts = new ArrayCollection();
    }

    public function getUserType(): string
    {
        return $this::TYPE_SUPPLIER;
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

    /**
     * @return string
     */
    public function getBrandName(): string
    {
        return $this->brandName;
    }

    /**
     * @param string $brandName
     */
    public function setBrandName(string $brandName): self
    {
        $this->brandName = $brandName;

        return $this;
    }



    public function getTradeRegistryNumber(): ?string
    {
        return $this->tradeRegistryNumber;
    }

    public function setTradeRegistryNumber(string $tradeRegistryNumber): self
    {
        $this->tradeRegistryNumber = $tradeRegistryNumber;

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
