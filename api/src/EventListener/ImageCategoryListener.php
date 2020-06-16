<?php
/**
 * Author:
 * Description: Doctrine Entity Listener - Image Load
 */

namespace App\EventListener;

use App\Entity\Image;
use App\Entity\Category;
use Doctrine\Persistence\Event\LifecycleEventArgs;

class ImageCategoryListener
{
    public function postLoad(Category $category, LifecycleEventArgs $args)
    {
        $entity = $args->getObject();

        if(!$entity instanceof Category)
            return;

        if(!$category->getImage()) return;

        $filename = $entity->getImage()->getUrl();

        $category->getImage()->setUrl(getenv('API_ENTRYPOINT').'/'.getenv('UPLOAD_CATEGORY_IMAGE_DIRECTORY').'/'.$filename);

    }
}
