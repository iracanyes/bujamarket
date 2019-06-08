<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Annotation\ApiResource;

/**
 * @ApiResource()
 * @ORM\Table(name="bjmkt_order_returned")
 * @ORM\Entity(repositoryClass="App\Repository\OrderReturnedRepository")
 */
class OrderReturned
{
    /**
     * @var integer $id ID of this order returned
     *
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @var string $description Description of the order returned
     *
     * @ORM\Column(type="text")
     * @Assert\NotBlank()
     */
    private $description;

    /**
     * @var string $reason Reason for returning the order
     *
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank()
     */
    private $reason;

    /**
     * @var boolean $isIntact Is the product concerned by this order returned intact
     *
     * @ORM\Column(type="boolean")
     * @Assert\Type("boolean")
     */
    private $isIntact;

    /**
     * @var string $fileUrl URL to the file
     *
     * @ORM\Column(type="string", length=255)
     * @Assert\Url()
     *
     */
    private $fileUrl;

    /**
     * @var OrderDetail $orderDetail Order detail returned
     *
     * @ORM\OneToOne(targetEntity="App\Entity\OrderDetail", inversedBy="orderReturned", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     * @Assert\Type("App\Entity\OrderDetail")
     * @Assert\NotNull()
     */
    private $orderDetail;

    /**
     * @var BillRefund $billRefund Refund bill associated to this order returned
     *
     * @ORM\OneToOne(targetEntity="App\Entity\BillRefund", inversedBy="orderReturned", cascade={"persist", "remove"})
     *
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
