<?php


namespace App\Action\OrderDetail;

use App\Domain\OrderDetailHandler;

class GetSupplierOrdersAction
{
    private $orderDetailHandler;

    public function __construct(OrderDetailHandler $orderDetailHandler)
    {
        $this->orderDetailHandler = $orderDetailHandler;
    }

    public function __invoke()
    {
        return $this->orderDetailHandler->getSupplierOrders();
    }
}
