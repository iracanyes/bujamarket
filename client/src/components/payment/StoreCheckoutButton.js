/**
 * Author: iracanyes
 * Date: 10/8/19
 * Description:
 */
// MyStoreCheckout.js
import React, {Fragment} from 'react';
import { connect } from 'react-redux';
import {injectStripe} from 'react-stripe-elements';
import { FormattedMessage} from 'react-intl';
import { Button } from 'reactstrap';

import FlashInfo from "../../layout/FlashInfo";
import {create} from "../../actions/payment/create";

class StoreCheckoutButton extends React.Component {

  constructor(props)
  {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e)
  {
    e.preventDefault();

    let item = {};

    this.props && console.log('onSubmit - location state ', this.props.location.state );

    if(this.props.location.state !== undefined){
      item = this.props.location.state.params.orderSet;
      console.log('location.state.order_set', item);
    }else{
      if(sessionStorage.getItem('my_order'))
      {
        item = JSON.parse(sessionStorage.getItem('my_order'));
        console.log('session_storage.my_order_set', item);
      }
    }

    this.props.create(item.id, this.props.history, this.props.location, this.props.stripe);


  }

  render() {
    return (
      <Fragment>
        <div className={"d-flex mx-auto mt-3 justify-content-center"}>
          <Button outline color={"success"} className={'mr-3'} onClick={this.onSubmit}>
            <FormattedMessage  id={"app.button.make_payment"}
                               defaultMessage="Effectuer le paiement"
                               description="Button - make payment"
            />
          </Button>
          <Button outline color={"danger"} onClick={() => this.props.history.goBack()}>
            <FormattedMessage  id={"app.button.cancel_order"}
                               defaultMessage="Annuler la commande"
                               description="Button - return"
            />
          </Button>
        </div>

        <div className="my-3">
          <FlashInfo
            color={"info"}
            message={(<p>En cliquant sur "Effectuer le paiement", vous serez redirigé vers la plateforme de paiement en ligne Stripe Checkout.<br/>À la fin du processus de paiement, vous serez redirigé vers la page suivante : Facture.</p>   )}
          />
        </div>

      </Fragment>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  create: (id, history, location, stripe) => dispatch(create(id, history, location, stripe))
});

export default connect(null, mapDispatchToProps)(injectStripe(StoreCheckoutButton));
