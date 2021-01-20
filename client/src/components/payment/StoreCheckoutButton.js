/**
 * Author: iracanyes
 * Date: 10/8/19
 * Description:
 */
// MyStoreCheckout.js
import React, {Fragment} from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { ElementsConsumer } from '@stripe/react-stripe-js';
import { FormattedMessage} from 'react-intl';
import {
  Button,
  Spinner
} from 'reactstrap';
import {toastError, toastStripePaymentInfo} from "../../layout/component/ToastMessage";
import {create} from "../../actions/payment/create";

class CheckoutButton extends React.Component {

  constructor(props)
  {
    super(props);

    toastStripePaymentInfo();

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e)
  {
    e.preventDefault();

    const { stripe } = this.props.stripe;

    let orderSet = {};


    if(this.props.location.state !== undefined){
      orderSet = this.props.location.state.params.orderSet;
    }else{
      if(sessionStorage.getItem('my_order'))
      {
        orderSet = JSON.parse(sessionStorage.getItem('my_order'));
      }
    }

    this.props.create(orderSet.id, this.props.history, this.props.location, stripe);

  }

  render() {
    const { loading, errorCreate } = this.props;
    // Affichage des erreurs
    typeof errorCreate === "string" && toastError(errorCreate);

    return (
      <Fragment>
        <div className={"d-flex mx-auto mt-3 justify-content-center"}>
          <Button outline color={"success"} className={'mr-3 border-success'} onClick={this.onSubmit}>
            { loading && <Spinner color={'primary'} className={'spinner mr-2'} />}
            <FormattedMessage  id={"app.button.make_payment"}
                               defaultMessage="Effectuer le paiement"
                               description="Button - make payment"
            />
          </Button>
          <Button outline color={"danger"} className={'border-danger'} onClick={() => this.props.history.goBack()}>
            <FormattedMessage  id={"app.button.cancel_order"}
                               defaultMessage="Annuler la commande"
                               description="Button - return"
            />
          </Button>
        </div>

        <div className="my-3">
          {/**/}
        </div>

      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  const { error: errorCreate, loading } = state.payment.create;

  return { errorCreate, loading };
};

const mapDispatchToProps = dispatch => ({
  create: (id, history, location, stripe) => dispatch(create(id, history, location, stripe))
});

const StoreCheckoutForm = (props) => (
  <ElementsConsumer>
    {(stripe, elements) => (
      <CheckoutButton
        stripe={stripe}
        elements={elements}
        location={props.location}
        history={props.history}
        create={props.create}
        loading={props.loading}
        errorCreate={props.errorCreate}
      />
    )}
  </ElementsConsumer>
);
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(StoreCheckoutForm));
