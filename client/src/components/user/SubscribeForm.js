/**
 * Author: iracanyes
 * Date: 02/09/2019
 * Description:
 */
import React,{ Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Col, Row } from "reactstrap";
import { FormattedMessage, injectIntl } from "react-intl";
import { subscribe, retrieve, reset } from "../../actions/user/subscribe";
import DropzoneWithPreviews from "../image/dropzone/DropzoneWithPreviews";
import PropTypes from 'prop-types';
import {toastError} from "../../layout/ToastMessage";

class SubscribeForm extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    retrieved: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    errorSubscribe: PropTypes.string,
    eventSource: PropTypes.instanceOf(EventSource),
    retrieve: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      user: {
        id: '',
        email: '',
        firstname: '',
        lastname: '',
        userType: '',
        termsAccepted: null,
        currency: 'EUR',
        language: 'FR',
      },
      submitted: false
    };


    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChangeInputImage = this.onChangeInputImage.bind(this);
  }

  componentDidMount() {
    /* Récupération de l'utilisateur temporaire via son token */
    this.props.retrieve(decodeURIComponent(this.props.match.params.token));


  }


  componentWillUnmount() {
    this.props.reset(this.props.eventSource);
  }

  onChangeInputImage(e)
  {
    const { input : { onChangeInputImage }} = this.props;
    onChangeInputImage(e.target.files[0]);
  }

  handleSubmit(e)
  {
    e.preventDefault();

    this.setState({ submitted: true });

    // Récupération des données de formulaires
    const data = new FormData(document.getElementById('subscribe-form'));

    data.append("userType", this.props.retrieved.userType);
    data.append("token", this.props.match.params.token);
    // Ajout des images du formulaire
    data.append("images", document.getElementsByName('images')[0].files);

    this.props.subscribe(data, this.props.history);

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
      <div className={`form-group h-100`}>
        <label
          htmlFor={`user_${data.input.name}`}
          className={"form-control-label "+ data.labelClassName}
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

  /* A faire : une fonction d'affichage d'input checkbox avec les données méta
  renderCheckbox = data => {
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
  */

  render() {
    const { intl, errorSubscribe  } = this.props;

    console.log("Render error", errorSubscribe);
    errorSubscribe && typeof errorSubscribe === "string" && toastError(errorSubscribe);

    return (
      <Fragment>
        <div className={"user-authentication-form my-3"}>
          <h1>
            <FormattedMessage  id={"app.page.user.subscribe.title"}
                               defaultMessage="Devenir membre"
                               description="Page User - Subscribe title"
            />
          </h1>
          <div className={"col-lg-6 mx-auto px-3"}>
            {this.props.error && (
              <div className="alert alert-danger" role="alert">
                <span className="fa fa-exclamation-triangle" aria-hidden="true" />{' '}
                {this.props.error}
              </div>
            )}
          </div>
          { this.props.retrieved !== null && (
            <form
              id="subscribe-form"
              name="subscribe"
              className={"col-lg-6 mx-auto px-3"}
              onSubmit={this.handleSubmit}
              /* Si la clé change un réaffichage du composant est lancé */
              key={this.props.retrieved.id}
              autoComplete={"on"}
            >
              <fieldset>
                <legend>Information utilisateur</legend>
                <fieldset>
                  <Row>
                    <Col>
                      <Field
                        component={this.renderField}
                        name="email"
                        type="email"
                        placeholder={this.props.retrieved.email}
                        labelText={intl.formatMessage({
                          id: "app.user.item.email",
                          defaultMessage: "Email",
                          description: "User item - email"
                        })}
                        value={this.props.retrieved.email}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Field
                        component={this.renderField}
                        name="lastname"
                        type="text"
                        placeholder={this.props.retrieved.lastname}
                        required={true}
                        labelText={intl.formatMessage({
                          id: "app.user.item.lastname",
                          defaultMessage: "Nom",
                          description: "User item - lastname"
                        })}
                      />
                    </Col>
                    <Col>
                      <Field
                        component={this.renderField}
                        name="firstname"
                        type="text"
                        placeholder={this.props.retrieved.firstname}
                        required={true}
                        labelText={intl.formatMessage({
                          id: "app.user.item.firstname",
                          defaultMessage: "Prénom",
                          description: "User item - firstname"
                        })}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col className={'mb-3'}>
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
                        className={'custom-select ml-2 col-2'}
                        disabled={'disabled'}
                        value={this.props.retrieved.userType ? this.props.retrieved.userType : ''}

                      >
                        <option value="customer" >
                          { intl.formatMessage({
                            id: "app.user.item.user_type.client",
                            description: "User item - user type client",
                            defaultMessage: "Client"
                          })}
                        </option>
                        <option value="supplier"  >
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
                      <label
                        htmlFor={'language'}
                        className="form-control-label"
                      >
                        <FormattedMessage  id={"app.user.item.language"}
                                           defaultMessage="Préférence de langue"
                                           description="User item - preferred language"

                        />
                      </label>
                      &nbsp;:&nbsp;
                      <Field
                        component={"select"}
                        name="language"
                        type="select"
                        className={'custom-select d-block col-4'}
                        value={this.state.user.language}
                      >
                        <option value="FR">
                          { intl.formatMessage({
                            id: "app.user.item.language.fr",
                            description: "User item - language french (FR)",
                            defaultMessage: "Français"
                          })}
                        </option>
                        <option value="EN">
                          { intl.formatMessage({
                            id: "app.user.item.language.en",
                            description: "User item - language english (EN)",
                            defaultMessage: "Anglais"
                          })}

                        </option>
                        <option value="RN">
                          { intl.formatMessage({
                            id: "app.user.item.language.rn",
                            description: "User item - language kirundi (RN)",
                            defaultMessage: "Kirundi"
                          })}

                        </option>
                      </Field>
                    </Col>
                    <Col>
                      <label
                        htmlFor={'currency'}
                        className="form-control-label"
                      >
                        <FormattedMessage  id={"app.user.item.currency"}
                                           defaultMessage="Préférence monétaire"
                                           description="User item - preferred currency"

                        />
                      </label>
                      &nbsp;:&nbsp;
                      <Field
                        component={"select"}
                        name="currency"
                        type="select"
                        className={'custom-select d-block col-4'}
                        value={this.state.user.currency}
                      >
                        <option value="EUR">
                          { intl.formatMessage({
                            id: "app.user.item.currency.eur",
                            description: "User item - currency EUR",
                            defaultMessage: "Euro"
                          })}
                        </option>
                        <option value="USD">
                          { intl.formatMessage({
                            id: "app.user.item.currency.usd",
                            description: "User item - currency USD",
                            defaultMessage: "Dollar"
                          })}

                        </option>
                        <option value="BIF">
                          { intl.formatMessage({
                            id: "app.user.item.currency.bif",
                            description: "User item - currency BIF",
                            defaultMessage: "Francs Burundais"
                          })}

                        </option>
                      </Field>
                    </Col>
                  </Row>
                </fieldset>

              <fieldset>
                <legend>Image du {this.props.retrieved.userType === "customer" ? "client" : "fournisseur"}</legend>
                <Row>
                  <DropzoneWithPreviews label={this.props.retrieved.userType === "customer" ? "Image de profil" : "Logo de l'entreprise"}/>
                </Row>
              </fieldset>

              {this.props.retrieved.userType === 'supplier' && (
                <fieldset>
                  <fieldset className={'mt-2'}>
                    <legend>Information fournisseur</legend>
                    <Row>
                      <Col>
                        <Field
                          component={this.renderField}
                          name="socialReason"
                          type="text"
                          placeholder={"Ex: Google LLC"}
                          required={true}
                          labelText={intl.formatMessage({
                            id: "app.supplier.item.social_reason",
                            defaultMessage: "Raison sociale",
                            description: "Supplier item - social reason"
                          })}
                          autoComplete={'on'}
                        />
                      </Col>
                      <Col>
                        <Field
                          component={this.renderField}
                          name="brandName"
                          type="text"
                          placeholder={"Ex: Google"}
                          required={true}
                          labelText={intl.formatMessage({
                            id: "app.supplier.item.brand_name",
                            defaultMessage: "Nom de marque",
                            description: "Supplier item - brand name"
                          })}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Field
                          component={this.renderField}
                          name="tradeRegistryNumber"
                          type="text"
                          placeholder={"0000000000000"}
                          required={true}
                          labelText={intl.formatMessage({
                            id: "app.supplier.item.trade_registry_number",
                            defaultMessage: "Numéro de registre commercial",
                            description: "Supplier item - trade registry number"
                          })}
                        />
                      </Col>
                      <Col>
                        <Field
                          component={this.renderField}
                          name="vatNumber"
                          type="text"
                          placeholder={"00000000"}
                          required={true}
                          labelText={intl.formatMessage({
                            id: "app.supplier.item.vat_number",
                            defaultMessage: "Numéro TVA",
                            description: "Supplier item - VAT number"
                          })}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Field
                          component={this.renderField}
                          name="contactFullname"
                          type="text"
                          placeholder={"Dubois Charles"}
                          required={true}
                          labelText={intl.formatMessage({
                            id: "app.supplier.item.contact_fullname",
                            defaultMessage: "Nom complet personne de contact",
                            description: "Supplier item - contact fullname"
                          })}
                        />
                      </Col>
                      <Col>
                        <Field
                          component={this.renderField}
                          name="contactPhoneNumber"
                          type="text"
                          placeholder={"Ex: +257 22 _ _ _ _ _ _ "}
                          required={true}
                          labelText={intl.formatMessage({
                            id: "app.supplier.item.contact_phone_number",
                            defaultMessage: "Numéro de téléphone personne de contact",
                            description: "Supplier item - contact phone number"
                          })}
                        />
                      </Col>

                    </Row>
                    <Row>
                      <Col>
                        <Field
                          component={this.renderField}
                          name="contactEmail"
                          type="email"
                          placeholder={"Ex: contact@monsite.ext "}
                          required={true}
                          labelText={intl.formatMessage({
                            id: "app.supplier.item.contact_email",
                            defaultMessage: "E-mail personne de contact",
                            description: "Supplier item - contact email"
                          })}
                        />
                      </Col>
                      <Col>
                        <Field
                          component={this.renderField}
                          name="website"
                          type="text"
                          placeholder={"www.google.com"}
                          labelText={intl.formatMessage({
                            id: "app.supplier.item.website",
                            defaultMessage: "Site web",
                            description: "Supplier item - website"
                          })}
                        />
                      </Col>
                    </Row>

                  </fieldset>
                  <fieldset>
                    <legend>Siége social</legend>
                    <Row>
                      <Col className={'mb-3'}>
                        <label
                          htmlFor={'address[locationName]'}
                          className="form-control-label"
                        >
                          <FormattedMessage  id={"app.address.item.location_name"}
                                             defaultMessage="Type d'adresse"
                                             description="Address item - location name"

                          />
                        </label>
                        &nbsp;:&nbsp;
                        <Field
                          component={"select"}
                          name='address[locationName]'
                          type="select"
                          className={'custom-select ml-2 col-2'}
                          disabled={'disabled'}
                        >
                          <option value="Head office" selected>
                            { intl.formatMessage({
                              id: "app.address.item.location_name.head_office",
                              description: "Address item - location name : head office",
                              defaultMessage: "Siége social"
                            })}
                          </option>
                          <option value="Delivery address" >
                            { intl.formatMessage({
                              id: "app.address.item.location_name.head_office",
                              description: "Address item - location name : head office",
                              defaultMessage: "Adresse de livraison"
                            })}

                          </option>
                          <option value="Billing address" >
                            { intl.formatMessage({
                              id: "app.address.item.location_name.billing_address",
                              description: "Address item - location name : billing address",
                              defaultMessage: "Adresse de facturation"
                            })}

                          </option>
                        </Field>
                      </Col>

                    </Row>
                    <Row>
                      <Col>
                        <Field
                          component={this.renderField}
                          name='address[street]'
                          type="text"
                          placeholder={"Ex: Rue du collège"}
                          required={true}
                          labelText={intl.formatMessage({
                            id: "app.address.item.street",
                            defaultMessage: "Nom de rue",
                            description: "Address item - street"
                          })}
                        />
                      </Col>
                      <Col>
                        <Field
                          component={this.renderField}
                          name='address[number]'
                          type="text"
                          placeholder={"Ex: 98/110"}
                          required={true}
                          labelText={intl.formatMessage({
                            id: "app.address.item.number",
                            defaultMessage: "Numéro",
                            description: "Address item - number"
                          })}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Field
                          component={this.renderField}
                          name='address[town]'
                          type="text"
                          placeholder={"EX: Zaventem"}
                          required={true}
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
                          name='address[state]'
                          type="text"
                          placeholder={"Ex: Bruxelles"}
                          required={true}
                          labelText={intl.formatMessage({
                            id: "app.address.item.state",
                            defaultMessage: "État/Province/Région",
                            description: "Address item - state"
                          })}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Field
                          component={this.renderField}
                          name='address[zipCode]'
                          type="text"
                          placeholder={"1000"}
                          required={true}
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
                          name='address[country]'
                          type="text"
                          placeholder={"Ex: Belgium"}
                          required={true}
                          labelText={intl.formatMessage({
                            id: "app.address.item.country",
                            defaultMessage: "Numéro de téléphone personne de contact",
                            description: "Address item - country"
                          })}
                        />
                      </Col>

                    </Row>

                  </fieldset>
                </fieldset>
              )}

                <Row className={'pt-3'}>
                  <Col>
                    <div className={`form-group d-flex`}>
                      <input
                        name="termsAccepted"
                        type="checkbox"
                        className={'mx-2'}
                        style={{position: 'absolute', top: '10px'}}
                        required={true}
                        id={`user_termsAccepted`}
                      />
                      <label
                        htmlFor={`user_termsAccepted`}
                        className="form-control-label  col-10 ml-5"
                      >
                        J'accepte les conditions d'utilisation de la plateforme. <Link to={'/terms_condition'}>Voir termes et conditions</Link> <br/>
                        J'autorise l'exploitation de mes données personnelles fournies à cette plateforme dans les limites indiquées par le réglement d'<Link to={'/rgpd'}>Utilisations des données personnelles</Link>
                      </label>


                    </div>
                  </Col>
                </Row>
                <Row>
                  <button type="submit" className="btn btn-success my-3 mx-2">
                    <FormattedMessage  id={"app.button.continue"}
                                       defaultMessage="Continuer"
                                       description="App button - continue"

                    />
                  </button>
                  <Link to={"/unsubscribe/"+ this.props.match.params.token} className={"btn btn-outline-danger my-3 mx-2"}>
                    <FormattedMessage  id={"app.button.cancel_subscribe"}
                                       defaultMessage="Annuler"
                                       description="App button - cancel"

                    />
                  </Link>
                </Row>
              </fieldset>

            </form>
          )}

        </div>
      </Fragment>

    );
  }
}

const mapStateToProps = state => {
  const { subscribing, retrieved, error, loading, eventSource } = state.user.subscription;

  /* Retourner les données récupèrés en DB sous le nom "initialValues" permet à redux-form d'initialiser le formulaire à ces valeurs */
  return { subscribing, retrieved, initialValues: retrieved, errorSubscribe: error, loading, eventSource };
};

const mapDispatchToProps = dispatch => ({
  subscribe: (user, history) => dispatch( subscribe(user, history)),
  retrieve: token => dispatch(retrieve(token)),
  reset: eventSource => dispatch(reset(eventSource))
});

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({
    form: 'subscribe',
    enableReinitialize: true,
    keepDirtyOnReinitialize: true
  })(injectIntl(SubscribeForm))
)
