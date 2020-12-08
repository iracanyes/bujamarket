<?php


namespace App\Security;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;


class UserProvider implements UserProviderInterface
{
    private $em;

    /**
     * UserProvider constructor.
     * @param EntityManagerInterface $em
     * @internal param Client $httpClient
     * @internal param UserOptionService $userOptionService
     */
    public function __construct(EntityManagerInterface $em){
        $this->em = $em;
    }

    /**
     * Loads the user for the given username.
     * @param $username
     * @return object|null
     */
    public function loadUserByUsername($username): ?User
    {
        return $this->em->getRepository(User::class)
            ->findOneBy(['email' => $username]);
    }

    /**
     * @param UserInterface $user
     * @return User|UserInterface
     */
    public function refreshUser(UserInterface $user)
    {
        if(!$user instanceof User){
            throw new UnsupportedUserException(sprintf('Instances of "%s" are not supported.', get_class($user)));
        }

        return $user;
    }

    /**
     *  Whether this provider supports the given user class.
     *
     * @param $class
     * @return bool
     */
    public function supportsClass($class)
    {
        return $class === 'App\Entity\User';
    }


}
