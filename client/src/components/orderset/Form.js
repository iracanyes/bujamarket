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
          htmlFor={`orderglobal_${data.input.name}`}
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
          id={`orderglobal_${data.input.name}`}
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
          name="dateCreated"
          type="dateTime"
          placeholder="Creation's date of the order set"
        />
        <Field
          component={this.renderField}
          name="totalWeight"
          type="number"
          step="0.1"
          placeholder="Total weight of the order set"
          normalize={v => parseFloat(v)}
        />
        <Field
          component={this.renderField}
          name="nbPackage"
          type="number"
          placeholder="Number of package for the order set"
          normalize={v => parseFloat(v)}
        />
        <Field
          component={this.renderField}
          name="totalCost"
          type="number"
          step="0.1"
          placeholder="Total cost of the order set"
          normalize={v => parseFloat(v)}
        />
        <Field
          component={this.renderField}
          name="customer"
          type="text"
          placeholder="Customer who made the order set"
          required={true}
        />
        <Field
          component={this.renderField}
          name="billCustomer"
          type="text"
          placeholder="Customer's bill for the order set"
        />
        <Field
          component={this.renderField}
          name="deliveryGlobal"
          type="text"
          placeholder="Delivery set for the order set"
        />
        <Field
          component={this.renderField}
          name="orderDetails"
          type="text"
          placeholder="Each details  for this order set"
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
  form: 'orderglobal',
  enableReinitialize: true,
  keepDirtyOnReinitialize: true
})(Form);
