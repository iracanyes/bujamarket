
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Row,
  Col,
  Spinner
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { injectIntl } from 'react-intl';
import { list, reset as resetAddresses } from '../../actions/address/list';
import { list as listShipper, reset as resetShipper } from '../../actions/shipper/list';
import { create } from '../../actions/orderset/create';
import {SpinnerLoading} from "../../layout/Spinner";
import {toastError} from "../../layout/ToastMessage";

class DeliveryAddressForm extends React.Component {
  static propTypes = {
    retrievedAddresses: PropTypes.object,
    retrievedShipper: PropTypes.object,
    loadingAddresses: PropTypes.bool.isRequired,
    loadingShipper: PropTypes.bool.isRequired,
    errorAddresses: PropTypes.string,
    list: PropTypes.func.isRequired,
    resetAddresses: PropTypes.func.isRequired,
    eventSourceAddresses: PropTypes.instanceOf(EventSource)
  };

  constructor(props)
  {
    super(props);

    this.state = {
      existingAddress: 0,
      toggleNewAddressForm: false,
      newAddress: {}
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showFormNewAddress = this.showFormNewAddress.bind(this);
  }

  componentDidMount() {
    /* Si token existant, on charge les adresses existantes. Sinon redirection vers la page de connexion */
    if(localStorage.getItem('token') !== null )
    {
      /* Récupération des adresses existantes  */
      this.props.list(this.props.history);
      /* Récupération des transporteurs disponibles */
      this.props.listShipper(this.props.history, this.props.location.pathname);
    }else{

      this.props.history.push({
        pathname: 'login',
        state: {
          from: this.props.location.pathname
        }
      });


    }
  }

  componentWillUnmount() {
    this.props.reset(this.props.eventSource);
  }

  showFormNewAddress()
  {
    if(this.state.toogleNewAddressForm === false){
      // Désactivation du choix parmi les adresses existantes
      document.getElementsByName('existingAddress')[0].setAttribute('disabled', "");
      // Remise à zéro du choix parmi les adresses existantes
      document.getElementsByName('existingAddress')[0].getElementsByTagName('option')[0].selected = 'selected';
      this.setState(state => ({
        ...state,
        toggleNewAddressForm: !state.toggleNewAddressForm
      }));
    }else{
      document.getElementsByName('existingAddress')[0].removeAttribute('disabled');
      this.setState(state => ({
        ...state,
        toggleNewAddressForm: !state.toggleNewAddressForm
      }));
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
          htmlFor={`user_${data.input.name}`}
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

  handleChange(e)
  {
    let value = e.target.value;

    let shipper =  this.props.retrievedShipper && this.props.retrievedShipper['hydra:member'].filter(item => item.id === parseInt(value) )[0];

    let shopping_cart = localStorage.getItem("shopping_cart") ? JSON.parse(localStorage.getItem("shopping_cart")) : [];

    let sum = 0;
    shopping_cart.forEach( item => sum += parseFloat(item.price) * item.quantity );

    document.getElementById('list-shipper-choice-social-reason').innerHTML = shipper.socialReason;

    /* Calcul et affichage du coût de transport*/
    let deliveryCost = 0;

    document.getElementById('list-shipper-choice-price').innerHTML = deliveryCost+ '€';

    /* Affichage du coût total */
    document.getElementById('list-total-price').innerHTML = parseFloat(sum + deliveryCost).toFixed(2) + '€';


  }

  handleSubmit()
  {
    /* Récupération des données du formulaire */
    const data = new FormData(document.getElementById('delivery-address-form'));

    const delivery_address = {
      shipper: data.get('shipper') ? data.get('shipper') : 0,
      existingAddress: data.get('existingAddress') ? data.get('existingAddress') : 0,
      newAddress: {
        street: data.get('street') ? data.get('street') : "",
        number: data.get('streetNumber') ? data.get('streetNumber') : "",
        town: data.get('town') ? data.get('town') : "",
        state: data.get('state') ? data.get('state') : "",
        zipCode: data.get('zipCode') ? data.get('zipCode') : "",
        country: data.get('country') ? data.get('country') : ""

      }
    };

    if(delivery_address.shipper === 0){
      toastError('Choix du transporteur manquant!');
    }

    if(!( delivery_address.existingAddress !== 0 || (delivery_address.newAddress.street !== "" && delivery_address.newAddress.town !== "" && delivery_address.newAddress.state !== "" && delivery_address.newAddress.zipCode !== "" && delivery_address.newAddress.country !== "" ))){
      toastError("Choix de l'adresse de livraison manquant ou incomplet!");
      return;
    }

    if(delivery_address.shipper !== 0 && ( delivery_address.existingAddress !== 0 || (delivery_address.newAddress.street !== "" && delivery_address.newAddress.town !== "" && delivery_address.newAddress.state !== "" && delivery_address.newAddress.zipCode !== "" && delivery_address.newAddress.country !== "" )))
    {
      this.props.create(delivery_address, this.props.history, this.props.location.pathname);
    }


  }


  render() {
    const { intl, loading, errorCreate } = this.props;

    typeof errorCreate === "string" && toastError(errorCreate);
    /* Clé pour la liste des courses */
    let key= 1;
    /* Récupération du panier de commande */
    let shopping_cart = localStorage.getItem("shopping_cart") ? JSON.parse(localStorage.getItem("shopping_cart")) : [];

    /* Calcul de la somme du panier de commande */
    let sum = 0;
    shopping_cart.forEach( item => sum += parseFloat(item.price) * item.quantity );


    return (
      <Fragment>
        <div>
          {/* Breadcrumb */}
          <div className="col-lg-12 px-0">

            <nav className="navbar navbar-expand-md navbar-dark bg-primary mb-5 no-content w-100">

              <div className="col-12 mr-auto">
                <nav aria-label="breadcrumb" className={"w-100 bg-primary text-white"}>
                  <ol className="breadcrumb clearfix d-none d-md-inline-flex p-0 w-100 mb-0 bg-primary">
                    <li className="" onClick={() => this.props.history.push('..')}>
                      <FormattedMessage  id={"app.page.shopping_cart.shopping_cart_validation"}
                                         defaultMessage="Validation du panier de commande"
                                         description="App - Delivery address"
                      />
                      <FontAwesomeIcon icon={'angle-double-right'} className={'mx-2 text-white'} aria-hidden={'true'}/>

                    </li>
                    <li className="">
                      <b>
                          <span className="text-white">
                            <FormattedMessage  id={"app.delivery_address"}
                                               defaultMessage="Adresse de livraison"
                                               description="App - Delivery address"
                            />

                          </span>
                      </b>

                      <FontAwesomeIcon icon={'angle-double-right'} className={'mx-2 text-white'} aria-hidden={'true'}/>

                    </li>
                    <li className="">
                        <span className="text-white" >
                          <FormattedMessage  id={"app.payment"}
                                             defaultMessage="Paiement"
                                             description="App - Payment"
                          />

                        </span>
                      <FontAwesomeIcon icon={'angle-double-right'} className={'mx-2 text-white'} aria-hidden={'true'}/>

                    </li>
                    <li className="breadcrumb-item">
                        <span>
                          <FormattedMessage  id={"app.bill"}
                                             defaultMessage="Facture"
                                             description="App - bill"
                          />
                        </span>
                    </li>
                  </ol>
                </nav>
              </div>

            </nav>

          </div>
        </div>
        <Row className={'flex-row p-3'}>
          <div className={"col-lg-8 col-xs-12"}>
            <div className={"order-md-4"}>
              <h4 className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-muted">Adresse de livraison</span>
              </h4>
              <form
                id="delivery-address-form"
                name="delivery-address"
                className={" mx-auto px-3"}
                onSubmit={() => this.handleSubmit()}
              >
                {this.props.loadingShipper && <SpinnerLoading message={'Chargement des transporteurs de la plateforme!'} />}
                {/* Transporteur */}
                {this.props.retrievedShipper && (
                  <div className="row px-3">
                    <Row className={'w-100 my-3'}>
                      <Col lg={9}>
                        <label
                          htmlFor={'shipper'}
                          className="form-control-label"
                        >
                          <FormattedMessage  id={"app.form.delivery_address.shipper"}
                                             defaultMessage="Transporteur"
                                             description="Form delivery address - shipper"

                          />
                        </label>
                        &nbsp;:&nbsp;
                        <Field
                          component={"select"}
                          name="shipper"
                          type="select"
                          className={'form-control'}
                          onChange={this.handleChange}
                          value={this.state.existingAddress}
                        >
                          <option value="">--Choisir parmi nos expéditeurs--</option>
                          {this.props.retrievedShipper && this.props.retrievedShipper['hydra:member'].map(item => (
                            <option value={ item.id } key={item.id}>
                              { item.socialReason }
                            </option>
                          ))}


                        </Field>
                      </Col>

                    </Row>
                  </div>
                )}

                {/* Adresses existantes */}
                {this.props.retrievedAddresses && this.props.retrievedAddresses['hydra:member'] !== null && (
                  <div className="row px-3">
                    <Row className={'w-100 my-3'}>
                      <Col lg={9}>
                        <label
                          htmlFor={'existingAddress'}
                          className="form-control-label"
                        >
                          <FormattedMessage  id={"app.form.delivery_address.existing_address"}
                                             defaultMessage="Adresse enregistrée"
                                             description="Form delivery address - existing address"

                          />
                        </label>
                        &nbsp;:&nbsp;
                        <Field
                          component={"select"}
                          name="existingAddress"
                          type="select"
                          className={'form-control'}
                          value={this.state.existingAddress}
                          disabled={this.state.toggleNewAddressForm}
                        >
                          <option value="">--Choisir parmi les adresses déjà enregistrées--</option>
                          {this.props.retrievedAddresses && this.props.retrievedAddresses['hydra:member'] && this.props.retrievedAddresses['hydra:member'].map(item => (
                            <option value={ item.id } key={item.id}>
                              { item.street.toLowerCase().trim().split(' ')
                                .map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
                                .join(' ') + " " + item.number + " "
                              + item.town +" " + item.state + " "
                              + item.zipCode + " " + item.country }

                            </option>
                          ))}


                        </Field>
                      </Col>
                      <Col>
                        <Button outline id={'add-address'} color={'info'} className={'mx-auto border-info'} onClick={this.showFormNewAddress}>Livrer à une autre adresse</Button>
                      </Col>
                    </Row>
                  </div>

                )}
                {this.state.toggleNewAddressForm === true && (
                  <div id={'newAddress'} className={'row pl-3'}>
                    <Row className={'w-100'}>
                      <Col>
                        <Field
                          component={this.renderField}
                          name="street"
                          type="text"
                          placeholder="Rue neuve"
                          labelText={intl.formatMessage({
                            id: "app.address.item.street",
                            defaultMessage: "Rue",
                            description: "Address item - street"
                          })}
                        />
                      </Col>
                      <Col>
                        <Field
                          component={this.renderField}
                          name="streetNumber"
                          type="text"
                          placeholder="9/101  "
                          labelText={intl.formatMessage({
                            id: "app.address.item.street_number",
                            defaultMessage: "N° de rue",
                            description: "Address item - street number"
                          })}
                        />
                      </Col>
                    </Row>
                    <Row className={'w-100'}>
                      <Col>
                        <Field
                          component={this.renderField}
                          name="town"
                          type="text"
                          placeholder="Schaerbeek"
                          labelText={intl.formatMessage({
                            id: "app.address.item.town",
                            defaultMessage: "Ville",
                            description: "Address item - town"
                          })}
                        />
                      </Col>
                      <Col>
                        <Field
                          component={this.renderField}
                          name="state"
                          type="text"
                          placeholder="Bruxelles"
                          labelText={intl.formatMessage({
                            id: "app.address.item.state",
                            defaultMessage: "Province/Région/État",
                            description: "Address item - state"
                          })}
                        />
                      </Col>
                    </Row>
                    <Row className={'w-100'}>
                      <Col>
                        <Field
                          component={this.renderField}
                          name="zipCode"
                          type="text"
                          placeholder="1000"
                          labelText={intl.formatMessage({
                            id: "app.address.item.zip_code",
                            defaultMessage: "Code postal",
                            description: "Address item - zip code"
                          })}
                        />
                      </Col>
                      <Col>
                        <Field
                          component={this.renderField}
                          name="country"
                          type="text"
                          placeholder="Belgique"
                          labelText={intl.formatMessage({
                            id: "app.address.item.country",
                            defaultMessage: "Pays",
                            description: "Address item - country"
                          })}
                        />
                      </Col>
                    </Row>
                  </div>
                )}




              </form>
              <div className="col-4 d-flex mx-auto mt-3">
                {/* Créer une fonction qui vérifie que tout le formulaire soit complet (adresse existante ou nouvel adresse ) */}
                <Button outline color={"success"} className={'mr-3 border-success'} onClick={this.handleSubmit}>
                  { loading && (<Spinner color={'primary'} className={'spinner mr-2'} />)}
                  <FormattedMessage  id={"app.button.validate"}
                                     defaultMessage="Valider"
                                     description="Button - validate"
                  />
                </Button>

                <Button outline color={"danger"} className={'border-danger'} onClick={() => this.props.history.push('..')}>
                  <FormattedMessage  id={"app.button.cancel"}
                                     defaultMessage="Annuler"
                                     description="Button - cancel"
                  />
                </Button>
              </div>

            </div>
          </div>
          <div id={"delivery-address-shopping-cart"} className="col col-md-4 order-md-2 mb-4">
            <h4 className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted">Coût total</span>
              <span className="badge badge-secondary badge-pill">{shopping_cart.length}</span>
            </h4>
            <ul className="list-group mb-3">
              {
                shopping_cart.map( item => (
                  <li className="list-group-item d-flex justify-content-between lh-condensed" key={key++}>
                    <div className={""}>
                      <h6 className="my-0">{item.title}</h6>
                      <small className="text-muted">{item.description}</small>
                    </div>
                    <div>
                      <span className="text-muted">{parseFloat(item.price).toFixed(2) + "€"}</span>
                      <br/>
                      <span className="text-muted float-right">{"x " + item.quantity}</span>
                    </div>

                  </li>
                ))
              }
              <li className="list-group-item d-flex justify-content-between lh-condensed" key={key++}>
                <div id={"list-shipper-choice"} className={""}>
                  <h6 id={"list-shipper-choice-social-reason"} className="my-0">{"Your shipping preference"}</h6>
                  <small id={"list-shipper-choice-description"} className="text-muted">{}</small>
                </div>
                <div>
                  <span id={"list-shipper-choice-price"} className="text-muted">{0 + "€"}</span>

                </div>

              </li>


              <li className="list-group-item d-flex justify-content-between" key={key++}>
                <span>Total (USD)</span>
                <strong id={'list-total-price'}>{parseFloat(sum).toFixed(2) + "€"}</strong>
              </li>
            </ul>

          </div>
        </Row>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  retrievedAddresses: state.address.list.retrieved,
  errorAddresses: state.address.list.error,
  loadingAddresses: state.address.list.loading,
  eventSourceAddresses: state.address.list.eventSource,
  retrievedShipper: state.shipper.list.retrieved,
  errorShipper: state.shipper.list.error,
  loadingShipper: state.shipper.list.loading,
  eventSourceShipper: state.shipper.list.eventSource,
  loading: state.orderset.create.loading,
  errorCreate: state.orderset.create.error,
  created: state.orderset.create.created
});

const mapDispatchToProps = dispatch => ({
  list: (history) => dispatch( list(history)),
  listShipper : (history) => dispatch( listShipper(history)),
  create: (values, history, prevRoute) => dispatch(create(values, history, prevRoute)),
  resetAddresses: eventSource => dispatch(resetAddresses(eventSource)),
  resetShipper: eventSource => dispatch( resetShipper(eventSource))
});

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({
    form: 'delivery-address',
    enableReinitialize: true,
    keepDirtyOnReinitialize: true
  })(injectIntl(DeliveryAddressForm))
);
