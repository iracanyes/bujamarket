<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\WithdrawalRepository")
 */
class Withdrawal
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=100)
     */
    private $status;

    /**
     * @ORM\Column(type="datetime")
     */
    private $dateCreated;

    /**
     * @ORM\Column(type="boolean")
     */
    private $isValid;

    /**
     * @ORM\Column(type="boolean", nullable=true)
     */
    private $orderDelivered;

    /**
     * @ORM\OneToOne(targetEntity="App\Entity\BillRefund", inversedBy="withdrawal", cascade={"persist", "remove"})
     */
    private $billRefund;

    /**
     * @ORM\OneToOne(targetEntity="App\Entity\OrderDetail", inversedBy="withdrawal", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     */
    private $orderDetail;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getDateCreated(): ?\DateTimeInterface
    {
        return $this->dateCreated;
    }

    public function setDateCreated(\DateTimeInterface $dateCreated): self
    {
        $this->dateCreated = $dateCreated;

        return $this;
    }

    public function getIsValid(): ?bool
    {
        return $this->isValid;
    }

    public function setIsValid(bool $isValid): self
    {
        $this->isValid = $isValid;

        return $this;
    }

    public function getOrderDelivered(): ?bool
    {
        return $this->orderDelivered;
    }

    public function setOrderDelivered(?bool $orderDelivered): self
    {
        $this->orderDelivered = $orderDelivered;

        return $this;
    }

    public function getBillRefund(): ?BillRefund
    {
        return $this->billRefund;
    }

    public function setBillRefund(?BillRefund $billRefund): self
    {
        $this->billRefund = $billRefund;

        return $this;
    }

    public function getOrderDetail(): ?OrderDetail
    {
        return $this->orderDetail;
    }

    public function setOrderDetail(OrderDetail $orderDetail): self
    {
        $this->orderDetail = $orderDetail;

        return $this;
    }
}
