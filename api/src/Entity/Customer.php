<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\CustomerRepository")
 */
class Customer
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
    private $customerKey;

    /**
     * @ORM\Column(type="integer")
     */
    private $nbAbuseIdentified;

    /**
     * @ORM\Column(type="float")
     */
    private $averageRating;

    /**
     * @ORM\Column(type="integer")
     */
    private $nbOrderCompleted;

    /**
     * @ORM\Column(type="integer")
     */
    private $nbOrderWithdrawn;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\OrderGlobal", mappedBy="customer")
     */
    private $orderGlobals;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\BillCustomer", mappedBy="customer", orphanRemoval=true)
     */
    private $customerBills;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\BillRefund", mappedBy="customer", orphanRemoval=true)
     */
    private $refundBills;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Comment", mappedBy="customer", orphanRemoval=true)
     */
    private $comments;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Favorite", mappedBy="customer", orphanRemoval=true)
     */
    private $favorites;

    public function __construct()
    {
        $this->orderGlobals = new ArrayCollection();
        $this->customerBills = new ArrayCollection();
        $this->refundBills = new ArrayCollection();
        $this->comments = new ArrayCollection();
        $this->favorites = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
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
}
