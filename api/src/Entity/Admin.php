<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\AdminRepository")
 */
class Admin
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $nbRefundValidated;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $nbIssueResolved;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Forum", mappedBy="responder")
     */
    private $forums;

    public function __construct()
    {
        $this->forums = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
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
    public function getForums(): Collection
    {
        return $this->forums;
    }

    public function addForum(Forum $forum): self
    {
        if (!$this->forums->contains($forum)) {
            $this->forums[] = $forum;
            $forum->setResponder($this);
        }

        return $this;
    }

    public function removeForum(Forum $forum): self
    {
        if ($this->forums->contains($forum)) {
            $this->forums->removeElement($forum);
            // set the owning side to null (unless already changed)
            if ($forum->getResponder() === $this) {
                $forum->setResponder(null);
            }
        }

        return $this;
    }
}
