<?php


namespace App\Action\Ups;

use App\Domain\UpsRateHandler;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;

class RateAction
{
    private $upsRateHandler;

    public function __construct(UpsRateHandler $upsRateHandler)
    {
        $this->upsRateHandler = $upsRateHandler;
    }

    /**
     * @Security("(is_granted('ROLE_CUSTOMER') or is_granted('ROLE_SUPPLIER')) and is_granted('IS_AUTHENTICATED_REMEMBERED')")
     * @return \Ups\Entity\RateResponse
     */
    public function __invoke(){
        return $this->upsRateHandler->getRate();
    }

}
