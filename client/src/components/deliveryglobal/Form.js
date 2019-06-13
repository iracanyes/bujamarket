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
          htmlFor={`deliveryglobal_${data.input.name}`}
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
          id={`deliveryglobal_${data.input.name}`}
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
          name="shippingCost"
          type="number"
          step="0.1"
          placeholder="Shipping cost of this delivery set"
          required={true}
          normalize={v => parseFloat(v)}
        />
        <Field
          component={this.renderField}
          name="dateCreated"
          type="dateTime"
          placeholder="Date when this delivery set was created"
        />
        <Field
          component={this.renderField}
          name="allShipped"
          type="checkbox"
          placeholder="All the element of this delivery set were shipped"
        />
        <Field
          component={this.renderField}
          name="allReceived"
          type="checkbox"
          placeholder="All the element of this delivery set were received by the customer who made the order set"
        />
        <Field
          component={this.renderField}
          name="deliveryDetails"
          type="text"
          placeholder="Delivery detail of each element composing this delivery set"
          normalize={v => (v === '' ? [] : v.split(','))}
        />
        <Field
          component={this.renderField}
          name="orderGlobal"
          type="text"
          placeholder="Order set shipped as this delivery set"
          required={true}
        />
        <Field
          component={this.renderField}
          name="shipper"
          type="text"
          placeholder="Shipper which is responsible to send the order set"
          required={true}
        />

        <button type="submit" className="btn btn-success">
          Submit
        </button>
      </form>
    );
  }
}

export default reduxForm({
  form: 'deliveryglobal',
  enableReinitialize: true,
  keepDirtyOnReinitialize: true
})(Form);
