<?php


namespace App\Controller\Address;

use App\Entity\Address;
use App\Service\AddressHandler;

class DeleteAddressAction
{
    private $addressHandler;

    public function __construct(AddressHandler $handler)
    {
        $this->addressHandler = $handler;
    }

    public function __invoke(Address $address)
    {
        $this->addressHandler->deleteAddress($address);
    }
}
