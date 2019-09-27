/**
 * Author: iracanyes
 * Date: 9/23/19
 * Description: Form for the delivery address
 */
import React from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Row,
  Col,
  Fieldset
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { injectIntl } from 'react-intl';
import { list } from '../../actions/address/list';

class DeliveryAddressForm extends React.Component {
  static propTypes = {
    retrieved: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    list: PropTypes.func.isRequired
  };

  constructor(props)
  {
    super(props);

    this.state = {
      existingAddress: 0,
      newAddress: {}
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    if(localStorage.getItem('user'))
    {
      this.props.list(this.props.history);
    }else{
      this.props.history.push('login');
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

  handleSubmit(e)
  {}


  render() {
    const { intl } = this.props;

    return (
      <div className={"col-6 mx-auto"}>
        <div>
          {/* Breadcrumb */}
          <div className="col-12 px-0">

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
              <Row>
                <Col>
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
                    onChange={this.handleChange}
                    value={this.state.existingAddress}
                  >
                    {this.props.retrieved.map(item => (
                      <option value={ item.id }>
                        <span>{ item.street + ' ' }</span>

                      </option>
                    ))}


                  </Field>
                </Col>
                <Col>
                  <Button outline color={'info'} className={'mx-auto'}>Ajouter une adresse</Button>
                </Col>
              </Row>
            )}

            <Row id={'newAddress'}>
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
                  name="street_number"
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
            <Row>
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
            <Row>
              <Col>
                <Field
                  component={this.renderField}
                  name="zip_code"
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
            {/*
            <Row>
              <Col>
                <Field
                  component={this.renderField}
                  name="lastname"
                  type="text"
                  placeholder="Dubois"
                  required={true}
                  labelText={intl.formatMessage({
                    id: "app.user.item.lastname",
                    defaultMessage: "Nom",
                    description: "User item - lastname"
                  })}
                  onChange={this.handleChange}
                  value={user.lastname}
                />
              </Col>
              <Col>
                <Field
                  component={this.renderField}
                  name="firstname"
                  type="text"
                  placeholder="Timothy"
                  required={true}
                  labelText={intl.formatMessage({
                    id: "app.user.item.firstname",
                    defaultMessage: "Prénom",
                    description: "User item - firstname"
                  })}
                  onChange={this.handleChange}
                  value={user.firstname}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <label
                  htmlFor={'userType'}
                  className="form-control-label"
                >
                  <FormattedMessage  id={"app.user.item.user_type"}
                                     defaultMessage="Type d'utilisateur"
                                     description="User item - user type"

                  />
                </label>
                &nbsp;:&nbsp;
                <Field
                  component={"select"}
                  name="userType"
                  type="select"
                  placeholder=""
                  onChange={this.handleChange}
                  value={this.state.user.userType}
                >
                  <option value="customer">
                    { intl.formatMessage({
                      id: "app.user.item.user_type.client",
                      description: "User item - user type client",
                      defaultMessage: "Client"
                    })}
                  </option>
                  <option value="supplier">
                    { intl.formatMessage({
                      id: "app.user.item.user_type.supplier",
                      description: "User item - user type supplier",
                      defaultMessage: "Fournisseur"
                    })}

                  </option>
                </Field>
              </Col>

            </Row>
            <Row>
              <Col>

                <div className={`form-group d-flex`}>
                  <input
                    name="termsAccepted"
                    type="checkbox"
                    className={'form-control col-1'}
                    required={true}
                    id={`user_termsAccepted`}
                    onChange={this.handleChange}
                    value={true}
                  />
                  <label
                    htmlFor={`user_termsAccepted`}
                    className="form-control-label"
                  >
                    J'accepte les condition d'utilisation de la plateforme. <Link to={'/terms_condition'}>Voir termes et conditions</Link> <br/>
                    J'autorise l'exploitation de mes données personnelles fournis à cette plateforme dans les limites indiquées par les <Link to={'/rgpd'}>Utilisations des données personnelles</Link>
                  </label>


                </div>
              </Col>
            </Row>
            <Row>
              <button type="submit" className="btn btn-success my-3 mx-2">
                Envoyer
              </button>
              <Link to={"/login"} className={"btn btn-outline-danger my-3 mx-2"}>
                Annuler
              </Link>
            </Row>
            */}

          </form>
          <div className="col-4 d-flex mx-auto mt-3">
            { true && (
              <Button outline color={"success"} className={'mr-3'} onClick={() => this.props.history.push('/payment')}>
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
  const { retrieved, error, loading } = state.address.list;

  return { retrieved, error, loading };
};

const mapDispatchToProps = dispatch => ({
  list: (history) => dispatch( list(history))
});

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({
    form: 'delivery-address',
    enableReinitialize: true,
    keepDirtyOnReinitialize: true
  })(injectIntl(DeliveryAddressForm))
);
