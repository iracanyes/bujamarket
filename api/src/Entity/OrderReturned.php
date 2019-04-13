<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\OrderReturnedRepository")
 */
class OrderReturned
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="text")
     */
    private $description;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $reason;

    /**
     * @ORM\Column(type="boolean")
     */
    private $isIntact;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $fileUrl;

    /**
     * @ORM\OneToOne(targetEntity="App\Entity\OrderDetail", inversedBy="orderReturned", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     */
    private $orderDetail;

    /**
     * @ORM\OneToOne(targetEntity="App\Entity\BillRefund", inversedBy="orderReturned", cascade={"persist", "remove"})
     */
    private $billRefund;

    public function getId(): ?int
    {
        return $this->id;
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

    public function getReason(): ?string
    {
        return $this->reason;
    }

    public function setReason(string $reason): self
    {
        $this->reason = $reason;

        return $this;
    }

    public function getIsIntact(): ?bool
    {
        return $this->isIntact;
    }

    public function setIsIntact(bool $isIntact): self
    {
        $this->isIntact = $isIntact;

        return $this;
    }

    public function getFileUrl(): ?string
    {
        return $this->fileUrl;
    }

    public function setFileUrl(string $fileUrl): self
    {
        $this->fileUrl = $fileUrl;

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

    public function getBillRefund(): ?BillRefund
    {
        return $this->billRefund;
    }

    public function setBillRefund(?BillRefund $billRefund): self
    {
        $this->billRefund = $billRefund;

        return $this;
    }
}
