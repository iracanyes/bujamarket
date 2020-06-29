<?php


namespace App\Validator\Constraints;

use Symfony\Component\Validator\Constraint;

/**
 * Class ISOCountryValidator
 * @package App\Validator
 * @Annotation
 */
class ISOCountry extends Constraint
{
    public $message = "Country is not valid!";

    /**
     * Return the class that perform the validation
     * @return string
     */
    public function validatedBy()
    {
        return \get_class($this).'Validator';
    }
}
