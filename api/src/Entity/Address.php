<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;
use App\Validator\Constraints as MyAssert;

/**
 * @ApiResource(attributes={
 *     "normalization_context"={"groups"={"address:output","profile:output","order_set:output","order_detail:output"}}
 * })
 * @ORM\Table(name="bjmkt_address")
 * @ORM\Entity(repositoryClass="App\Repository\AddressRepository")
 */
class Address
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"address:output","profile:output","order_set:output","order_detail:output"})
     */
    private $id;

    /**
     * @var string $locationName Name of this location (e.g. Home, Head office, Delivery address)
     *
     * @ORM\Column(type="string", length=255)
     * @Assert\Choice({"Head office","Delivery address","Shipping address","Deposit address","Billing address"})
     * @Groups({"address:output","supplier:output","profile:output","order_set:output","order_detail:output"})
     */
    private $locationName;

    /**
     * @var string $street Street name
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank()
     * @Groups({"address:output","supplier:output","profile:output","order_set:output","order_detail:output"})
     */
    private $street;

    /**
     * @var string $number Address's number
     * @ORM\Column(type="string", length=50)
     * @Assert\NotBlank()
     * @Groups({"address:output","supplier:output","profile:output","order_set:output","order_detail:output"})
     */
    private $number;

    /**
     * @var string $state State, District
     *
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank()
     * @Groups({"address:output","supplier:output","profile:output","order_set:output","order_detail:output"})
     */
    private $state;

    /**
     * @var string $town Address's Town
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank()
     * @Groups({"address:output","supplier:output","profile:output","order_set:output","order_detail:output"})
     */
    private $town;

    /**
     * @var string $zipCode Zip code
     * @ORM\Column(type="string", length=50)
     * @Assert\NotBlank()
     * @Groups({"address:output","supplier:output","profile:output","order_set:output","order_detail:output"})
     */
    private $zipCode;

    /**
     * @var string $country Country
     * @ORM\Column(type="string", length=255)
     * @MyAssert\ISOCountry()
     *
     * @Groups({"address:output","supplier:output","profile:output","order_set:output","order_detail:output"})
     */
    private $country;

    /**
     * @var User|Customer|Supplier $user User located at this address
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="addresses")
     */
    private $user;

    /**
     * @var Shipper $shipper Shipper located at this address
     *
     * @ORM\OneToOne(targetEntity="App\Entity\Shipper", inversedBy="address")
     */
    private $shipper;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\OrderSet", mappedBy="address")
     */
    private $orderSets;

    public function __construct()
    {
        $this->orderSets = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getLocationName(): ?string
    {
        return $this->locationName;
    }

    public function setLocationName(string $locationName): self
    {
        $this->locationName = $locationName;

        return $this;
    }

    public function getStreet(): ?string
    {
        return $this->street;
    }

    public function setStreet(string $street): self
    {
        $this->street = $street;

        return $this;
    }

    public function getNumber(): ?string
    {
        return $this->number;
    }

    public function setNumber(string $number): self
    {
        $this->number = $number;

        return $this;
    }

    public function getState(): ?string
    {
        return $this->state;
    }

    public function setState(string $state): self
    {
        $this->state = $state;

        return $this;
    }

    public function getTown(): ?string
    {
        return $this->town;
    }

    public function setTown(string $town): self
    {
        $this->town = $town;

        return $this;
    }

    public function getZipCode(): ?string
    {
        return $this->zipCode;
    }

    public function setZipCode(string $zipCode): self
    {
        $this->zipCode = $zipCode;

        return $this;
    }

    public function getCountry(): ?string
    {
        return $this->country;
    }

    public function setCountry(string $country): self
    {
        $this->country = $country;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    /**
     * @param User|Customer|Supplier|? $user
     * @return Address
     */
    public function setUser($user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getShipper(): ?Shipper
    {
        return $this->shipper;
    }

    public function setShipper(?Shipper $shipper): self
    {
        $this->shipper = $shipper;

        return $this;
    }

    /**
     * @return Collection|OrderSet[]
     */
    public function getOrderSets(): Collection
    {
        return $this->orderSets;
    }

    public function addOrderSet(OrderSet $orderSet): self
    {
        if (!$this->orderSets->contains($orderSet)) {
            $this->orderSets[] = $orderSet;
            $orderSet->setAddress($this);
        }

        return $this;
    }

    public function removeOrderSet(OrderSet $orderSet): self
    {
        if ($this->orderSets->contains($orderSet)) {
            $this->orderSets->removeElement($orderSet);
            // set the owning side to null (unless already changed)
            if ($orderSet->getAddress() === $this) {
                $orderSet->setAddress(null);
            }
        }

        return $this;
    }
}
