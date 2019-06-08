<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;


/**
 * @ApiResource()
 * @ORM\Table(name="bjmkt_shipper")
 * @ORM\Entity(repositoryClass="App\Repository\ShipperRepository")
 */
class Shipper
{
    /**
     * @var integer $id ID of this shipper
     *
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @var string $name Commercial name of this shipper
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank()
     */
    private $name;

    /**
     * @var string $socialReason Social Reason of this shipper
     *
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank()
     */
    private $socialReason;

    /**
     * @var string $service Service offered by this shipper
     *
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank()
     */
    private $service;

    /**
     * @var string $tradeRegisterNumber Trade register number of this shipper
     *
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank()
     */
    private $tradeRegisterNumber;

    /**
     * @var string $vatNumber VAT number of this shipper
     *
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank()
     */
    private $vatNumber;

    /**
     * @var string $description Complete description of the service offered
     *
     * @ORM\Column(type="text")
     * @Assert\NotBlank()
     */
    private $description;

    /**
     * @var string $deliveryCommitment Delivery commitment for this service
     *
     * @ORM\Column(type="text")
     * @Assert\NotBlank()
     */
    private $deliveryCommitment;

    /**
     * @var string $contactNumber Contact number for this service
     *
     * @ORM\Column(type="string", length=50)
     * @Assert\NotBlank()
     */
    private $contactNumber;

    /**
     * @var Collection $addresses Addresses of this shipper
     * @ORM\OneToMany(targetEntity="App\Entity\Address", mappedBy="shipper")
     */
    private $addresses;

    /**
     * @var Collection $globalDeliveries Global deliveries made by this shipper
     *
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
