import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { withRouter, NavLink as RRDNavLink } from "react-router-dom";
import { NavLink } from "reactstrap";
import {
  faCcAmex,
  faCcMastercard,
  faCcStripe,
  faCcPaypal,
  faCcVisa
} from '@fortawesome/free-brands-svg-icons';

function AddPaymentMethodButton(props){
  return (
    <div id={'add-payment-method'} className={'d-flex flex-row justify-content-center'}>
      <NavLink tag={RRDNavLink} to={'/payment_method/create'} className={'btn btn-outline-primary'}>
        Ajouter un moyen de paiement
      </NavLink>
      <div className="payment-method-icons ml-2">
        <FontAwesomeIcon icon={['fab','cc-amex']} className={'mx-1'} />
        <FontAwesomeIcon icon={['fab','cc-mastercard']} className={'mx-1'} />
        <FontAwesomeIcon icon={['fab','cc-visa']} className={'mx-1'} />
        <FontAwesomeIcon icon={['fab','cc-paypal']} className={'mx-1'} />
        <FontAwesomeIcon icon={['fab','cc-stripe']} className={'mx-1'} />
      </div>
    </div>
  );
}

export default withRouter(AddPaymentMethodButton);
