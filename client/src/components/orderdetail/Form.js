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
          htmlFor={`orderdetail_${data.input.name}`}
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
          id={`orderdetail_${data.input.name}`}
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
          name="status"
          type="text"
          placeholder="Status of this order detail"
          required={true}
        />
        <Field
          component={this.renderField}
          name="quantity"
          type="number"
          placeholder="Quantity of product for this order detail"
          normalize={v => parseFloat(v)}
        />
        <Field
          component={this.renderField}
          name="unitCost"
          type="number"
          step="0.1"
          placeholder="Cost by unit of the product concerned by this order detail"
          normalize={v => parseFloat(v)}
        />
        <Field
          component={this.renderField}
          name="totalCost"
          type="number"
          step="0.1"
          placeholder="Total cost of this order detail"
          required={true}
          normalize={v => parseFloat(v)}
        />
        <Field
          component={this.renderField}
          name="orderReturned"
          type="text"
          placeholder="Order returned associated to this order detail"
        />
        <Field
          component={this.renderField}
          name="withdrawal"
          type="text"
          placeholder="Withdrawal associated to this order detail"
        />
        <Field
          component={this.renderField}
          name="supplierBill"
          type="text"
          placeholder="Supplier bill for this order detail"
        />
        <Field
          component={this.renderField}
          name="deliveryDetail"
          type="text"
          placeholder="Delivery detail for this order detail"
        />
        <Field
          component={this.renderField}
          name="orderGlobal"
          type="text"
          placeholder="Order set which is a part of"
          required={true}
        />
        <Field
          component={this.renderField}
          name="supplierProduct"
          type="text"
          placeholder="Supplier product concerned by this order detail"
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
  form: 'orderdetail',
  enableReinitialize: true,
  keepDirtyOnReinitialize: true
})(Form);
