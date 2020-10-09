import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';

class Form extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    error: PropTypes.string
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
      <div className={`form-group`}>
        <label
          htmlFor={`shipper_${data.input.name}`}
          className="form-control-label"
        >
          {data.input.name}
        </label>
        <input
          {...data.input}
          type={data.type}
          step={data.step}
          required={data.required}
          placeholder={data.placeholder}
          id={`shipper_${data.input.name}`}
        />
        {isInvalid && <div className="invalid-feedback">{data.meta.error}</div>}
      </div>
    );
  };

  render() {
    return (
      <form onSubmit={this.props.handleSubmit}>
        <Field
          component={this.renderField}
          name="name"
          type="text"
          placeholder="Commercial name of this shipper"
          required={true}
        />
        <Field
          component={this.renderField}
          name="socialReason"
          type="text"
          placeholder="Social Reason of this shipper"
          required={true}
        />
        <Field
          component={this.renderField}
          name="service"
          type="text"
          placeholder="Domain offered by this shipper"
          required={true}
        />
        <Field
          component={this.renderField}
          name="tradeRegisterNumber"
          type="text"
          placeholder="Trade register number of this shipper"
          required={true}
        />
        <Field
          component={this.renderField}
          name="vatNumber"
          type="text"
          placeholder="VAT number of this shipper"
          required={true}
        />
        <Field
          component={this.renderField}
          name="description"
          type="text"
          placeholder="Complete description of the service offered"
          required={true}
        />
        <Field
          component={this.renderField}
          name="deliveryCommitment"
          type="text"
          placeholder="Delivery commitment for this service"
          required={true}
        />
        <Field
          component={this.renderField}
          name="contactNumber"
          type="text"
          placeholder="Contact number for this service"
          required={true}
        />
        <Field
          component={this.renderField}
          name="addresses"
          type="text"
          placeholder="Addresses of this shipper"
          normalize={v => (v === '' ? [] : v.split(','))}
        />
        <Field
          component={this.renderField}
          name="globalDeliveries"
          type="text"
          placeholder="Global deliveries made by this shipper"
          normalize={v => (v === '' ? [] : v.split(','))}
        />

        <button type="submit" className="btn btn-success">
          Submit
        </button>
      </form>
    );
  }
}

export default reduxForm({
  form: 'shipper',
  enableReinitialize: true,
  keepDirtyOnReinitialize: true
})(Form);
