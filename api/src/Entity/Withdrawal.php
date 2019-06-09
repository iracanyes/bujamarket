<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Annotation\ApiResource;
/**
 * @ApiResource()
 * @ORM\Table(name="bjmkt_withdrawal")
 * @ORM\Entity(repositoryClass="App\Repository\WithdrawalRepository")
 */
class Withdrawal
{
    /**
     * @var integer $id ID of this withdrawal
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @var string $status Status of this withdrawal
     * @ORM\Column(type="string", length=100)
     * @Assert\NotBlank()
     */
    private $status;

    /**
     * @var \DateTime $dateCreated Date when this withdrawal was created
     *
     * @ORM\Column(type="datetime")
     * @Assert\DateTime()
     */
    private $dateCreated;

    /**
     * @var boolean $isValid Is this withdrawal valid
     * @ORM\Column(type="boolean")
     * @Assert\Type("boolean")
     */
    private $isValid;

    /**
     * @var boolean $orderDelivered The order concerned by this withdrawal is delivered
     * @ORM\Column(type="boolean", nullable=true)
     * @Assert\Type("boolean")
     */
    private $orderDelivered;

    /**
     * @var BillRefund $billRefund Bill refund associated to this withdrawal
     * @ORM\OneToOne(targetEntity="App\Entity\BillRefund", inversedBy="withdrawal", cascade={"persist", "remove"})
     * @Assert\Type("App\Entity\BillRefund")
     */
    private $billRefund;

    /**
     * @var OrderDetail $orderDetail Order detail concerned by this withdrawal
     *
     * @ORM\OneToOne(targetEntity="App\Entity\OrderDetail", inversedBy="withdrawal", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     * @Assert\Type("App\Entity\OrderDetail")
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
