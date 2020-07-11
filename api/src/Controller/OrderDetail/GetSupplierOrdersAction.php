<?php


namespace App\Controller\OrderDetail;

use App\Service\OrderDetailHandler;

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
