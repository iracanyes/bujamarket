import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect, withRouter } from 'react-router-dom';
import { Field, reduxForm } from "redux-form";
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { retrieve, update, reset } from '../../actions/address/update';
import { create, reset as resetCreate } from "../../actions/address/create";
import { del } from '../../actions/address/delete';
import { injectIntl, FormattedMessage } from "react-intl";
import {
  Col,
  Row,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from "reactstrap";
import {toastError} from "../../layout/ToastMessage";
import * as ISOCountryJson from "../../config/ISOCode/ISO3166-1Alpha2.json";
import * as ISOCountryJsonFr from "../../config/ISOCode/ISO3166-1Alpha2French.json";


class UpdateForm extends Component {
  static propTypes = {
    updateLoading: PropTypes.bool.isRequired,
    updateError: PropTypes.string,
    deleteLoading: PropTypes.bool.isRequired,
    deleteError: PropTypes.string,
    create: PropTypes.func.isRequired,
    created: PropTypes.object,
    updated: PropTypes.object,
    deleted: PropTypes.object,
    eventSource: PropTypes.instanceOf(EventSource),
    update: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state= {
      modal: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidUpdate() {
    // Address created
    this.props.created && this.props.addNewAddress(this.props.created);
    this.props.updated && this.props.updatedAddress();
  }

  componentWillUnmount() {
    this.props.reset(this.props.eventSource);
    this.props.resetCreate(this.props.eventSourceCreate);
  }

  toggle(){
    this.setState(state => ({modal : !state.modal }));
  }

  handleSubmit(e){
    e.preventDefault();

    const { address } = this.props;

    const data = new FormData(document.getElementById('update-address-form'));
    let dataArray = {};
    data.forEach((value, key) => {
      dataArray[key] = value;
    })

    this.props.address.locationName
      ? this.props.update(address, dataArray, this.props.history, this.props.location)
      : this.props.create(dataArray, this.props.history, this.props.location);
  }



  del = () => {
    if (window.confirm('Are you sure you want to delete this item?'))
      this.props.del(this.props.retrieved);
  };

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

    const address = this.props.updated ? this.props.updated : this.props.address;
    const { intl, updateError, deleteError, created } = this.props;

    // Show errors
    this.props.updateError && toastError(this.props.updateError);
    this.props.deleteError && toastError(this.props.deleteError);


    return (
      <div>
        <h2>{ !this.props.address.locationName ? "Ajouter une adresse" : "Mise à jour de l'adresse"}</h2>

        { address && (
          <form
            id="update-address-form"
            name="update-address"
            className="col-lg-6 mx-auto px-3"
            onSubmit={this.handleSubmit}
            key={address.id}
          >
            <fieldset>
              <fieldset>
                <Row>
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
                <Row>
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
                <Row>
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
                <Row>
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
                        <option value={ value }>{ value }</option>
                      ))}
                    </Field>

                  </Col>

                </Row>
              </fieldset>
            </fieldset>
            <fieldset>
              <Button className={'mr-2'}>
                <FontAwesomeIcon icon={'check-circle'} className={'text-success mr-2'}/>
                <FormattedMessage id={'app.button.validate'} />
              </Button>
              <Button>
                <FontAwesomeIcon icon={'minus-circle'} className={'text-danger mr-2'}/>
                <FormattedMessage id={'app.button.cancel'} />
              </Button>
            </fieldset>
          </form>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  updateError: state.address.update.updateError,
  updateLoading: state.address.update.updateLoading,
  deleteError: state.address.del.error,
  deleteLoading: state.address.del.loading,
  eventSource: state.address.update.eventSource,
  created: state.address.create.created,
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
  resetCreate: eventSource => dispatch(resetCreate(eventSource))
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
