<?php
/**
 * Author:
 * Description: Doctrine Entity Listener - Image Load
 */

namespace App\EventListener;

use App\Entity\Image;
use App\Entity\SupplierProduct;
use Doctrine\Persistence\Event\LifecycleEventArgs;

class ImageSupplierProductListener
{
    public function postLoad(SupplierProduct $supplierProduct, LifecycleEventArgs $args)
    {
        $entity = $args->getObject();

        if(!$entity instanceof SupplierProduct)
            return;

        if(empty($supplierProduct->getImages())) return;

        foreach($supplierProduct->getImages() as $image)
        {
            $filename = $image->getUrl();
            $image->setUrl(getenv('API_ENTRYPOINT').'/'.getenv('UPLOAD_SUPPLIER_PRODUCT_IMAGE_DIRECTORY').'/'.$filename);
        }

    }
}
