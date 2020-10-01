<?php


namespace App\Controller\OrderSet;

use App\Service\OrderSetHandler;

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
