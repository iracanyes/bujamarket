<?php


namespace App\Domain;


use App\Entity\Comment;
use App\Entity\Customer;
use App\Entity\OrderDetail;
use App\Entity\SupplierProduct;
use App\Exception\OrderDetail\OrderDetailNotFoundException;
use App\Exception\SupplierProduct\SupplierProductNotFoundException;
use App\Exception\User\MemberNotFoundException;
use App\Responder\JsonResponder;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Stripe\Order;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\Security;

class CommentHandler
{
    private $request;

    private $em;

    private $security;

    private $logger;

    private $jsonResponder;

    private $imageHandler;

    public function __construct(RequestStack $requestStack, EntityManagerInterface $em, Security $security, LoggerInterface $logger, JsonResponder $jsonResponder, ImageHandler $imageHandler)
    {
        $this->request = $requestStack->getCurrentRequest();
        $this->em = $em;
        $this->security = $security;
        $this->logger = $logger;
        $this->jsonResponder = $jsonResponder;
        $this->imageHandler = $imageHandler;
    }

    public function getCommentsBySupplierProduct()
    {
        $id = $this->request->attributes->get('id');

        $comments = $this->em->getRepository(Comment::class)
            ->getCommentsBySupplierProduct($id);


        return $this->jsonResponder->arrayResult($comments, ["groups" => ['comment:output']]);
    }

    public function createComment()
    {
        $data = json_decode($this->request->getContent());

        $comment = new Comment();
        $comment->setDateCreated(new \DateTime())
            ->setContent($data->content)
            ->setRating(( (int) $data->rating) * 2);

        $customer = $this->security->getUser();



        try{
            $supplierProduct = $this->em->getRepository(SupplierProduct::class)
                ->find((int) $data->supplierProductId);

            $orderDetail = $this->em->getRepository(OrderDetail::class)
                ->find((int) $data->orderDetailId);

            if(!$customer instanceof Customer){
                throw new MemberNotFoundException("Customer not found!");
            }

            if(!$supplierProduct instanceof SupplierProduct)
            {
                throw new SupplierProductNotFoundException(sprintf("The supplier product (id=%s) not found", $data->supplierProductId));
            }

            if(!$orderDetail instanceof OrderDetail){
                throw new OrderDetailNotFoundException("The order corresponding to this comment is not found!");
            }


            $customer->addComment($comment);
            $supplierProduct->addComment($comment);
            $comment->setOrderDetail($orderDetail);
            $orderDetail->setCommented(true);

            $this->em->persist($comment);
            $this->em->persist($customer);
            $this->em->persist($supplierProduct);
            $this->em->persist($orderDetail);
            $this->em->flush();

            return $comment;
        }catch (\Exception $e){
            $this->logger->error($e->getMessage(), ['context' => $e]);
            return $this->jsonResponder->error([
                "@context" => '/contexts/'.$this->jsonResponder->getClassShortName($comment),
                "hydra:description" => "An error occured while persisting the new comment"
            ]);
        }

    }

}
