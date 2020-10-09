<?php


namespace App\Action\OrderSet;

use App\Entity\OrderSet;
use App\Domain\OrderSetHandler;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;


class GetOrderSetSuccessAction
{
    private $orderSetHandler;

    private $serializer;


    public function __construct(OrderSetHandler $orderSetHandler, SerializerInterface $serializer)
    {
        $this->orderSetHandler = $orderSetHandler;

        $this->serializer = $serializer;
    }

    public function __invoke()
    {
        $orderSet =  $this->orderSetHandler->getOrderSet();
        return $orderSet;
    }
}
