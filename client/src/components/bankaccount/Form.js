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
          htmlFor={`bankaccount_${data.input.name}`}
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
          id={`bankaccount_${data.input.name}`}
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
          name="idCard"
          type="text"
          placeholder="ID of this card on Stripe platform"
          required={true}
        />
        <Field
          component={this.renderField}
          name="brand"
          type="text"
          placeholder="Brand of this card"
          required={true}
        />
        <Field
          component={this.renderField}
          name="countryCode"
          type="text"
          placeholder="Country code of the owner"
          required={true}
        />
        <Field
          component={this.renderField}
          name="last4"
          type="number"
          placeholder="Last 4 digit of the card number"
          normalize={v => parseFloat(v)}
        />
        <Field
          component={this.renderField}
          name="expiryMonth"
          type="number"
          placeholder=""
          normalize={v => parseFloat(v)}
        />
        <Field
          component={this.renderField}
          name="expiryYear"
          type="number"
          placeholder="Expiry year of this card"
          normalize={v => parseFloat(v)}
        />
        <Field
          component={this.renderField}
          name="fingerprint"
          type="text"
          placeholder="Fingerprint of this card"
          required={true}
        />
        <Field
          component={this.renderField}
          name="funding"
          type="text"
          placeholder="Funding type of this card (e.g. credit, debit)"
        />
        <Field
          component={this.renderField}
          name="accountBalance"
          type="number"
          step="0.1"
          placeholder="Account's balance of this card"
          normalize={v => parseFloat(v)}
        />
        <Field
          component={this.renderField}
          name="user"
          type="text"
          placeholder="User who owned this card"
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
  form: 'bankaccount',
  enableReinitialize: true,
  keepDirtyOnReinitialize: true
})(Form);
