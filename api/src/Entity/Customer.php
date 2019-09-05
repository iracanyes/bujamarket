<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

/**
 * @ApiResource(attributes={
 *     "normalization_context"={"groups"={"customer:output"}},
 *     "denormalization_context"={"groups"={"customer:input"}}
 * })
 * @ORM\Table(name="bjmkt_customer")
 * @ORM\Entity(repositoryClass="App\Repository\CustomerRepository")
 * @ UniqueEntity("customerKey")
 */
class Customer extends User
{
    /**
     * @var integer $id ID of this customer
     *
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"customer:output"})
     */
    private $id;

    /**
     * @var string $customerKey Customer key on Stripe platform
     *
     * @ORM\Column(type="string", length=100)
     * @Assert\NotBlank()
     * @Groups({"customer:output"})
     */
    private $customerKey;

    /**
     * @var integer $nbAbuseIdentified Number of abuse identified
     *
     * @ORM\Column(type="integer")
     * @Assert\Type("integer")
     * @Groups({"customer:output"})
     */
    private $nbAbuseIdentified;

    /**
     * @var float $averageRating Average rating given to supplier's products
     *
     * @ORM\Column(type="float")
     * @Assert\Type("float")
     * @Groups({"customer:output"})
     */
    private $averageRating;

    /**
     * @var integer $nbOrderCompleted Number of order completed
     *
     * @ORM\Column(type="integer")
     * @Assert\Type("integer")
     * @Groups({"customer:output"})
     */
    private $nbOrderCompleted;

    /**
     * @var integer $nbOrderWithdrawn Number of order withdrawn
     *
     * @ORM\Column(type="integer")
     * @Assert\Type("integer")
     * @Groups({"customer:output"})
     */
    private $nbOrderWithdrawn;

    /**
     * @var Collection $orderGlobals Order sets made by this customer
     *
     * @ORM\OneToMany(targetEntity="App\Entity\OrderGlobal", mappedBy="customer")
     * @Groups({"customer:output"})
     */
    private $orderGlobals;

    /**
     * @var Collection $customerBills Orders Bill of this customer
     *
     * @ORM\OneToMany(targetEntity="App\Entity\BillCustomer", mappedBy="customer", orphanRemoval=true)
     * @Groups({"customer:output"})
     */
    private $customerBills;

    /**
     * @var Collection $refundBills Refund's bill of this customer
     *
     * @ORM\OneToMany(targetEntity="App\Entity\BillRefund", mappedBy="customer", orphanRemoval=true)
     * @Groups({"customer:output"})
     */
    private $refundBills;

    /**
     * @var Collection $comments Comments made by this customer
     *
     * @ORM\OneToMany(targetEntity="App\Entity\Comment", mappedBy="customer", orphanRemoval=true)
     * @Groups({"customer:output"})
     */
    private $comments;

    /**
     * @var Collection $favorites Supplier's product loved by this customer
     *
     * @ORM\OneToMany(targetEntity="App\Entity\Favorite", mappedBy="customer", orphanRemoval=true)
     * @Groups({"customer:output"})
     * @ApiSubresource( maxDepth=2)
     */
    private $favorites;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\ShoppingCard", mappedBy="customer", orphanRemoval=true)
     * @Groups({"customer:output"})
     * @ApiSubresource(maxDepth=2)
     */
    private $shoppingCards;

    public function __construct()
    {
        parent::__construct();
        $this->orderGlobals = new ArrayCollection();
        $this->customerBills = new ArrayCollection();
        $this->refundBills = new ArrayCollection();
        $this->comments = new ArrayCollection();
        $this->favorites = new ArrayCollection();
        $this->shoppingCards = new ArrayCollection();
    }

    public function getUserType(): string
    {
        return $this::TYPE_CUSTOMER;
    }

    public function getCustomerKey(): ?string
    {
        return $this->customerKey;
    }

    public function setCustomerKey(string $customerKey): self
    {
        $this->customerKey = $customerKey;

        return $this;
    }

    public function getNbAbuseIdentified(): ?int
    {
        return $this->nbAbuseIdentified;
    }

    public function setNbAbuseIdentified(int $nbAbuseIdentified): self
    {
        $this->nbAbuseIdentified = $nbAbuseIdentified;

        return $this;
    }

    public function getAverageRating(): ?float
    {
        return $this->averageRating;
    }

    public function setAverageRating(float $averageRating): self
    {
        $this->averageRating = $averageRating;

        return $this;
    }

    public function getNbOrderCompleted(): ?int
    {
        return $this->nbOrderCompleted;
    }

