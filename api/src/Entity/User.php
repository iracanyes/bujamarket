<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ApiResource(attributes={
 *     "normalization_context"={"groups"={"user:output"}},
 *     "denormalization_context"={"groups"={"user:input"}}
 * })
 * @ORM\Table(name="bjmkt_user")
 * @ORM\Entity(repositoryClass="App\Repository\UserRepository")
 *
 * @ORM\InheritanceType("JOINED")
 * @ORM\DiscriminatorColumn(name="userType", type="string", length=15)
 * @ORM\DiscriminatorMap({"user"="User", "customer"="Customer", "supplier"="Supplier", "admin"="Admin"})
 * @ UniqueEntity("email")
 */
class User implements UserInterface
{
    public const TYPE_CUSTOMER = 'customer';
    public const TYPE_SUPPLIER = 'supplier';
    public const TYPE_ADMIN = 'admin';

    /**
     * @var integer $id ID of this user
     *
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @var string $email Email of this user
     * @ORM\Column(type="string", length=180, unique=true)
     * @Assert\Email()
     * @Groups({"profile:output","user:input"})
     */
    private $email;

    /**
     * @var string $plainPassword Plain password
     *
     */
    private $plainPassword;

    /**
     * @var string $password Crypted password
     * @ORM\Column(type="string", length=255)
     */
    private $password;

    /**
     * @var $roles Role of this user on this platform
     *
     * @ORM\Column(type="json")
     */
    private $roles = [];

    /**
     * @var string $firstname Firstname of the user
     *
     * @ORM\Column(type="string", length=100)
     * @Assert\NotBlank()
     * @Groups({"profile:output","user:output","admin:output","customer:output","supplier:output","user:input","payment:output"})
     *
     */
    private $firstname;

    /**
     * @var string $lastname Lastname of the user
     *
     * @ORM\Column(type="string", length=100)
     * @Assert\NotBlank()
     * @Groups({"profile:output","user:output","admin:output","customer:output","supplier:output","user:input","payment:output"})
     */
    private $lastname;

    /**
     * @var integer $nbErrorConnection Number of errors on connection
     * @ORM\Column(type="integer")
     * @Assert\Range(
     *     min=0,
     *     max=5,
     *     minMessage="The minimum value is {{ limit }}.\nThe current value is {{ value }}."
     * )
     */
    private $nbErrorConnection;

    /**
     * @var boolean $banned Is the user banned
     * @ORM\Column(type="boolean")
     * @Assert\Type("boolean")
     */
    private $banned;

    /**
     * @var boolean $signinConfirmed Is the user sign-in confirmed
     *
     * @ORM\Column(type="boolean")
     * @Assert\Type("boolean")
     * @Groups({"profile:output","user:output","admin:output","customer:output"})
     */
    private $signinConfirmed;

    /**
     * @var \DateTime $dateRegistration Date of registration
     *
     * @ORM\Column(type="datetime")
     * @Assert\Type("DateTime")
     * @Groups({"profile:output","user:output","admin:output","customer:output"})
     */
    private $dateRegistration;

    /**
     * @var string $language Language's preference
     * @ORM\Column(type="string", length=100)
     * @Assert\Language()
     * @Groups({"profile:output","user:output","admin:output","customer:output","supplier:output","user:input"})
     */
    private $language;

    /**
     * @var string $currency Currency used by this user
     *
     * @ORM\Column(type="string", length=5)
     * @Assert\Currency()
     * @Groups({"profile:output","user:output","admin:output","customer:output","supplier:output","user:input"})
     */
    private $currency;

    /**
     * @var string
     * @ORM\Column(name="token", type="string", length=255)
     * @Groups({"user:output","admin:output","customer:output","supplier:output","user:input"})
     */
    private $token;

    /**
     * @var boolean
     */
    private $termsAccepted;

    /**
     * @var Image $image Image representing this user
     *
     * @ORM\OneToOne(targetEntity="App\Entity\Image", inversedBy="user", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=true)
     * @Assert\Type("App\Entity\Image")
     * @Groups({"profile:output","user:output","admin:output","customer:output","supplier:output","user:input"})
     */
    private $image;

    /**
     * @var Collection $addresses Receiving addresses of this user
     *
     * @ORM\OneToMany(targetEntity="App\Entity\Address", mappedBy="user", cascade={"persist"})
     * @Groups({"supplier:output","profile:output"})
     */
    private $addresses;

    /**
     * @var Collection $bankAccounts Bank accounts of this user
     * @ORM\OneToMany(targetEntity="App\Entity\BankAccount", mappedBy="user", orphanRemoval=true)
     */
    private $bankAccounts;

    /**
     * @var Collection $forums Forum's subjects created by this user
     * @ORM\OneToMany(targetEntity="App\Entity\Forum", mappedBy="author", orphanRemoval=true)
     * @Groups({"profile:output"})
     */
    private $forums;

    /**
     * @var Collection $respondedForums Forums in which the admin responded
     *
     * @ORM\OneToMany(targetEntity="App\Entity\Forum", mappedBy="responder")
     * @Assert\Type("Doctrine\Common\Collections\Collection")
     * @Groups({"profile:output"})
     */
    private $respondedForums;

