<?php


namespace App\Responder;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;


class JsonResponder
{
    /**
     * @var SerializerInterface
     */
    private $serializer;

    public function __construct(SerializerInterface $serializer)
    {
        $this->serializer = $serializer;
    }

    /**
     * @param $entity
     * @param array|null $context
     * @param null $format
     * @return mixed
     */
    public function normalize($entity, array $context = [], $format = null)
    {
        return $this->serializer->normalize($entity, $format, $context);
    }

    public function getClassShortName($entity): string
    {
        return (new \ReflectionClass($entity))->getShortName();
    }

    public function success($data, $status = 200){
        if(!is_array($data)){
            $data = $this->normalize($data, [], null);
        }
        return new JsonResponse($data, $status);
    }


    public function error(array $data, $status = 404){
        return new JsonResponse($data, $status);
    }

    public function oneResult($entity, $status = 200, $context = []){
        return new JsonResponse(
            array_merge([
                '@context' => '/contexts/'.$this->getClassShortName($entity),
                '@id' => '/'.$this->camelToUnderscore($this->getClassShortName($entity)).'/'.$entity->getId(),
                '@type' => 'hydra:Item',
            ], $this->normalize($entity,$context !== [] ? $context : null , null) ),
            $status
        );
    }

    public function arrayResult(array $collection, array $context = [], $status = 200){
        $shortName = !empty($collection) ? $this->getClassShortName($collection[0]) : "";
        return new JsonResponse(
            [
                '@context' => '/contexts/'.$shortName,
                '@id' => '/'.$this->camelToUnderscore($shortName).'s',
                '@type' => 'hydra:Collection',
                'hydra:member' => $this->normalize($collection, $context !== [] ? $context : null)
            ],
            $status
        );
    }

    function camelToUnderscore($string, $separator = "_"): string
    {
        return strtolower(preg_replace('/(?<=\d)(?=[A-Za-z])|(?<=[A-Za-z])(?=\d)|(?<=[a-z])(?=[A-Z])/', $separator, $string));
    }
}
