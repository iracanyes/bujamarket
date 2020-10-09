<?php


namespace App\Action\OrderSet;

use App\Domain\OrderSetHandler;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;

class CreateOrderSetAction
{
    private $orderSetHandler;

    public function __construct(OrderSetHandler $orderSetHandler)
    {
        $this->orderSetHandler = $orderSetHandler;
    }

    /**
     * @IsGranted("ROLE_CUSTOMER")
     * @return \App\Entity\OrderSet
     */
    public function __invoke()
    {
        $orderSet = $this->orderSetHandler->createOrderSet();

        return $orderSet;
    }


}
