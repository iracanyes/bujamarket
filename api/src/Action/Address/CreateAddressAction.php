<?php


namespace App\Action\Address;

use App\Domain\AddressHandler;

class CreateAddressAction
{
    private $addressHandler;

    public function __construct(AddressHandler $handler)
    {
        $this->addressHandler = $handler;
    }

    public function __invoke()
    {
        return $this->addressHandler->createAddress();
    }
}
