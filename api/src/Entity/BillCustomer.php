<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\BillCustomerRepository")
 */
class BillCustomer
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="float")
     */
    private $additionalCost;

    /**
     * @ORM\Column(type="float")
     */
    private $additionalFee;

    /**
     * @ORM\Column(type="float")
     */
    private $totalShippingCost;

    /**
     * @ORM\OneToOne(targetEntity="App\Entity\OrderGlobal", inversedBy="billCustomer", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     */
    private $orderGlobal;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Customer", inversedBy="customerBills")
     * @ORM\JoinColumn(nullable=false)
     */
    private $customer;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAdditionalCost(): ?float
    {
        return $this->additionalCost;
    }

    public function setAdditionalCost(float $additionalCost): self
    {
        $this->additionalCost = $additionalCost;

        return $this;
    }

    public function getAdditionalFee(): ?float
    {
        return $this->additionalFee;
    }

    public function setAdditionalFee(float $additionalFee): self
    {
        $this->additionalFee = $additionalFee;

        return $this;
    }

    public function getTotalShippingCost(): ?float
    {
        return $this->totalShippingCost;
    }

    public function setTotalShippingCost(float $totalShippingCost): self
    {
        $this->totalShippingCost = $totalShippingCost;

        return $this;
    }

    public function getOrderGlobal(): ?OrderGlobal
    {
        return $this->orderGlobal;
    }

    public function setOrderGlobal(OrderGlobal $orderGlobal): self
    {
        $this->orderGlobal = $orderGlobal;

        return $this;
    }

    public function getCustomer(): ?Customer
    {
        return $this->customer;
    }

    public function setCustomer(?Customer $customer): self
    {
        $this->customer = $customer;

        return $this;
    }
}
