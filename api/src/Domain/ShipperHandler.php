<?php


namespace App\Domain;

use App\Entity\DeliverySet;
use App\Entity\OrderDetail;
use App\Entity\OrderSet;
use App\Entity\Customer;
use App\Entity\Shipper;
use Doctrine\ORM\EntityNotFoundException;
use Lexik\Bundle\JWTAuthenticationBundle\Exception\UserNotFoundException;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\Security;
use Doctrine\ORM\EntityManagerInterface;

class ShipperHandler
{
    /**
     * @var Security $security
     */
    private $security;

    /**
     * @var \Symfony\Component\HttpFoundation\Request|null $request
     */
    private $request;

    /**
     * @var EntityManagerInterface $em
     */
    private $em;

    public function __construct(Security $security, RequestStack $requestStack, EntityManagerInterface $em, AddressHandler $addressHandler)
    {
        $this->security = $security;
        $this->request = $requestStack->getCurrentRequest();
        $this->em = $em;
    }

    public function getShipper($data = null)
    {
        if($data !== null)
        {
            try{
                $shipper = $this->em->getRepository(Shipper::class)
                    ->find((int) $data->shipper);
            }catch (\Exception $exception){
                throw new EntityNotFoundException("Code : ".$exception->getCode()."\nMessage: ".$exception->getMessage(), 404 );
            }

        }

        return $shipper;
    }
}
