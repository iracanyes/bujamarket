
import React from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Row,
  Col,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { injectIntl } from 'react-intl';
import { list, reset } from '../../actions/address/list';
import { create } from '../../actions/orderset/create';

class DeliveryAddressForm extends React.Component {
  static propTypes = {
    retrieved: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    list: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    eventSource: PropTypes.instanceOf(EventSource)
  };

  constructor(props)
  {
    super(props);

    this.state = {
      existingAddress: 0,
      newAddress: {}
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.showFormNewAddress = this.showFormNewAddress.bind(this);
  }

  componentWillMount() {
    /* Si token existant, on charge les adresses existantes. Sinon redirection vers la page de connexion */
    if(localStorage.getItem('token') !== null )
    {
      this.props.list(this.props.history);
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
    /* Affichage du formulaire pour ajouter une nouvelle adresse */
    if(document.getElementById('newAddress').style.display === 'none')
    {
      /* Affichage du formulaire d'ajout d'une nouvelle adresse */
      document.getElementById('newAddress').style.display = "flex";
      /* Désactivation du choix parmi les adresses existantes */
      document.getElementsByName('existingAddress')[0].setAttribute('disabled', "");
      /* Remise à zéro du choix parmi les adresses existantes */
      document.getElementsByName('existingAddress')[0].getElementsByTagName('option')[0].selected = 'selected';

    }else{
      document.getElementById('newAddress').style.display = "none";
      document.getElementsByName('existingAddress')[0].removeAttribute('disabled');

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

  handleSubmit()
  {
    /* Récupération des données du formulaire */
    const data = new FormData(document.getElementById('delivery-address-form'));

    console.log("Form-data",data);

    const delivery_address = {
      existingAddress: data.get('existingAddress') ? data.get('existingAddress') : 0,
      newAddress: {
        street: data.get('street') ? data.get('street') : "",
        number: data.get('streetNumber') ? data.get('streetNumber') : 0,
        town: data.get('town') ? data.get('town') : "",
        state: data.get('state') ? data.get('state') : "",
        zipCode: data.get('zipCode') ? data.get('zipCode') : "",
        country: data.get('country') ? data.get('country') : ""

      }
    };

    console.log('handle submit', delivery_address);

    if(delivery_address.existingAddress !== 0 || (delivery_address.newAddress.street !== "" && delivery_address.newAddress.town !== "" && delivery_address.newAddress.state && delivery_address.newAddress.zipCode !== "" && delivery_address.newAddress.country !== "" ))
    {
      this.props.create(delivery_address, this.props.history, this.props.location.pathname);
    }


  }


  render() {
    const { intl } = this.props;

    return (
      <div className={"col-lg-6 col-xs-12 mx-auto"}>
        <div>
          {/* Breadcrumb */}
          <div className="col-lg-12 px-0">

            <nav className="navbar navbar-expand-md navbar-dark bg-primary mb-5 no-content w-100">

              <div className="col-12 mr-auto">
                <nav aria-label="breadcrumb" className={"w-100 bg-primary text-white"}>
                  <ol className="breadcrumb clearfix d-none d-md-inline-flex p-0 w-100 mb-0 bg-primary">
                    <li className="" onClick={() => this.props.history.push('..')}>
                        <FormattedMessage  id={"app.page.shopping_card.shopping_card_validation"}
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
        <div className={"order-md-4 my-4"}>
          <h4 className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-muted">Adresse de livraison</span>

          </h4>
          {this.props.error && (
            <div className="alert alert-danger" role="alert">
              <span className="fa fa-exclamation-triangle" aria-hidden="true" />{' '}
              {this.props.error}
            </div>
          )}
          <form
            id="delivery-address-form"
            name="delivery-address"
            className={" mx-auto px-3"}
            onSubmit={this.handleSubmit}
          >
            {this.props.retrieved && (
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
                      onChange={this.handleChange}
                      value={this.state.existingAddress}
                    >
                      <option value="">--Choisir parmi les adresses déjà enregistrées--</option>
                      {this.props.retrieved && this.props.retrieved['hydra:member'].map(item => (
                        <option value={ item.id } key={item.id}>
                          { item.street.toLowerCase().split(' ')
                            .map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
                            .join(' ') + " " + item.number + " "
                          + item.town +" " + item.state + " "
                          + item.zipCode + " " + item.country }

                        </option>
                      ))}


                    </Field>
                  </Col>
                  <Col>
                    <Button outline id={'add-address'} color={'info'} className={'mx-auto'} onClick={this.showFormNewAddress}>Livrer à une autre adresse</Button>
                  </Col>
                </Row>
              </div>

            )}
            <div id={'newAddress'} className={'row pl-3'} style={{display: 'none'}}>
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



          </form>
          <div className="col-4 d-flex mx-auto mt-3">
            {/* Créer une fonction qui vérifie que tout le formulaire soit complet (adresse existante ou nouvel adresse ) */}
            { true && (
              <Button outline color={"success"} className={'mr-3'} onClick={this.handleSubmit}>
                <FormattedMessage  id={"app.button.validate"}
                                   defaultMessage="Valider"
                                   description="Button - validate"
                />
              </Button>
            )}

            <Button outline color={"danger"} onClick={() => this.props.history.push('..')}>
              <FormattedMessage  id={"app.button.cancel"}
                                 defaultMessage="Annuler"
                                 description="Button - cancel"
              />
            </Button>
          </div>

        </div>
      </div>


    );
  }
}

const mapStateToProps = state => {
  const { retrieved, error, loading, eventSource } = state.address.list;

  return { retrieved, error, loading, eventSource };
};

const mapDispatchToProps = dispatch => ({
  list: (history) => dispatch( list(history)),
  create: (values, history, prevRoute) => dispatch(create(values, history, prevRoute)),
  reset: eventSource => dispatch(reset(eventSource))
});

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({
    form: 'delivery-address',
    enableReinitialize: true,
    keepDirtyOnReinitialize: true
  })(injectIntl(DeliveryAddressForm))
);
