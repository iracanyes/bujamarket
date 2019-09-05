<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ApiResource(attributes={
 *     "normalization_context"={"groups"={"admin:output"}},
 *     "denormalization_context"={"groups"={"admin:input"}}

 * })
 * @ORM\Table(name="bjmkt_admin")
 * @ORM\Entity(repositoryClass="App\Repository\AdminRepository")
 */
class Admin extends User
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @var integer $nbRefundValidated Number of refunds validated
     *
     * @ORM\Column(type="integer", nullable=true)
     * @Assert\Type("integer")
     */
    private $nbRefundValidated;

    /**
     * @var integer $nbIssueResolved Number of issues resolved
     *
     * @ORM\Column(type="integer", nullable=true)
     * @Assert\Type("integer")
     */
    private $nbIssueResolved;

    /**
     * @ORM\Column(type="string", length=50, unique=true)
     */
    private $adminKey;

    /**
     * @var Collection $respondedForums Forums in which the admin responded
     *
     * @ORM\OneToMany(targetEntity="App\Entity\Forum", mappedBy="responder")
     * @Assert\Type("Doctrine\Common\Collections\Collection")
     */
    private $respondedForums;



    /**
     * @ORM\OneToMany(targetEntity="App\Entity\BillRefund", mappedBy="validator", orphanRemoval=true)
     */
    private $billRefunds;

    public function __construct()
    {
        parent::__construct();
        $this->respondedForums = new ArrayCollection();
        $this->billRefunds = new ArrayCollection();
    }

    public function getUserType(): string
    {
        return $this::TYPE_ADMIN;
    }

    public function getNbRefundValidated(): ?int
    {
        return $this->nbRefundValidated;
    }

    public function setNbRefundValidated(?int $nbRefundValidated): self
    {
        $this->nbRefundValidated = $nbRefundValidated;

        return $this;
    }

    public function getNbIssueResolved(): ?int
    {
        return $this->nbIssueResolved;
    }

    public function setNbIssueResolved(?int $nbIssueResolved): self
    {
        $this->nbIssueResolved = $nbIssueResolved;

        return $this;
    }

    /**
     * @return Collection|Forum[]
     */
    public function getRespondedForums(): Collection
    {
        return $this->respondedForums;
    }

    public function addRespondedForum(Forum $forum): Admin
    {
        if (!$this->respondedForums->contains($forum)) {
            $this->respondedForums[] = $forum;
            $forum->setResponder($this);
        }

        return $this;
    }

    public function removeRespondedForum(Forum $forum): self
    {
        if ($this->respondedForums->contains($forum)) {
            $this->respondedForums->removeElement($forum);
            // set the owning side to null (unless already changed)
            if ($forum->getResponder() === $this) {
                $forum->setResponder(null);
            }
        }

        return $this;
    }

    public function getAdminKey(): ?string
    {
        return $this->adminKey;
    }

    public function setAdminKey(string $adminKey): self
    {
        $this->adminKey = $adminKey;

        return $this;
    }

    /**
     * @return Collection|BillRefund[]
     */
    public function getBillRefunds(): Collection
    {
        return $this->billRefunds;
    }

    public function addBillRefund(BillRefund $billRefund): self
    {
        if (!$this->billRefunds->contains($billRefund)) {
            $this->billRefunds[] = $billRefund;
            $billRefund->setValidator($this);
        }

        return $this;
    }

    public function removeBillRefund(BillRefund $billRefund): self
    {
        if ($this->billRefunds->contains($billRefund)) {
            $this->billRefunds->removeElement($billRefund);
            // set the owning side to null (unless already changed)
            if ($billRefund->getValidator() === $this) {
                $billRefund->setValidator(null);
            }
        }

        return $this;
    }
}
