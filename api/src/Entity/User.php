<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\UserInterface;
/**
 * @ORM\Table(name="bjmkt_user")
 * @ORM\Entity(repositoryClass="App\Repository\UserRepository")
 *
 * @ORM\InheritanceType("JOINED")
 * @ORM\DiscriminatorColumn(name="userType", type="string")
 * @ORM\DiscriminatorMap({"user"="User", "customer"="Customer", "supplier"="Supplier", "admin"="Admin"})
 * @ UniqueEntity("email")
 */
class User implements UserInterface
{
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
     *
     * @ORM\Column(type="string", length=255)
     * @Assert\Email()
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
     * @var string $firstname Firstname of the user
     *
     * @ORM\Column(type="string", length=100)
     * @Assert\NotBlank()
     */
    private $firstname;

    /**
     * @var string $lastname Lastname of the user
     *
     * @ORM\Column(type="string", length=100)
     * @Assert\NotBlank()
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
     */
    private $signinConfirmed;

    /**
     * @var \DateTime $dateRegistration Date of registration
     *
     * @ORM\Column(type="datetime")
     * @Assert\DateTime()
     */
    private $dateRegistration;

    /**
     * @var string $language Language's preference
     * @ORM\Column(type="string", length=100)
     * @Assert\Language()
     */
    private $language;

    /**
     * @var string $currency Currency used by this user
     *
     * @ORM\Column(type="string", length=5)
     * @Assert\Currency()
     */
    private $currency;

    /**
     * @var Image $image Image representing this user
     *
     * @ORM\OneToOne(targetEntity="App\Entity\Image", inversedBy="user", cascade={"persist", "remove"})
     * @Assert\Type("App\Entity\Image")
     */
    private $image;

    /**
     * @var Collection $addresses Receiving addresses of this user
     *
     * @ORM\OneToMany(targetEntity="App\Entity\Address", mappedBy="user")
     */
    private $addresses;

    /**
     * @var Collection $bankAccounts Bank accounts of this user
     * @ORM\OneToMany(targetEntity="App\Entity\BankAccount", mappedBy="user", orphanRemoval=true)
     */
    private $bankAccounts;

    /**
     * @var Collection $forums Forum's subjects created by this user
     * @ORM\OneToMany(targetEntity="App\Entity\Forum", mappedBy="user", orphanRemoval=true)
     */
    private $forums;

    /**
     * @var Collection $messages Messages written by this user
     * @ORM\OneToMany(targetEntity="App\Entity\Message", mappedBy="user", orphanRemoval=true)
     */
    private $messages;

    public function __construct()
    {
        $this->addresses = new ArrayCollection();
        $this->bankAccounts = new ArrayCollection();
        $this->forums = new ArrayCollection();
        $this->messages = new ArrayCollection();
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

    public function getPlainPassword(): ?string
    {
        return $this->plainPassword;
    }

    public function setPlainPassword(?string $plainPassword): self
    {
        $this->plainPassword = $plainPassword;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    public function getUsername()
    {
        return $this->firstname .' ' . $this->lastname;
    }

    public function eraseCredentials()
    {
        // TODO: Implement eraseCredentials() method.
    }

    public function getRoles()
    {
        // TODO: Implement getRoles() method.
    }

    public function getSalt()
    {
        // TODO: Implement getSalt() method.
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
}
