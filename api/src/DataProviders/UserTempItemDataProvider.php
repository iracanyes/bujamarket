<?php


namespace App\DataProviders;

use ApiPlatform\Core\DataProvider\ItemDataProviderInterface;
use ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface;
use ApiPlatform\Core\DataProvider\SerializerAwareDataProviderInterface;
use ApiPlatform\Core\DataProvider\SerializerAwareDataProviderTrait;
use ApiPlatform\Core\Exception\ResourceClassNotSupportedException;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\UserTemp;
use Symfony\Component\Serializer\SerializerInterface;


final class UserTempItemDataProvider implements ItemDataProviderInterface, RestrictedDataProviderInterface, SerializerAwareDataProviderInterface
{
    use SerializerAwareDataProviderTrait;

    private $entityManager;

    private $serializer;

    public function __construct(EntityManagerInterface $entityManager, SerializerInterface $serializer)
    {
        $this->entityManager = $entityManager;
        $this->serializer = $serializer;
    }

    public function supports(string $resourceClass, string $operationName = null, array $context = []): bool
    {
        return UserTemp::class === $resourceClass;
    }

    public function getItem(string $resourceClass, $id, string $operationName = null, array $context = []): ?UserTemp
    {
        /*
         * REMARQUE: ApiPlatform force l'utilisation du paramètre id pour la récupération de données
         *
         */
        dump($id);
        // Récupération des données
        $data = $this->entityManager->getRepository(UserTemp::class)
            ->findOneBy(['id' => $id]);

        dump($data);

        // Deserialize data using the Serializer
        //return $this->serializer->deserialize($data, UserTemp::class, 'user_temp:output');
        return $data;
    }

}
