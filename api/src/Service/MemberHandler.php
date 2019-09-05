<?php


namespace App\Service;


use App\Entity\UserTemp;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Serializer\SerializerInterface;

class MemberHandler
{

    protected $entityClass = UserTemp::class;
    /**
     * @var EntityManagerInterface
     */
    private $em;

    /**
     * @var \Symfony\Component\HttpFoundation\Request|null
     */
    private $request;

    /**
     * @var UserPasswordEncoderInterface
     */
    private $encoder;

    /**
     * MemberHandler constructor.
     * @param EntityManagerInterface $em
     * @param RequestStack $request
     * @param UserPasswordEncoderInterface $encoder
     */
    public function __construct(EntityManagerInterface $em, RequestStack $request, UserPasswordEncoderInterface $encoder)
    {
        $this->em = $em;
        $this->request = $request->getCurrentRequest();
        $this->encoder = $encoder;
    }

    /**
     * @return User
     * @throws \Exception
     */
    public function create(): UserTemp
    {
        /* Récupération des données de la requête */
        $data = $this->request->getContent();


        dump($data);


        /* Deserialisation
        *  comme objet : json_decode( $data)
         * comme tableau : json_decode( $data, true)
        */
        $data = json_decode($data);
        dump($data);
        //$data= $this->serializer->deserialize($data, User::class, 'json');
        //dump($data);

        $user = new UserTemp();
        $user->setFirstname($data->firstname);
        $user->setLastname($data->lastname);
        $user->setEmail($data->email);
        $user->setUserType($data->userType);
        $user->setDateRegistration(new \DateTime());
        $user->setTermsAccepted($data->termsAccepted);

        /* Encodage du mot de passe */
        $user->setPassword($this->encoder->encodePassword($user, $data->password));

        // Création du token de sécurité
        $user->setToken(bin2hex(random_bytes(64)));

        /* Persistence de l'entité en DB */
        $this->em->persist($user);
        $this->em->flush();




        /* On retourne le nouvel objet pour qu'il passe dans l'event system  */
        return $user;
    }
}
