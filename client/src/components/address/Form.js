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
          htmlFor={`address_${data.input.name}`}
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
          id={`address_${data.input.name}`}
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
          name="locationName"
          type="text"
          placeholder="Name of this location (e.g. Home, Head office, Delivery address)"
        />
        <Field
          component={this.renderField}
          name="street"
          type="text"
          placeholder="Street name"
        />
        <Field
          component={this.renderField}
          name="number"
          type="text"
          placeholder="Address's number"
        />
        <Field
          component={this.renderField}
          name="state"
          type="text"
          placeholder="State, District"
        />
        <Field
          component={this.renderField}
          name="town"
          type="text"
          placeholder="Address's Town"
        />
        <Field
          component={this.renderField}
          name="zipCode"
          type="text"
          placeholder="Zip code"
        />
        <Field
          component={this.renderField}
          name="country"
          type="text"
          placeholder="Country"
        />
        <Field
          component={this.renderField}
          name="user"
          type="text"
          placeholder="User located at this address"
        />
        <Field
          component={this.renderField}
          name="shipper"
          type="text"
          placeholder="Shipper located at this address"
        />

        <button type="submit" className="btn btn-success">
          Submit
        </button>
      </form>
    );
  }
}

export default reduxForm({
  form: 'address',
  enableReinitialize: true,
  keepDirtyOnReinitialize: true
})(Form);
