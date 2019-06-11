<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Annotation\ApiResource;

/**
 * @ApiResource()
 * @ORM\Table(name="bjmkt_message")
 * @ORM\Entity(repositoryClass="App\Repository\MessageRepository")
 */
class Message
{
    /**
     * @var integer $id ID of this message
     *
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @var string $content Content of this message
     *
     * @ORM\Column(type="text")
     * @Assert\NotBlank()
     */
    private $content;

    /**
     * @var \DateTime $dateCreated Date when this message was written
     *
     * @ORM\Column(type="datetime")
     * @Assert\DateTime()
     */
    private $dateCreated;

    /**
     * @var string $attachmentUrl Attachment URL of this message
     *
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Assert\Url()
     */
    private $attachmentUrl;

    /**
     * @var string $attachmentFile Attachment file of this message
     *
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Assert\Url()
     */
    private $attachmentFile;

    /**
     * @var string $attachmentImage Attachment image of this message
     *
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Assert\Url()
     */
    private $attachmentImage;

    /**
     * @var Forum $forum Forum in which this message is written
     * @ORM\ManyToOne(targetEntity="App\Entity\Forum", inversedBy="messages")
     * @ORM\JoinColumn(nullable=false)
     * @Assert\Type("App\Entity\Forum")
     * @Assert\NotNull()
     */
    private $forum;

    /**
     * @var User $user User who wrote this message
     *
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="messages")
     * @ORM\JoinColumn(nullable=false)
     * @Assert\Type("App\Entity\User")
     * @Assert\NotNull()
     */
    private $user;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): self
    {
        $this->content = $content;

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

    public function getAttachmentUrl(): ?string
    {
        return $this->attachmentUrl;
    }

    public function setAttachmentUrl(string $attachmentUrl): self
    {
        $this->attachmentUrl = $attachmentUrl;

        return $this;
    }

    public function getAttachmentFile(): ?string
    {
        return $this->attachmentFile;
    }

    public function setAttachmentFile(?string $attachmentFile): self
    {
        $this->attachmentFile = $attachmentFile;

        return $this;
    }

    /**
     * @return string
     */
    public function getAttachmentImage(): string
    {
        return $this->attachmentImage;
    }

    /**
     * @param string $attachmentImage
     */
    public function setAttachmentImage(string $attachmentImage): self
    {
        $this->attachmentImage = $attachmentImage;

        return $this;
    }



    public function getForum(): ?Forum
    {
        return $this->forum;
    }

    public function setForum(?Forum $forum): self
    {
        $this->forum = $forum;

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
}
