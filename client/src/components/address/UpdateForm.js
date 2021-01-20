import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Field, reduxForm } from "redux-form";
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { update, reset } from '../../actions/address/update';
import { create, reset as resetCreate } from "../../actions/address/create";
import { del } from '../../actions/address/delete';
import { injectIntl, FormattedMessage } from "react-intl";
import {
  Col,
  Row
} from "reactstrap";
import {toastError} from "../../layout/component/ToastMessage";
import * as ISOCountryJson from "../../config/ISOCode/ISO3166-1Alpha2.json";
import {
  Button,
  Paper
} from "@material-ui/core";


class UpdateForm extends Component {
  static propTypes = {
    address: PropTypes.object,
    create: PropTypes.func.isRequired,
    created: PropTypes.object,
    resetCreate: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    updated: PropTypes.object,
    updateLoading: PropTypes.bool.isRequired,
    updateError: PropTypes.string,
    eventSource: PropTypes.instanceOf(EventSource),
    reset: PropTypes.func.isRequired

  };

  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillUnmount() {
    this.props.reset(this.props.eventSource);
    this.props.resetCreate();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { created, updated } = this.props;
    // closing form if address created or updated
    ((created && created.id) || (updated && updated.id)) && (prevProps.created !== this.props.created || prevProps.updated !== this.props.updated) && this.props.closeForm();
  }

