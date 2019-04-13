<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ApiResource()
 * @ORM\Entity(repositoryClass="App\Repository\ShipperRepository")
 */
class Shipper
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
    private $name;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $socialReason;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $service;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $tradeRegisterNumber;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $vatNumber;

    /**
     * @ORM\Column(type="text")
     */
    private $description;

    /**
     * @ORM\Column(type="text")
     */
    private $deliveryCommitment;

    /**
     * @ORM\Column(type="string", length=50)
     */
    private $contactNumber;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Address", mappedBy="shipper")
     */
    private $addresses;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\DeliveryGlobal", mappedBy="shipper")
     */
    private $globalDeliveries;

    public function __construct()
    {
        $this->addresses = new ArrayCollection();
        $this->globalDeliveries = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
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

    public function getService(): ?string
    {
        return $this->service;
    }

    public function setService(string $service): self
    {
        $this->service = $service;

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

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getDeliveryCommitment(): ?string
    {
        return $this->deliveryCommitment;
    }

    public function setDeliveryCommitment(string $deliveryCommitment): self
    {
        $this->deliveryCommitment = $deliveryCommitment;

        return $this;
    }

    public function getContactNumber(): ?string
    {
        return $this->contactNumber;
    }

    public function setContactNumber(string $contactNumber): self
    {
        $this->contactNumber = $contactNumber;

        return $this;
    }

    /**
     * @return Collection|Address[]
     */
    public function getAddresses(): Collection
    {
        return $this->addresses;
    }

    public function addAddress(Address $address): self
    {
        if (!$this->addresses->contains($address)) {
            $this->addresses[] = $address;
            $address->setShipper($this);
        }

        return $this;
    }

    public function removeAddress(Address $address): self
    {
        if ($this->addresses->contains($address)) {
            $this->addresses->removeElement($address);
            // set the owning side to null (unless already changed)
            if ($address->getShipper() === $this) {
                $address->setShipper(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|DeliveryGlobal[]
     */
    public function getGlobalDeliveries(): Collection
    {
        return $this->globalDeliveries;
    }

    public function addGlobalDelivery(DeliveryGlobal $globalDelivery): self
    {
        if (!$this->globalDeliveries->contains($globalDelivery)) {
            $this->globalDeliveries[] = $globalDelivery;
            $globalDelivery->setShipper($this);
        }

        return $this;
    }

    public function removeGlobalDelivery(DeliveryGlobal $globalDelivery): self
    {
        if ($this->globalDeliveries->contains($globalDelivery)) {
            $this->globalDeliveries->removeElement($globalDelivery);
            // set the owning side to null (unless already changed)
            if ($globalDelivery->getShipper() === $this) {
                $globalDelivery->setShipper(null);
            }
        }

        return $this;
    }
}
