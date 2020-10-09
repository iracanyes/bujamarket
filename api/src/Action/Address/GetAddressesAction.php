<?php


namespace App\Action\Address;

use App\Domain\AddressHandler;

class GetAddressesAction
{
    private $addressHandler;

    public function __construct(AddressHandler $addressHandler)
    {
        $this->addressHandler = $addressHandler;
    }

    public function __invoke()
    {
        // Appel de la fct de récupération des adresses de l'utilisateur connecté
        $addresses = $this->addressHandler->getUserAddresses();

        return $addresses;
    }
}
