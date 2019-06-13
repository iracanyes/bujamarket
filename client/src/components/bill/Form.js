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
          htmlFor={`bill_${data.input.name}`}
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
          id={`bill_${data.input.name}`}
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
          placeholder=""
        />
        <Field
          component={this.renderField}
          name="dateCreated"
          type="dateTime"
          placeholder=""
        />
        <Field
          component={this.renderField}
          name="datePayment"
          type="dateTime"
          placeholder=""
        />
        <Field
          component={this.renderField}
          name="currencyUsed"
          type="text"
          placeholder=""
        />
        <Field
          component={this.renderField}
          name="vatRateUsed"
          type="number"
          step="0.1"
          placeholder=""
          normalize={v => parseFloat(v)}
        />
        <Field
          component={this.renderField}
          name="totalExclTax"
          type="number"
          step="0.1"
          placeholder=""
          normalize={v => parseFloat(v)}
        />
        <Field
          component={this.renderField}
          name="totalInclTax"
          type="number"
          step="0.1"
          placeholder=""
          normalize={v => parseFloat(v)}
        />
        <Field
          component={this.renderField}
          name="url"
          type="text"
          placeholder=""
          required={true}
        />
        <Field
          component={this.renderField}
          name="payment"
          type="text"
          placeholder=""
          required={true}
        />
        <Field
          component={this.renderField}
          name="reason"
          type="text"
          placeholder="Reason for this refund's bill"
        />
        <Field
          component={this.renderField}
          name="description"
          type="text"
          placeholder="Complete description of the reason for this refund's bill"
        />
        <Field
          component={this.renderField}
          name="additionalCost"
          type="number"
          step="0.1"
          placeholder="Additional cost added to this refund's bill"
          normalize={v => parseFloat(v)}
        />
        <Field
          component={this.renderField}
          name="additionalFee"
          type="number"
          step="0.1"
          placeholder="Additional fee added to this refund's bill"
          normalize={v => parseFloat(v)}
        />
        <Field
          component={this.renderField}
          name="additionalInformation"
          type="text"
          placeholder="Reason of the additonal fee or charges"
        />
        <Field
          component={this.renderField}
          name="orderReturned"
          type="text"
          placeholder="Order returned associated to this refund's bill"
        />
        <Field
          component={this.renderField}
          name="withdrawal"
          type="text"
          placeholder="Withdrawal associated to this refund's bill"
        />
        <Field
          component={this.renderField}
          name="customer"
          type="text"
          placeholder="Customer concerned by this refund's bill"
        />
        <Field
          component={this.renderField}
          name="validator"
          type="text"
          placeholder=""
        />

        <button type="submit" className="btn btn-success">
          Submit
        </button>
      </form>
    );
  }
}

export default reduxForm({
  form: 'bill',
  enableReinitialize: true,
  keepDirtyOnReinitialize: true
})(Form);
