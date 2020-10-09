<?php


namespace App\Action\Address;

use App\Entity\Address;
use App\Domain\AddressHandler;

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
