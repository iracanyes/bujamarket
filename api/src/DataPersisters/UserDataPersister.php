<?php


namespace App\DataPersisters;

use ApiPlatform\Core\DataPersister\DataPersisterInterface;
use App\Entity\User;


final class UserDataPersister implements DataPersisterInterface
{
    /**
     * @param $data
     * @return object|void
     */
    public function persist($data)
    {
        if($data->getId() !== null)
        {

        }
    }

    public function remove($data)
    {
        // TODO: Implement remove() method.
    }

    public function supports($data): bool
    {
        return $data instanceof User;
    }
}