<?php


namespace App\Service;



class StripeClient
{
    /**
     * @param string $eventId
     * @return \Stripe\Event
     * @throws \Stripe\Exception\ApiErrorException
     */
    public function findEvent(string $eventId)
    {
        return \Stripe\Event::retrieve($eventId);
    }

}
