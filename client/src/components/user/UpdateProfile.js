/**
 * Author: iracanyes
 * Date: 21/06/2020
 * Description: Update profile component
 * Update the user's profile information
 */
import React,{ Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Col, Row } from "reactstrap";
import { FormattedMessage, injectIntl } from "react-intl";
import { update, retrieve, reset } from "../../actions/user/update";
import DropzoneWithPreviews from "../image/dropzone/DropzoneWithPreviews";
import PropTypes from 'prop-types';
import { toastError } from "../../layout/ToastMessage";
import * as ISOCountryJson from "../../config/ISOCode/ISO3166-1Alpha2.json";

class UpdateProfile extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    retrieved: PropTypes.object,
    loading: PropTypes.bool,
    //errorRetrieve: PropTypes.string,
    eventSource: PropTypes.instanceOf(EventSource),
    retrieve: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      submitted: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChangeInputImage = this.onChangeInputImage.bind(this);
  }

  componentDidMount() {
    /* Récupération de l'utilisateur temporaire via son token */
    this.props.retrieve(this.props.history, this.props.location);
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
    const data = new FormData(document.getElementById('update-profile-form'));

    // Ajout des images du formulaire
    data.append("images", document.getElementsByName('images')[0].files);

    this.props.update(data, this.props.history, this.props.location);

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


  render() {
    const { intl, retrieved, errorRetrieve, errorUpdate  } = this.props;


    errorUpdate && typeof errorUpdate === "string" && toastError(errorUpdate);
    errorRetrieve && typeof errorRetrieve === "string" && toastError(errorRetrieve);

    let user = null;
    if(retrieved){
      if(retrieved['hydra:member']) {
        user = retrieved['hydra:member'][0];
      }else {
        user = retrieved;
      }
    }


    return (
      <Fragment>
        <div className={"profile-update-form my-3"}>
          <h1>
            <FormattedMessage  id={"app.profile.update"}
                               defaultMessage="Mise à jour des données de profil"
                               description="Page User - Update profile's information"
            />
          </h1>
          { user && user !== null && (
            <form
              id="update-profile-form"
              name="update-profile"
              className={"col-lg-6 mx-auto px-3"}
              onSubmit={this.handleSubmit}
              /* Si la clé change un réaffichage du composant est lancé */
              key={user.id}
              //autoComplete={"on"}
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
                        placeholder={user.email}
                        labelText={intl.formatMessage({
                          id: "app.user.item.email",
                          defaultMessage: "Email",
                          description: "User item - email"
                        })}
                        defaultValue={user.email}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Field
                        component={this.renderField}
                        name="lastname"
                        type="text"
                        placeholder={user.lastname}
                        required={true}
                        labelText={intl.formatMessage({
                          id: "app.user.item.lastname",
                          defaultMessage: "Nom",
                          description: "User item - lastname"
                        })}
                        value={user.lastname}
                      />
                    </Col>
                    <Col>
                      <Field
                        component={this.renderField}
                        name="firstname"
                        type="text"
                        placeholder={user.firstname}
                        required={true}
                        labelText={intl.formatMessage({
                          id: "app.user.item.firstname",
                          defaultMessage: "Prénom",
                          description: "User item - firstname"
                        })}
                        value={ user.firstname }
                      />
                    </Col>
                  </Row>
                  <Row className={"px-3"}>
                    <div className={'mb-3 d-flex flex-row w-100'}>
                      <label
                        htmlFor={'userType'}
                        className="col-3 mb-0 px-0"
                      >
                        <FormattedMessage  id={"app.user.item.user_type"}
                                           defaultMessage="Type d'utilisateur"
                                           description="User item - user type"
                                           className={"m-auto"}

                        />&nbsp;:
                      </label>
                      <select
                        name="userType"
                        id="userType"
                        className={"custom-select col-4 ml-2"}
                        defaultValue={retrieved['@id'].includes('supplier') ? "supplier" : "customer"}
                        disabled={true}
                      >
                        <option value="customer" key={"customer"} >
                          { intl.formatMessage({
                            id: "app.user.item.user_type.client",
                            description: "User item - user type client",
                            defaultMessage: "Client"
                          })}
                        </option>
                        <option value="supplier" key={"supplier"}>
                          { intl.formatMessage({
                            id: "app.user.item.user_type.supplier",
                            description: "User item - user type supplier",
                            defaultMessage: "Fournisseur"
                          })}

                        </option>
                      </select>
                    </div>

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
                        className={'custom-select d-block col-6'}
                        value={user.language}
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
                        value={user.currency}
                      >
                        <option value="EUR">
                          &euro;&nbsp;
                          { intl.formatMessage({
                            id: "app.user.item.currency.eur",
                            description: "User item - currency EUR",
                            defaultMessage: "Euro"
                          })}
                        </option>
                        <option value="USD">
                          &#x00024;&nbsp;
                          { intl.formatMessage({
                            id: "app.user.item.currency.usd",
                            description: "User item - currency USD",
                            defaultMessage: "Dollar"
                          })}
                        </option>
                        <option value="BIF">
                          &#x1D539;&#x1D540;&#x1D53D;&nbsp;
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
                <legend>Image du {user.userType === "customer" ? "client" : "fournisseur"}</legend>
                <Row>
                  <DropzoneWithPreviews
                    label={retrieved["@id"].includes("customer") ? "Image de profil" : "Logo de l'entreprise"}
                    data={[{
                      "id": user.image.id,
                      "filename": user.brandName,
                      "src": user.image.url
                    }]}
                  />
                </Row>
              </fieldset>

              {retrieved['@id'].includes('supplier')  && (
                <fieldset>
                  <fieldset className={'mt-2'}>
                    <legend>Information fournisseur</legend>
                    <Row>
                      <Col>
                        <Field
                          component={this.renderField}
                          name="socialReason"
                          type="text"
                          placeholder={user.socialReason}
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
                          placeholder={user.brandName}
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
                          placeholder={user.tradeRegistryNumber}
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
                          placeholder={user.vatNumber}
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
                          placeholder={user.contactFullname}
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
                          placeholder={user.contactPhoneNumber}
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
                          placeholder={user.contactEmail}
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
                          placeholder={user.website}
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
                          name='addresses[0][locationName]'
                          type="select"
                          className={'custom-select ml-2 col-4'}
                          disabled={'disabled'}
                          value={user.addresses[0].locationName}
                        >
                          <option value="Head office">
                            { intl.formatMessage({
                              id: "app.address.item.location_name.head_office",
                              description: "Address item - location name : head office",
                              defaultMessage: "Siége social"
                            })}
                          </option>
                          <option value="Delivery address" >
                            { intl.formatMessage({
                              id: "app.address.item.location_name.delivery_address",
                              description: "Address item - location name : delivery address",
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
                          name='addresses[0][street]'
                          type="text"
                          placeholder={user.addresses[0].street}
                          required={true}
                          labelText={intl.formatMessage({
                            id: "app.address.item.street",
                            defaultMessage: "Nom de rue",
                            description: "Address item - street"
                          })}
                          value={user.addresses[0].street}
                        />
                      </Col>
                      <Col>
                        <Field
                          component={this.renderField}
                          name='addresses[0][number]'
                          type="text"
                          placeholder={user.addresses[0].number}
                          required={true}
                          labelText={intl.formatMessage({
                            id: "app.address.item.number",
                            defaultMessage: "Numéro",
                            description: "Address item - number"
                          })}
                          value={user.addresses[0].number}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Field
                          component={this.renderField}
                          name='addresses[0][town]'
                          type="text"
                          placeholder={user.addresses[0].town}
                          required={true}
                          labelText={intl.formatMessage({
                            id: "app.address.item.town",
                            defaultMessage: "Ville",
                            description: "Address item - town"
                          })}
                          value={user.addresses[0].town}
                        />
                      </Col>
                      <Col>
                        <Field
                          component={this.renderField}
                          name='addresses[0][state]'
                          type="text"
                          placeholder={user.addresses[0].state}
                          required={true}
                          labelText={intl.formatMessage({
                            id: "app.address.item.state",
                            defaultMessage: "État/Province/Région",
                            description: "Address item - state"
                          })}
                          value={user.addresses[0].state}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Field
                          component={this.renderField}
                          name='addresses[0][zipCode]'
                          type="text"
                          placeholder={user.addresses[0].zipCode}
                          required={true}
                          labelText={intl.formatMessage({
                            id: "app.address.item.zip_code",
                            defaultMessage: "Code postal",
                            description: "Address item - zip code"
                          })}
                          value={user.addresses[0].zipCode}
                        />
                      </Col>
                      <Col>
                        <label
                          htmlFor={'addresses[0][country]'}
                          className="form-control-label"
                        >
                          <FormattedMessage  id={"app.address.item.country"}
                                             defaultMessage="Pays"
                                             description="Address - Country"

                          />
                        </label>
                        &nbsp;:&nbsp;
                        <Field
                          component={"select"}
                          name="addresses[0][country]"
                          id={"address-country-select"}
                          type="select"
                          className={'custom-select ml-2 col-2'}
                          required={true}
                          style={{minWidth: "100%"}}
                          onChange={this.handleChange}
                        >
                          <option value="">--- Choisir parmi les pays ---</option>
                          {
                            Object.entries(ISOCountryJson.default).map(([index, value]) => (
                              <option value={value} key={index}>
                                { value }
                              </option>
                            ))
                          }

                        </Field>
                      </Col>

                    </Row>

                  </fieldset>
                </fieldset>
              )}

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
  const { updating, errorUpdate, loadingUpdate, retrieved, error, loading, eventSource } = state.user.update;

  const profile = retrieved ? ( retrieved['hydra:member'] ? retrieved['hydra:member'][0] : retrieved ) : {};

  /* Retourner les données récupèrés en DB sous le nom "initialValues" permet à redux-form d'initialiser le formulaire à ces valeurs */
  return { updating, errorUpdate, loadingUpdate, retrieved, initialValues: profile, errorRetrieve: error, loading, eventSource };
};

const mapDispatchToProps = dispatch => ({
  update: (data, history, location) => dispatch( update(data, history, location)),
  retrieve: (history, location) => dispatch(retrieve(history, location)),
  reset: eventSource => dispatch(reset(eventSource))
});

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({
    form: 'update-profile',
    enableReinitialize: true,
    keepDirtyOnReinitialize: true
  })(withRouter(injectIntl(UpdateProfile)))
)
