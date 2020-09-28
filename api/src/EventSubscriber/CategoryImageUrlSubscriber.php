<?php


namespace App\EventSubscriber;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Category;
use ApiPlatform\Core\Bridge\Doctrine\Orm\AbstractPaginator;
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

        dump($result);
        dump($result instanceof AbstractPaginator);
        dump($result instanceof Category);
        dump(!($result instanceof Category || $result instanceof AbstractPaginator) && !(Request::METHOD_GET === $method || Request::METHOD_PUT === $method || Request::METHOD_POST === $method));

        if(!($result instanceof Category || $result instanceof AbstractPaginator) && !(Request::METHOD_GET === $method || Request::METHOD_PUT === $method || Request::METHOD_POST === $method) ){
            return;
        }



        if($result instanceof AbstractPaginator){
            foreach($result as $category){
                if(!$category instanceof Category){
                    return;
                }
            }
        }

        if($result instanceof AbstractPaginator)
        {
            foreach($result as $category){
                if($category instanceof Category){
                    if(strpos($category->getImage()->getUrl(), getenv("UPLOAD_CATEGORY_IMAGE_DIRECTORY")) === false){
                        $category->getImage()->setUrl( getenv("API_ENTRYPOINT").'/'.getenv("UPLOAD_CATEGORY_IMAGE_DIRECTORY").'/'.$category->getImage()->getUrl());
                    }
                }else{
                    return;
                }
                dump($category);

            }
        }



        if($result instanceof Category)
        {
            if(strpos($result->getImage()->getUrl(), getenv("UPLOAD_CATEGORY_IMAGE_DIRECTORY")) === false){
                $result->getImage()->setUrl( getenv("API_ENTRYPOINT").'/'.getenv("UPLOAD_CATEGORY_IMAGE_DIRECTORY").'/'.$result->getImage()->getUrl());
            }
        }

        $event->setControllerResult($result);

    }
}
