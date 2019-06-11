<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Annotation\ApiResource;

/**
 * @ApiResource()
 * @ORM\Table(name="bjmkt_forum")
 * @ORM\Entity(repositoryClass="App\Repository\ForumRepository")
 */
class Forum
{
    /**
     * @var integer $id ID of this forum
     *
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @var string $title Title of this discussion in the forum
     *
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank()
     */
    private $title;

    /**
     * @var string $status Status of this forum
     * @ORM\Column(type="string", length=100)
     */
    private $status;

    /**
     * @var string $type Type of subject ex: abuse, litigation, question
     * @ORM\Column(type="string", length=50)
     * @Assert\NotBlank()
     */
    private $type;

    /**
     * @var boolean $isClosed Is this forum exchange closed
     *
     * @ORM\Column(type="boolean")
     * @Assert\Type("boolean")
     */
    private $isClosed;

    /**
     * @var \DateTime $dateCreated Date when this forum subject was created
     *
     * @ORM\Column(type="datetime")
     * @Assert\DateTime()
     */
    private $dateCreated;

    /**
     * @var User $user User who created this forum subject
     *
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="forums")
     * @ORM\JoinColumn(nullable=false)
     * @Assert\Type("App\Entity\User")
     * @Assert\NotNull()
     */
    private $user;

    /**
     * @var Admin $responder Admin who responded this forum's subject
     *
     * @ORM\ManyToOne(targetEntity="App\Entity\Admin", inversedBy="respondedForums")
     * @Assert\Type("App\Entity\Admin")
     */
    private $responder;

    /**
     * @var Collection $messages Messages written in this forum's subject
     * @ORM\OneToMany(targetEntity="App\Entity\Message", mappedBy="forum", orphanRemoval=true)
     */
    private $messages;

    public function __construct()
    {
        $this->messages = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
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

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;

        return $this;
    }

    public function getIsClosed(): ?bool
    {
        return $this->isClosed;
    }

    public function setIsClosed(bool $isClosed): self
    {
        $this->isClosed = $isClosed;

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

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getResponder(): ?Admin
    {
        return $this->responder;
    }

    public function setResponder(?Admin $responder): self
    {
        $this->responder = $responder;

        return $this;
    }

    /**
     * @return Collection|Message[]
     */
    public function getMessages(): Collection
    {
        return $this->messages;
    }

    public function addMessage(Message $message): self
    {
        if (!$this->messages->contains($message)) {
            $this->messages[] = $message;
            $message->setForum($this);
        }

        return $this;
    }

    public function removeMessage(Message $message): self
    {
        if ($this->messages->contains($message)) {
            $this->messages->removeElement($message);
            // set the owning side to null (unless already changed)
            if ($message->getForum() === $this) {
                $message->setForum(null);
            }
        }

        return $this;
    }
}