  handleSubmit(e){
    e.preventDefault();

    const { address } = this.props;

    const data = address
      ? new FormData(document.getElementById('update-address-form'))
      : new FormData(document.getElementById('create-address-form'));

    let dataArray = {};
    data.forEach((value, key) => {
      dataArray[key] = value;
    })
    // Si une adresse a été fourni au formulaire, on la met à jour sinon on crée une adresse
    this.props.address && address.id
      ? this.props.update(address, dataArray, this.props.history, this.props.location)
      : this.props.create(dataArray, this.props.history, this.props.location);

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
          htmlFor={`address_${data.input.name}`}
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
          list={data.list && data.list}
        />
        {isInvalid && <div className="invalid-feedback">{data.meta.error}</div>}
        {data.datalist && (
          <datalist id={'countries'} className={'input-datalist'}>
            { data.datalist.map( ([index, value]) => (
              <option value={value} key={index}>{value}</option>
            ))}

          </datalist>
        )}
      </div>
    );
  };

  render() {
    const { intl, updateError, createError } = this.props;
    const address = this.props.updated ? this.props.updated : this.props.address;

    // Show errors
    updateError && toastError(updateError);
    createError && toastError(createError);


    return (
      <div>
        <Paper elevation={3} className={"col-lg-6 mx-auto  py-5"}>
          <h2>{ !this.props.address ? "Ajouter une adresse" : "Mise à jour de l'adresse"}</h2>
          { address
          ? (
              <form
                id="update-address-form"
                name="update-address"
                className="my-5 px-3"
                onSubmit={(e) => this.handleSubmit(e)}
                key={address.id}
              >
                <fieldset>
                  <fieldset>
                    <Row className={'mb-4'}>
                      <Col>
                        <label htmlFor="locationName">
                          <FormattedMessage id={'app.address.item.location_name'} />
                        </label>
                        <Field
                          component={"select"}
                          name='locationName'
                          type="select"
                          className={'custom-select ml-2 col-4'}
                          disabled={address.locationName === 'Head office' ? 'disabled' : ''}
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
                          <option value="Deposit address" >
                            { intl.formatMessage({
                              id: "app.address.item.location_name.deposit_address",
                              description: "Address item - location name : deposit address",
                              defaultMessage: "Adresse de dépôt"
                            })}

                          </option>
                          <option value="Billing address" >
                            { intl.formatMessage({
                              id: "app.address.item.location_name.billing_address",
                              description: "Address item - location name : billing address",
                              defaultMessage: "Adresse de facturation"
                            })}

                          </option>
                          <option value="Deposit address"></option>
                        </Field>
                      </Col>
                    </Row>
                    <Row className={'my-2'}>
                      <Col>
                        <Field
                          component={this.renderField}
                          name="street"
                          type="text"
                          placeholder={address.street }
                          labelText={intl.formatMessage({
                            id: "app.address.item.street"
                          })}
                        />
                      </Col>
                      <Col>
                        <Field
                          component={this.renderField}
                          name="number"
                          type="text"
                          placeholder={address.number }
                          labelText={intl.formatMessage({
                            id: "app.address.item.number"
                          })}
                        />
                      </Col>
                    </Row>
                    <Row className={'my-2'}>
                      <Col>
                        <Field
                          component={this.renderField}
                          name="town"
                          type="text"
                          placeholder={address.town }
                          labelText={intl.formatMessage({
                            id: "app.address.item.town"
                          })}
                        />
                      </Col>
                      <Col>
                        <Field
                          component={this.renderField}
                          name="state"
                          type="text"
                          placeholder={address.state }
                          labelText={intl.formatMessage({
                            id: "app.address.item.state"
                          })}
                        />
                      </Col>
                    </Row>
                    <Row className={'my-2'}>
                      <Col>
                        <Field
                          component={this.renderField}
                          name="zipCode"
                          type="text"
                          placeholder={address.zipCode }
                          labelText={intl.formatMessage({
                            id: "app.address.item.zip_code"
                          })}
                        />
                      </Col>
                      <Col>
                        <label htmlFor="country">
                          <FormattedMessage id={"app.address.item.country"}/>
                        </label>
                        <Field
                          component="select"
                          name="country"
                          type="select"
                          className={'form-control'}
                          placeholder={address.country }
                        >
                          {Object.entries(ISOCountryJson.default).map(([index,value]) => (
                            <option value={ value } key={index}>{ value }</option>
                          ))}
                        </Field>

                      </Col>

                    </Row>
                  </fieldset>
                </fieldset>
                <fieldset className={'d-flex my-3 justify-content-center'}>
                  <Button
                    type={'submit'}
                    variant={"contained"}
                    className={'bg-light mx-2'}
                  >
                    <FontAwesomeIcon icon={'check-circle'} className={'text-success mr-2'}/>
                    <FormattedMessage id={'app.button.validate'} />
                  </Button>
                  <Button variant={"contained"} className={"bg-light mx-2"} onClick={() => this.props.closeForm()}>
                    <FontAwesomeIcon icon={'minus-circle'} className={'text-danger mr-2'}/>
                    <FormattedMessage id={'app.button.cancel'} />
                  </Button>
                </fieldset>
              </form>
            )
          : (
              <form
                id="create-address-form"
                name="create-address"
                className="my-5 px-3"
                onSubmit={(e) => this.handleSubmit(e)}
                key={0}
              >
                <fieldset>
                  <fieldset>
                    <Row className={'mb-4'}>
                      <Col>
                        <label htmlFor="locationName">
                          <FormattedMessage id={'app.address.item.location_name'} />
                        </label>
                        <Field
                          component={"select"}
                          name='locationName'
                          type="select"
                          className={'custom-select ml-2 col-4'}
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
                          <option value="Deposit address" >
                            { intl.formatMessage({
                              id: "app.address.item.location_name.deposit_address",
                              description: "Address item - location name : deposit address",
                              defaultMessage: "Adresse de dépôt"
                            })}

                          </option>
                          <option value="Billing address" >
                            { intl.formatMessage({
                              id: "app.address.item.location_name.billing_address",
                              description: "Address item - location name : billing address",
                              defaultMessage: "Adresse de facturation"
                            })}

                          </option>
                          <option value="Deposit address"></option>
                        </Field>
                      </Col>
                    </Row>
                    <Row className={'my-2'}>
                      <Col>
                        <Field
                          component={this.renderField}
                          name="street"
                          type="text"
                          placeholder={"Avenue de la paix" }
                          labelText={intl.formatMessage({
                            id: "app.address.item.street"
                          })}
                        />
                      </Col>
                      <Col>
                        <Field
                          component={this.renderField}
                          name="number"
                          type="text"
                          placeholder={"98/120" }
                          labelText={intl.formatMessage({
                            id: "app.address.item.number"
                          })}
                        />
                      </Col>
                    </Row>
                    <Row className={'my-2'}>
                      <Col>
                        <Field
                          component={this.renderField}
                          name="town"
                          type="text"
                          placeholder={"Zaventem" }
                          labelText={intl.formatMessage({
                            id: "app.address.item.town"
                          })}
                        />
                      </Col>
                      <Col>
                        <Field
                          component={this.renderField}
                          name="state"
                          type="text"
                          placeholder={"Bruxelles" }
                          labelText={intl.formatMessage({
                            id: "app.address.item.state"
                          })}
                        />
                      </Col>
                    </Row>
                    <Row className={'my-2'}>
                      <Col>
                        <Field
                          component={this.renderField}
                          name="zipCode"
                          type="text"
                          placeholder={"1200"}
                          labelText={intl.formatMessage({
                            id: "app.address.item.zip_code"
                          })}
                        />
                      </Col>
                      <Col>
                        <label htmlFor="country">
                          <FormattedMessage id={"app.address.item.country"}/>
                        </label>
                        <Field
                          component="select"
                          name="country"
                          type="select"
                          className={'form-control'}
                          placeholder={"Belgium"}
                        >
                          {Object.entries(ISOCountryJson.default).map(([index,value]) => (
                            <option value={ value } key={index}>{ value }</option>
                          ))}
                        </Field>

                      </Col>

                    </Row>
                  </fieldset>
                </fieldset>
                <fieldset className={'d-flex my-3 justify-content-center'}>
                  <Button
                    type={'submit'}
                    variant={"contained"}
                    className={'bg-light mx-2'}
                  >
                    <FontAwesomeIcon icon={'check-circle'} className={'text-success mr-2'}/>
                    <FormattedMessage id={'app.button.validate'} />
                  </Button>
                  <Button variant={"contained"} className={"bg-light mx-2"} onClick={() => this.props.closeForm()}>
                    <FontAwesomeIcon icon={'minus-circle'} className={'text-danger mr-2'}/>
                    <FormattedMessage id={'app.button.cancel'} />
                  </Button>
                </fieldset>
              </form>
            )
          }
        </Paper>


      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  updateError: state.address.update.updateError,
  updateLoading: state.address.update.updateLoading,
  eventSource: state.address.update.eventSource,
  created: state.address.create.created,
  createError: state.address.create.error,
  eventSourceCreate: state.address.create.eventSource,
  deleted: state.address.del.deleted,
  updated: state.address.update.updated,
  initialValues: ownProps.address ? ownProps.address : {}
});

const mapDispatchToProps = dispatch => ({
  update: (item, values, history, location) => dispatch(update(item, values, history, location)),
  create: (values, history, location) => dispatch(create(values, history, location)),
  del: (item, history, location) => dispatch(del(item, history, location)),
  reset: eventSource => dispatch(reset(eventSource)),
  resetCreate: () => dispatch(resetCreate())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  reduxForm({
    form: 'update-profile',
    enableReinitialize: true,
    keepDirtyOnReinitialized: true
  })(withRouter(injectIntl(UpdateForm)))
);
