<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiProperty;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ApiResource(attributes={
 *     "normalization_context"={"groups"={"user_temp:output"}},
 *     "denormalization_context"={"groups"={"user_temp:input"}}
 * })
 * @ORM\Table(name="bjmkt_user_temp")
 * @ORM\Entity(repositoryClass="App\Repository\UserTempRepository")
 * @UniqueEntity(fields={"email"}, message="Cette adresse E-mail existe déjà ! ")
 */
class UserTemp implements UserInterface
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"user_temp:output"})
     */
    private $id;

    /**
     * @var string $email Email of this user
     * @ORM\Column(type="string", length=255, unique=true)
     * @Assert\Email()
     * @Groups({"user_temp:output","user_temp:input","google_user_temp:output"})
     */
    private $email;

    /**
     * @var string|null $password Crypted password
     * @ORM\Column(type="string", nullable=true, length=255)
     * @Groups({"user_temp:input"})
     */
    private $password;

    /**
     * @var string $firstname Firstname of the user
     *
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank()
     * @Groups({"user_temp:output","user_temp:input","google_user_temp:output"})
     */
    private $firstname;

    /**
     * @var string $lastname Lastname of the user
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank()
     * @Groups({"user_temp:output","user_temp:input","google_user_temp:output"})
     */
    private $lastname;

    /**
     * @var string $userType Type of usage of this platform
     * @ORM\Column(type="string", length=60)
     * @Assert\NotBlank()
     * @Groups({"user_temp:output","user_temp:input","google_user_temp:output"})
     */
    private $userType;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"user_temp:output","user_temp:input"})
     */
    private $dateRegistration;

    /**
     * @var string $token Token for external communication
     * @ORM\Column(type="string", length=255)
     * @Groups({"google_user_temp:output"})
     */
    private $token;

    /**
     * @var boolean
     * @ORM\Column(type="boolean")
     * @Groups({"user_temp:output","user_temp:input","google_user_temp:output"})
     */
    private $termsAccepted;

    /**
     * @var $roles Role of this user on this platform
     *
     * @ORM\Column(type="json")
     */
    private $roles = [];

    /**
     * @ORM\Column(name="account_type",type="string", length=60)
     * @Groups({"user_temp:output","user_temp:input"})
     */
    private $accountType;

    public function __construct()
    {
        $this->accountType = 'bujamarket';
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(?string $password): self
    {
        $this->password = $password;

        return $this;
    }

    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setFirstname(string $firstname): self
    {
        $this->firstname = $firstname;

        return $this;
    }

    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    public function setLastname(string $lastname): self
    {
        $this->lastname = $lastname;

        return $this;
    }

    public function getUserType(): ?string
    {
        return $this->userType;
    }

    public function setUserType(string $userType): self
    {
        $this->userType = $userType;

        return $this;
    }

    public function getDateRegistration(): ?\DateTimeInterface
    {
        return $this->dateRegistration;
    }

    public function setDateRegistration(\DateTimeInterface $dateRegistration): self
    {
        $this->dateRegistration = $dateRegistration;

        return $this;
    }

    public function getToken(): ?string
    {
        return $this->token;
    }

    public function setToken(string $token): self
    {
        $this->token = $token;

        return $this;
    }

    public function getRoles()
    {
        $roles = $this->roles;
        // Garantir que tous les utilisateurs ont le rôle "ROLE_MEMBER"
        $roles[] = 'ROLE_MEMBER';

        return array_unique($roles);
    }

    public function getSalt()
    {
        // TODO: Implement getSalt() method.
    }

    public function getUsername()
    {
        return $this->firstname.' '.$this->lastname;
    }

    public function eraseCredentials()
    {
        // TODO: Implement eraseCredentials() method.
    }

    /**
     * @return bool
     */
    public function isTermsAccepted(): bool
    {
        return $this->termsAccepted;
    }

    /**
     * @param bool $termsAccepted
     */
    public function setTermsAccepted(bool $termsAccepted): self
    {
        $this->termsAccepted = $termsAccepted;

        return $this;
    }

    public function getAccountType(): ?string
    {
        return $this->accountType;
    }

    public function setAccountType(string $accountType): self
    {
        $this->accountType = $accountType;

        return $this;
    }


}
