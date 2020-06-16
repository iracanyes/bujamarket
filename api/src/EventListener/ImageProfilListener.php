<?php
/**
 * Author:
 * Description: Doctrine Entity Listener - Image Load
 */

namespace App\EventListener;

use App\Entity\Image;
use App\Entity\User;
use Doctrine\Persistence\Event\LifecycleEventArgs;

class ImageProfilListener
{
    public function postLoad(User $user, LifecycleEventArgs $args)
    {
        $entity = $args->getObject();
        if(!$entity instanceof User)
            return;

        if(!$user->getImage()) return;

        $filename = $entity->getImage()->getUrl();

        switch ($user->getUserType()){
            case "customer":
                $user->getImage()->setUrl(getenv('API_ENTRYPOINT')."/".getenv('UPLOAD_CUSTOMER_IMAGE_DIRECTORY').'/'.$filename);
                break;
            case "supplier":
                $user->getImage()->setUrl(getenv('API_ENTRYPOINT')."/".getenv('UPLOAD_SUPPLIER_IMAGE_DIRECTORY').'/'.$filename);
                break;
            case "admin":
                $user->getImage()->setUrl(getenv('API_ENTRYPOINT')."/".getenv('UPLOAD_ADMIN_IMAGE_DIRECTORY').'/'.$filename);
                break;
        }



    }
}
