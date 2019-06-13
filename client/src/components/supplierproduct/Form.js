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
          htmlFor={`supplierproduct_${data.input.name}`}
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
          id={`supplierproduct_${data.input.name}`}
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
          name="initialPrice"
          type="number"
          step="0.1"
          placeholder="Initial price of this supplier product"
          normalize={v => parseFloat(v)}
        />
        <Field
          component={this.renderField}
          name="quantity"
          type="number"
          placeholder="Quantity available of this supplier product."
          normalize={v => parseFloat(v)}
        />
        <Field
          component={this.renderField}
          name="additionalFee"
          type="number"
          step="0.1"
          placeholder="Additional fee for this supplier product"
          normalize={v => parseFloat(v)}
        />
        <Field
          component={this.renderField}
          name="additionalInformation"
          type="text"
          placeholder="Additional information for this supplier product"
        />
        <Field
          component={this.renderField}
          name="isAvailable"
          type="checkbox"
          placeholder="Is this supplier product available"
        />
        <Field
          component={this.renderField}
          name="isLimited"
          type="checkbox"
          placeholder="Is this supplier product limited"
        />
        <Field
          component={this.renderField}
          name="supplier"
          type="text"
          placeholder="Supplier who sell this supplier product"
          required={true}
        />
        <Field
          component={this.renderField}
          name="product"
          type="text"
          placeholder="Product made available by the supplier"
          required={true}
        />
        <Field
          component={this.renderField}
          name="comments"
          type="text"
          placeholder="Comments made on this supplier product"
          normalize={v => (v === '' ? [] : v.split(','))}
        />
        <Field
          component={this.renderField}
          name="favorites"
          type="text"
          placeholder="Customers who loved this supplier product"
          normalize={v => (v === '' ? [] : v.split(','))}
        />
        <Field
          component={this.renderField}
          name="orderDetails"
          type="text"
          placeholder="Order details made for this supplier product"
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
  form: 'supplierproduct',
  enableReinitialize: true,
  keepDirtyOnReinitialize: true
})(Form);