    /**
     * @var Collection $messages Messages written by this user
     * @ORM\OneToMany(targetEntity="App\Entity\Message", mappedBy="user", orphanRemoval=true)
     */
    private $messages;

    /**
     * @ORM\Column(type="boolean")
     */
    private $locked;

    public function __construct()
    {
        $this->addresses = new ArrayCollection();
        $this->bankAccounts = new ArrayCollection();
        $this->forums = new ArrayCollection();
        $this->messages = new ArrayCollection();
        $this->respondedForums = new ArrayCollection();
        $this->nbErrorConnection = 0;
        $this->banned = false;
        $this->locked = false;
        $this->signinConfirmed = false;
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

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUsername(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // Garantir que tous les utilisateurs ont le rôle "ROLE_MEMBER"
        $roles[] = 'ROLE_MEMBER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    public function getPlainPassword(): ?string
    {
        return $this->plainPassword;
    }

    public function setPlainPassword(?string $plainPassword): self
    {
        $this->plainPassword = $plainPassword;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getPassword(): string
    {
        return (string) $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getSalt()
    {
        // not needed when using the "bcrypt" algorithm in security.yaml
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    /**
     * @return string
     */
    public function getToken(): string
    {
        return $this->token;
    }

    /**
     * @param string $token
     */
    public function setToken(string $token): void
    {
        $this->token = $token;
    }



    /**
     * @return string
     */
    public function getUserType(): string
    {
        return $this->userType;
    }

    /**
     * @param string $userType
     * @return User
     */
    public function setUserType(string $userType): self
    {
        $this->userType = $userType;

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

    public function getNbErrorConnection(): ?int
    {
        return $this->nbErrorConnection;
    }

    public function setNbErrorConnection(int $nbErrorConnection): self
    {
        $this->nbErrorConnection = $nbErrorConnection;

        return $this;
    }

    public function getBanned(): ?bool
    {
        return $this->banned;
    }

    public function setBanned(bool $banned): self
    {
        $this->banned = $banned;

        return $this;
    }

    public function getSigninConfirmed(): ?bool
    {
        return $this->signinConfirmed;
    }

    public function setSigninConfirmed(bool $signinConfirmed): self
    {
        $this->signinConfirmed = $signinConfirmed;

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

    public function getLanguage(): ?string
    {
        return $this->language;
    }

    public function setLanguage(string $language): self
    {
        $this->language = $language;

        return $this;
    }

    public function getCurrency(): ?string
    {
        return $this->currency;
    }

    public function setCurrency(string $currency): self
    {
        $this->currency = $currency;

        return $this;
    }

    public function getImage(): ?Image
    {
        return $this->image;
    }

    public function setImage(?Image $image): self
    {
        $this->image = $image;

        return $this;
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
    public function setTermsAccepted(bool $termsAccepted): void
    {
        $this->termsAccepted = $termsAccepted;
    }



    /**
     * @return Collection|Address[]
     */
    public function getAddresses(): Collection
    {
        return $this->addresses;
    }

    public function addAddress(Address $address): self
    {
        if (!$this->addresses->contains($address)) {
            $this->addresses[] = $address;
            $address->setUser($this);
        }

        return $this;
    }

    public function removeAddress(Address $address): self
    {
        if ($this->addresses->contains($address)) {
            $this->addresses->removeElement($address);
            // set the owning side to null (unless already changed)
            if ($address->getUser() === $this) {
                $address->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|BankAccount[]
     */
    public function getBankAccounts(): Collection
    {
        return $this->bankAccounts;
    }

    public function addBankAccount(BankAccount $bankAccount): self
    {
        if (!$this->bankAccounts->contains($bankAccount)) {
            $this->bankAccounts[] = $bankAccount;
            $bankAccount->setUser($this);
        }

        return $this;
    }

    public function removeBankAccount(BankAccount $bankAccount): self
    {
        if ($this->bankAccounts->contains($bankAccount)) {
            $this->bankAccounts->removeElement($bankAccount);
            // set the owning side to null (unless already changed)
            if ($bankAccount->getUser() === $this) {
                $bankAccount->setUser(null);
            }
        }

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
            $forum->setUser($this);
        }

        return $this;
    }

    public function removeForum(Forum $forum): self
    {
        if ($this->forums->contains($forum)) {
            $this->forums->removeElement($forum);
            // set the owning side to null (unless already changed)
            if ($forum->getUser() === $this) {
                $forum->setUser(null);
            }
        }

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
            $message->setUser($this);
        }

        return $this;
    }

    public function removeMessage(Message $message): self
    {
        if ($this->messages->contains($message)) {
            $this->messages->removeElement($message);
            // set the owning side to null (unless already changed)
            if ($message->getUser() === $this) {
                $message->setUser(null);
            }
        }

        return $this;
    }

    public function getLocked(): ?bool
    {
        return $this->locked;
    }

    public function setLocked(bool $locked): self
    {
        $this->locked = $locked;

        return $this;
    }

    public function isLocked(): bool
    {
        return $this->locked;
    }

    public function isBanned(): bool
    {
        return $this->banned;
    }

}
