/**
 * Date: 16/08/2019
 * Description: Form - Add Payment Method
 */
import React, { Fragment } from 'react';
import { Link, withRouter } from "react-router-dom";
import { logout } from "../../actions/user/login";
import { create } from "../../actions/bankaccount/create";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { Field, reduxForm } from "redux-form";
import {SpinnerLoading} from "../../layout/Spinner";
import {
  Row,
  Col,
  Spinner,
  FormGroup
} from "reactstrap";
import {
  DatePicker
} from "@material-ui/pickers";
import {toastError, toastSuccess} from "../../layout/ToastMessage";
import * as ISOCodeJson from "../../config/ISOCode/ISO3166-1Alpha2.json";
import { ElementsConsumer, CardElement } from "@stripe/react-stripe-js";

class AddPaymentMethodForm extends React.Component {
  constructor(props)
  {
    super(props);


    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {

    const user = localStorage.getItem('token') !== null ? JSON.parse(atob(localStorage.getItem('token').split('.')[1])) : null;

    if(user === null)
      this.props.logout();
  }


  handleChange(e)
  {
    const { name, value } = e.target;

    this.setState({ [name] : value });
  }

  handleSubmit= async (e) => {
    const { stripe, elements } = this.props.stripe;

    /* Empêche la soumission  du formulaire  */
    e.preventDefault();

    /* Marquer la soumission du formulaire */
    this.setState({ submitted: true });

    /* On récupère les infos du formulaire contenu dans l'état du composant */
    const data = new FormData(document.getElementById('payment-method'));

    if( !data || !stripe || !elements )
    {
      return;
    }


    const cardElement = elements.getElement(CardElement);

    console.log("CardElement", cardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details:{
        name: data.get("ownerFullname"),
        email: data.get('email'),
        phone: data.get('phone_number')
      }
    });

    if(error) {
      console.log('[error]', error);
      toastError(error.message);
    }else{
      console.log("[success]", paymentMethod);
      this.props.create(paymentMethod, this.props.history, this.props.location);
    }

  }

  renderField = data => {
    data.input.className = 'form-control';

    const isInvalid = data.meta.touched && !!data.meta.error;
    if (isInvalid) {
      data.input.className += ' is-invalid';
      data.input['aria-invalid'] = true;
    }

    if (this.props.error && data.meta.touched && !data.meta.error) {
      data.input.className += ' is-valid';
    }

    return (
      <div className={`form-group`}>
        <label
          htmlFor={`bank_account_${data.input.name}`}
          className="form-control-label"
        >
          {data.labelText}

        </label>
        <input
          {...data.input}
          type={data.type}
          step={data.step}
          required={data.required}
          placeholder={data.placeholder}
          id={`user_${data.input.name}`}
        />
        {isInvalid && <div className="invalid-feedback">{data.meta.error}</div>}
      </div>
    );
  };

  render() {
    const { loading, intl, error, created, history } = this.props;

    if(created) {
      toastSuccess("Moyen de paiement ajouté avec succès!");
      history.push('../../profile');
    }

    typeof error === 'string' && toastError(error);

    return (
      <Fragment>

        <div id={'add-payment-method'} className="col-md-6 mx-auto col-md-offset-3">
          <form
            id={'payment-method'}
            name="add-payment-method"
            className={"mx-auto px-3"}
            onSubmit={this.handleSubmit}
          >
            <legend>
              <FormattedMessage
                id={"app.billing_details"}
                defaultMessage={"Information de facturation"}
                description={"Billing details"}
              />
            </legend>
            <Field
              component={this.renderField}
              name="ownerFullname"
              type="text"
              labelText={intl.formatMessage({
                id: "app.bank_account.owner_fullname",
                defaultMessage: "Nom complet du propriétaire de la carte",
                description: "Bank account - Owner fullname"
              })}
              placeholder="Dubois Charlie"
              onChange={this.handleChange}
            />
            <Field
              component={this.renderField}
              name="email"
              type="text"
              labelText={intl.formatMessage({
                id: "app.bank_account.email.optional",
                defaultMessage: "E-mail (optionnel)",
                description: "Billing details - Email"
              })}
              placeholder="dubois.charlie@gmail.com"
              onChange={this.handleChange}
            />
            <Field
              component={this.renderField}
              name="phone_number"
              type="text"
              labelText={intl.formatMessage({
                id: "app.bank_account.phone_number.optional",
                defaultMessage: "Numéro de téléphone (optionnel)",
                description: "Billing details - Phone number"
              })}
              placeholder="+32499569823"
              onChange={this.handleChange}
            />

            {/* Stripe card form */}
            <legend>
              <FormattedMessage
                id={"app.payment_details"}
                defaultMessage={"Information de paiement"}
                description={"payment details"}
              />
            </legend>
            <FormGroup className={'my-3'}>
              <label htmlFor="id-card">
                <FormattedMessage
                  id={"app.card_details"}
                  defaultMessage={"Informations de la carte"}
                  description={"Card details"}
                />
              </label>
              <div className={'px-1 py-2 border bg-white'}>
                <CardElement
                  id={'id-card'}
                  options={{
                    style: {
                      //iconStyle: 'solid',
                      base: {
                        iconColor: '#F5A54C',
                        color: '#303238',
                        backgroundColor: 'white',
                        fontSize: '16px',
                        fontFamily: '"Nunito", "Dosis", "Open Sans", sans-serif',
                        fontSmoothing: 'antialiased',
                        margin: "1rem !important",
                        border: "1px #fff !important",
                        ':-webkit-autofill': {
                          color: '#fce883',
                        },
                        '::placeholder':{
                          color: "#303238"
                        }
                      },
                      invalid: {
                        iconColor: '#e5424d',
                        color: '#e5424d',
                        '::focus': {
                          color: '#303238'
                        }
                      },
                    }
                  }}
                />
              </div>

            </FormGroup>




            <div className="d-flex justify-content-center">
              <button className="btn btn-primary login mx-2 my-3">
                { loading === true && <Spinner color={'info'} className={'mr-2'}/> }
                <FormattedMessage  id={"app.button.validate"}
                                   defaultMessage="Valider"
                                   description="Button - login"
                />
              </button>
              <Link to="/register" className="btn btn-outline-primary mx-2 my-3">
                <FormattedMessage  id={"app.button.cancel"}
                                   defaultMessage="Annuler"
                                   description="Button - Cancel"
                />
              </Link>
            </div>
          </form>
        </div>
      </Fragment>

    );
  }
}

const mapStateToProps = state => {
  const { created, loading, error} = state.bankaccount.create;

  return { created, loading, error };
};

const mapDispatchToProps = dispatch => ({
  create : (data, history, location) => dispatch(create(data, history, location)),
  logout: () => dispatch( logout())
});

const PaymentMethodForm = (props) => (
  <ElementsConsumer>
    {(stripe, elements) => (
      <AddPaymentMethodForm stripe={stripe} elements={elements} {...props}/>
    )}
  </ElementsConsumer>
);

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({
    form: 'add-payment-method',
    enableReinitialize: true,
    keepDirtyOnReinitialize: true
  })(injectIntl(withRouter(PaymentMethodForm)))
);