    public function setNbOrderCompleted(int $nbOrderCompleted): self
    {
        $this->nbOrderCompleted = $nbOrderCompleted;

        return $this;
    }

    public function getNbOrderWithdrawn(): ?int
    {
        return $this->nbOrderWithdrawn;
    }

    public function setNbOrderWithdrawn(int $nbOrderWithdrawn): self
    {
        $this->nbOrderWithdrawn = $nbOrderWithdrawn;

        return $this;
    }

    /**
     * @return Collection|OrderGlobal[]
     */
    public function getOrderGlobals(): Collection
    {
        return $this->orderGlobals;
    }

    public function addOrderGlobal(OrderGlobal $orderGlobal): self
    {
        if (!$this->orderGlobals->contains($orderGlobal)) {
            $this->orderGlobals[] = $orderGlobal;
            $orderGlobal->setCustomer($this);
        }

        return $this;
    }

    public function removeOrderGlobal(OrderGlobal $orderGlobal): self
    {
        if ($this->orderGlobals->contains($orderGlobal)) {
            $this->orderGlobals->removeElement($orderGlobal);
            // set the owning side to null (unless already changed)
            if ($orderGlobal->getCustomer() === $this) {
                $orderGlobal->setCustomer(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|BillCustomer[]
     */
    public function getCustomerBills(): Collection
    {
        return $this->customerBills;
    }

    public function addCustomerBill(BillCustomer $customerBill): self
    {
        if (!$this->customerBills->contains($customerBill)) {
            $this->customerBills[] = $customerBill;
            $customerBill->setCustomer($this);
        }

        return $this;
    }

    public function removeCustomerBill(BillCustomer $customerBill): self
    {
        if ($this->customerBills->contains($customerBill)) {
            $this->customerBills->removeElement($customerBill);
            // set the owning side to null (unless already changed)
            if ($customerBill->getCustomer() === $this) {
                $customerBill->setCustomer(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|BillRefund[]
     */
    public function getRefundBills(): Collection
    {
        return $this->refundBills;
    }

    public function addRefundBill(BillRefund $refundBill): self
    {
        if (!$this->refundBills->contains($refundBill)) {
            $this->refundBills[] = $refundBill;
            $refundBill->setCustomer($this);
        }

        return $this;
    }

    public function removeRefundBill(BillRefund $refundBill): self
    {
        if ($this->refundBills->contains($refundBill)) {
            $this->refundBills->removeElement($refundBill);
            // set the owning side to null (unless already changed)
            if ($refundBill->getCustomer() === $this) {
                $refundBill->setCustomer(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Comment[]
     */
    public function getComments(): Collection
    {
        return $this->comments;
    }

    public function addComment(Comment $comment): self
    {
        if (!$this->comments->contains($comment)) {
            $this->comments[] = $comment;
            $comment->setCustomer($this);
        }

        return $this;
    }

    public function removeComment(Comment $comment): self
    {
        if ($this->comments->contains($comment)) {
            $this->comments->removeElement($comment);
            // set the owning side to null (unless already changed)
            if ($comment->getCustomer() === $this) {
                $comment->setCustomer(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Favorite[]
     */
    public function getFavorites(): Collection
    {
        return $this->favorites;
    }

    public function addFavorite(Favorite $favorite): self
    {
        if (!$this->favorites->contains($favorite)) {
            $this->favorites[] = $favorite;
            $favorite->setCustomer($this);
        }

        return $this;
    }

    public function removeFavorite(Favorite $favorite): self
    {
        if ($this->favorites->contains($favorite)) {
            $this->favorites->removeElement($favorite);
            // set the owning side to null (unless already changed)
            if ($favorite->getCustomer() === $this) {
                $favorite->setCustomer(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|ShoppingCard[]
     */
    public function getShoppingCards(): Collection
    {
        return $this->shoppingCards;
    }

    public function addShoppingCard(ShoppingCard $shoppingCard): self
    {
        if (!$this->shoppingCards->contains($shoppingCard)) {
            $this->shoppingCards[] = $shoppingCard;
            $shoppingCard->setCustomer($this);
        }

        return $this;
    }

    public function removeShoppingCard(ShoppingCard $shoppingCard): self
    {
        if ($this->shoppingCards->contains($shoppingCard)) {
            $this->shoppingCards->removeElement($shoppingCard);
            // set the owning side to null (unless already changed)
            if ($shoppingCard->getCustomer() === $this) {
                $shoppingCard->setCustomer(null);
            }
        }

        return $this;
    }
}
