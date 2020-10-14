<?php


namespace App\Validator\Constraints;

use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;
use Symfony\Component\Validator\Exception\UnexpectedValueException;



class ISOCountryValidator extends ConstraintValidator
{
    public function validate($value, Constraint $constraint)
    {
        if(!$constraint instanceof ISOCountry){
            throw new UnexpectedTypeException($constraint, ISOCountry::class);
        }

        //
        if( null === $value || '' === $value){
            return;
        }

        if(!is_string($value))
            throw new UnexpectedValueException($value, 'string');

        $isoCountryJson = file_get_contents("./../src/Validator/Constraints/ISOCountry/ISO3166-1Alpha2.json");

        $countries = json_decode($isoCountryJson, true);

        if(!in_array($value, $countries)){
            $this->context->buildViolation($constraint->message)
                ->setParameter('{{ string }} ', $value)
                ->addViolation();
        }
    }
}
