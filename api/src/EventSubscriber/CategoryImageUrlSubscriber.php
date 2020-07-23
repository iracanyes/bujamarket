<?php


namespace App\EventSubscriber;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Category;
use Doctrine\ORM\Tools\Pagination\Paginator;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class CategoryImageUrlSubscriber implements EventSubscriberInterface
{

    /**
     * @inheritDoc
     */
    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['updateCategoryImageUrl', EventPriorities::PRE_SERIALIZE],
        ];
    }

    public function updateCategoryImageUrl(ViewEvent $event): void
    {
        $result = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();
        

        foreach($result as $category){
            if(!$category instanceof Category){
                return;
            }
        }


        if((!$result instanceof Category || !$result instanceof Paginator) && Request::METHOD_GET !== $method ){
            return;
        }

        foreach($result as $category){
            if($category instanceof Category){
                if(strpos($category->getImage()->getUrl(), getenv("UPLOAD_CATEGORY_IMAGE_DIRECTORY")) === false){
                    $category->getImage()->setUrl( getenv("API_ENTRYPOINT").'/'.getenv("UPLOAD_CATEGORY_IMAGE_DIRECTORY").'/'.$category->getImage()->getUrl());
                    dump($category);
                }
            }else{
                return;
            }


        }
        //$category->getImage()->setUrl(getenv("UPLOAD_CATEGORY_IMAGE_DIRECTORY").'/'.$category->getImage()->getUrl());

        $event->setControllerResult($result);

    }
}
