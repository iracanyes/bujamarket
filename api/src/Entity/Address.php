<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Annotation\ApiResource;


/**
 * @ApiResource()
 * @ORM\Table(name="bjmkt_address")
 * @ORM\Entity(repositoryClass="App\Repository\AddressRepository")
 */
class Address
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @var string $locationName Name of this location (e.g. Home, Head office, Delivery address)
     *
     * @ORM\Column(type="string", length=255)
     * @Assert\Choice({"Résidence","Adresse de dépôt","Siége social"})
     */
    private $locationName;

    /**
     * @var string $street Street name
     * @ORM\Column(type="string", length=255)
     */
    private $street;

    /**
     * @var string $number Address's number
     * @ORM\Column(type="string", length=50)
     */
    private $number;

    /**
     * @var string $state State, District
     *
     * @ORM\Column(type="string", length=255)
     */
    private $state;

    /**
     * @var string $town Address's Town
     * @ORM\Column(type="string", length=255)
     */
    private $town;

    /**
     * @var string $zipCode Zip code
     * @ORM\Column(type="string", length=30)
     */
    private $zipCode;

    /**
     * @var string $country Country
     * @ORM\Column(type="string", length=255)
     * @Assert\Country()
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
     * @ORM\ManyToOne(targetEntity="App\Entity\Shipper", inversedBy="addresses")
     */
    private $shipper;

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

    public function getNumber(): ?int
    {
        return $this->number;
    }

    public function setNumber(int $number): self
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

    public function getZipCode(): ?int
    {
        return $this->zipCode;
    }

    public function setZipCode(int $zipCode): self
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
}
