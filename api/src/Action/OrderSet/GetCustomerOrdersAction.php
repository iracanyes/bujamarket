<?php


namespace App\Action\OrderSet;

use App\Domain\OrderSetHandler;

class GetCustomerOrdersAction
{
    private $orderSetHandler;

    public function __construct(OrderSetHandler $handler)
    {
        $this->orderSetHandler = $handler;
    }

    public function __invoke()
    {
       return $this->orderSetHandler->getMyOrders();
    }
}
