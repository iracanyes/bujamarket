/**
 * Date: 16/08/2019
 * Description: Form - Add Bank account - Supplier only
 */
import React, { Fragment } from 'react';
import { Link, withRouter } from "react-router-dom";
import { logout } from "../../actions/user/login";
import { create } from "../../actions/bankaccount/create";
import { getClientSecret } from "../../actions/bankaccount/getClientSecret";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { Field, reduxForm } from "redux-form";
import {
  Spinner,
  FormGroup
} from "reactstrap";
import { toastError } from "../../layout/component/ToastMessage";
import { ElementsConsumer, IbanElement,  AuBankAccountElement  } from "@stripe/react-stripe-js";


class AddBankAccountForm extends React.Component {
  constructor(props)
  {
    super(props);

    this.state= {
      type: 'iban',
      submitted: true
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);


  }

  componentDidMount() {

    const user = localStorage.getItem('token') !== null ? JSON.parse(atob(localStorage.getItem('token').split('.')[1])) : null;

    // Australian bank account
    this.props.getClientSecret(this.props.history, this.props.location);

    if(user === null)
      this.props.logout();

  }


  handleChange(e)
  {
    const { name, value } = e.target;

    this.setState({ [name] : value });
  }

  handleSubmit= async (e) => {
    /* Empêche la soumission  du formulaire  */
    e.preventDefault();

    const { history, location, retrieved } = this.props;
    const { stripe, elements } = this.props.stripe;
    /* On récupère les infos du formulaire contenu dans l'état du composant */
    const data = new FormData(document.getElementById('payment-method'));


    if( !data || !stripe || !elements )
    {
      return;
    }

    switch(data.get('type')){
      case "iban":
        const ibanElement = elements.getElement(IbanElement);

        const { error, source } = await stripe.createSource(ibanElement, {
          type: 'sepa_debit',
          currency: 'eur',
          owner:{
            name: data.get("ownerFullname"),
            email: data.get('email'),
            phone: data.get('phone_number')
          },
          mandate: {
            notification_method: "email"
          }
        });

        if(error) {
          toastError(error.message);
        }else{
          this.props.create(source, this.props.history, this.props.location);
        }
        break;
      case 'au':
        const aubankElement = elements.getElement(AuBankAccountElement);


        const result  = await stripe.confirmAuBecsDebitSetup(retrieved, {
          payment_method: {
            au_becs_debit: aubankElement,
            billing_details: {
              name: data.get('ownerFullname'),
              email: data.get('email'),
              phone: data.get('phone_number')
            }
          }
        });
        if(result.error){
          toastError(result.error.message);
        }else{
          this.props.create(result.setupIntent, history, location);
        }
        break;
      default:
        toastError("La méthode de paiement n'est pas prise en charge!");
        break;
    }

    /* Marquer la soumission du formulaire */
    this.setState({ submitted: true });
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
    const { loading, intl, error, errorClientSecret } = this.props;


    typeof error === 'string' && toastError(error);
    typeof errorClientSecret === "string" && errorClientSecret !== "" && toastError(errorClientSecret);

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
            <FormGroup>
              <label htmlFor="type">
                <FormattedMessage
                  id={'app.bank_account.type'}
                  defaultMessage={"Type de compte"}
                  description={"Bank Account - Type"}
                />
              </label>
              <select name="type" id="type" className={'form-control'} onChange={(e) =>this.handleChange(e)}>
                <option value="iban">IBAN numéro de compte</option>
                <option value="au">Australian Bank account</option>
              </select>
            </FormGroup>
            { this.state.type && this.state.type === 'iban' && (
              <FormGroup id={'iban'} className={'my-3'}>
                <label htmlFor="id-card">
                  <FormattedMessage
                    id={"app.bank_account.type.iban"}
                    defaultMessage={"IBAN"}
                    description={"Bank account - type IBAN"}
                  />
                </label>
                <div id={"card-element"} className={'px-1 py-2 border bg-white'}>
                  <div id="iban-element">
                    <IbanElement
                      options={{
                        supportedCountries: ['SEPA'],
                        style: {
                          base: {
                            fontSize: '16px',
                            color: "#32325d",
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </FormGroup>
            )}

            {this.state.type && this.state.type === "au" && (
              <FormGroup id={'aubank'} className={'my-3'}>
                <label htmlFor="id-card">
                  <FormattedMessage
                    id={"app.bank_account.type.au_bank"}
                    defaultMessage={"Australian Bank account"}
                    description={"Bank account - type IBAN"}
                  />
                </label>
                <div id={"card-element"} className={'px-1 py-2 border bg-white'}>
                  <div id="au_bank-element">
                    <AuBankAccountElement
                      options={{
                        disabled: false,
                        hideIcon: false,
                        iconStyle: "default",
                        style: {
                          base: {
                            color: '#32325d',
                            fontSize: '16px',
                            '::placeholder': {
                              color: '#aab7c4'
                            },
                            ':-webkit-autofill': {
                              color: '#32325d',
                            },
                          },
                          invalid: {
                            color: '#fa755a',
                            iconColor: '#fa755a',
                            ':-webkit-autofill': {
                              color: '#fa755a',
                            },
                          }
                        }
                      }}
                    />
                  </div>
                </div>
                {/* Display mandate acceptance text. */}
                <div className="col mt-3" id="mandate-acceptance">
                  By providing your bank account details and confirming this payment,
                  you agree to this Direct Debit Request and the <a href="https://stripe.com/au-becs-dd-service-agreement/legal">Direct Debit Request service agreement</a>
                  , and authorise Stripe Payments Australia Pty Ltd ACN 160 180 343
                  Direct Debit User ID number 507156 (“Stripe”) to debit your account
                  through the Bulk Electronic Clearing System (BECS) on behalf of
                  IS SPRL (the "Merchant") for any amounts separately
                  communicated to you by the Merchant. You certify that you are either
                  an account holder or an authorised signatory on the account listed above.
                </div>
              </FormGroup>
            )}




            <div className="d-flex justify-content-center">
              <button id={'submit-button'} className="btn btn-primary login mx-2 my-3">
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
  const { retrieved, loading: loadingClientSecret, error: errorClientSecret } = state.bankaccount.getClientSecret;

  return { created, loading, error, retrieved, loadingClientSecret, errorClientSecret };
};

const mapDispatchToProps = dispatch => ({
  create : (data, history, location) => dispatch(create(data, history, location)),
  getClientSecret: (history, location) => dispatch(getClientSecret(history, location)),
  logout: () => dispatch( logout())
});

const BankAccountForm = (props) => (
  <ElementsConsumer>
    {(stripe, elements) => (
      <AddBankAccountForm stripe={stripe} elements={elements} {...props}/>
    )}
  </ElementsConsumer>
);

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({
    form: 'add-bank-account',
    enableReinitialize: true,
    keepDirtyOnReinitialize: true
  })(injectIntl(withRouter(BankAccountForm)))
);
