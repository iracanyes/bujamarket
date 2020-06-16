import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { withRouter, NavLink as RRDNavLink } from "react-router-dom";
import { Button, NavLink } from "reactstrap";
import {
  faCcAmex,
  faCcMastercard,
  faCcStripe,
  faCcPaypal,
  faCcVisa
} from '@fortawesome/free-brands-svg-icons';

function AddPaymentMethodButton(props){
  return (
    <div id={'add-payment-method'} className={'d-flex flex-row'}>
      <NavLink tag={RRDNavLink} to={'/payment_method/add'} className={'btn btn-outline-primary'}>
        Ajouter un moyen de paiement
      </NavLink>
      <div className="payment-method-icons ml-2">
        <FontAwesomeIcon icon={faCcAmex} className={'mx-1'} />
        <FontAwesomeIcon icon={faCcMastercard} className={'mx-1'} />
        <FontAwesomeIcon icon={faCcVisa} className={'mx-1'} />
        <FontAwesomeIcon icon={faCcPaypal} className={'mx-1'} />
        <FontAwesomeIcon icon={faCcStripe} className={'mx-1'} />
      </div>
    </div>
  );
}

export default withRouter(AddPaymentMethodButton);
