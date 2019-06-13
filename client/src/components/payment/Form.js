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
          htmlFor={`payment_${data.input.name}`}
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
          id={`payment_${data.input.name}`}
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
          name="reference"
          type="text"
          placeholder="Reference of this payment"
          required={true}
        />
        <Field
          component={this.renderField}
          name="dateCreated"
          type="dateTime"
          placeholder="Date when this payment was made"
        />
        <Field
          component={this.renderField}
          name="currency"
          type="text"
          placeholder="Currency used for this payment"
        />
        <Field
          component={this.renderField}
          name="description"
          type="text"
          placeholder="Optional description of the reason of this payment"
        />
        <Field
          component={this.renderField}
          name="status"
          type="text"
          placeholder="Status of this payment"
          required={true}
        />
        <Field
          component={this.renderField}
          name="amount"
          type="number"
          step="0.1"
          placeholder="Amount for this payment"
          normalize={v => parseFloat(v)}
        />
        <Field
          component={this.renderField}
          name="amountRefund"
          type="number"
          step="0.1"
          placeholder="Amount refund for this payment"
          normalize={v => parseFloat(v)}
        />
        <Field
          component={this.renderField}
          name="balanceTransaction"
          type="text"
          placeholder="Balance transaction"
        />
        <Field
          component={this.renderField}
          name="emailReceipt"
          type="email"
          placeholder="Email for the receipt"
          required={true}
        />
        <Field
          component={this.renderField}
          name="source"
          type="text"
          placeholder="Source (Credit or Debit card). A hash describing that card"
          required={true}
        />
        <Field
          component={this.renderField}
          name="bill"
          type="text"
          placeholder="Bill registered for this payment"
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
  form: 'payment',
  enableReinitialize: true,
  keepDirtyOnReinitialize: true
})(Form);
