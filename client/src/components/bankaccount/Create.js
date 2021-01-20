import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentMethodForm from './PaymentMethodForm';
import { create, reset } from '../../actions/bankaccount/create';
import {SpinnerLoading} from "../../layout/component/Spinner";
import {toastError} from "../../layout/component/ToastMessage";
import BankAccountForm from "./BankAccountForm";
import {FormattedMessage} from "react-intl";

//const stripePromise = loadStripe(`${process.env.REACT_APP_STRIPE_PUBLIC_KEY}`);
const stripePromise = loadStripe('pk_test_ByaWsXqgA9uZ4kAZ617IyrTE');


class Create extends Component {
  static propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    created: PropTypes.object,
    create: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired
  };

  componentWillUnmount() {
    this.props.reset();
  }

  render() {
    const { history, location, loadingClientSecret } = this.props;
    const user = localStorage.getItem('token') !== null ? JSON.parse(atob(localStorage.getItem('token').split('.')[1])): null ;

    typeof this.props.error === "string" && toastError(this.props.error);

    if(!user)
      history.push({pathname: '../../login', state: { from: location.pathname }});

    return (
      <div>
        <h1>
          <FormattedMessage
            id={"app.payment_method.add"}
            defaultMessage={"Ajouter un moyen de paiement"}
          />
        </h1>
        {loadingClientSecret && ( <SpinnerLoading message={'Chargement du formulaire'}/>)}
        <Elements stripe={stripePromise}>
          {
            user && user.roles.includes('ROLE_SUPPLIER')
              ? <BankAccountForm  onSubmit={this.props.create} />
              : <PaymentMethodForm onSubmit={this.props.create} />
          }

        </Elements>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { created, error, loading } = state.bankaccount.create;
  const { loading: loadingClientSecret } = state.bankaccount.getClientSecret;
  return { created, error, loading, loadingClientSecret };
};

const mapDispatchToProps = dispatch => ({
  create: values => dispatch(create(values)),
  reset: () => dispatch(reset())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Create));
