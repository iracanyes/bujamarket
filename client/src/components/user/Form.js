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
          htmlFor={`user_${data.input.name}`}
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
          id={`user_${data.input.name}`}
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
          name="email"
          type="email"
          placeholder=""
        />
        <Field
          component={this.renderField}
          name="roles"
          type="text"
          placeholder=""
        />
        <Field
          component={this.renderField}
          name="plainPassword"
          type="text"
          placeholder=""
        />
        <Field
          component={this.renderField}
          name="password"
          type="text"
          placeholder=""
        />
        <Field
          component={this.renderField}
          name="userType"
          type="text"
          placeholder=""
        />
        <Field
          component={this.renderField}
          name="firstname"
          type="text"
          placeholder=""
          required={true}
        />
        <Field
          component={this.renderField}
          name="lastname"
          type="text"
          placeholder=""
          required={true}
        />
        <Field
          component={this.renderField}
          name="nbErrorConnection"
          type="number"
          placeholder=""
          normalize={v => parseFloat(v)}
        />
        <Field
          component={this.renderField}
          name="banned"
          type="checkbox"
          placeholder=""
        />
        <Field
          component={this.renderField}
          name="signinConfirmed"
          type="checkbox"
          placeholder=""
        />
        <Field
          component={this.renderField}
          name="dateRegistration"
          type="dateTime"
          placeholder=""
        />
        <Field
          component={this.renderField}
          name="language"
          type="text"
          placeholder=""
        />
        <Field
          component={this.renderField}
          name="currency"
          type="text"
          placeholder=""
        />
        <Field
          component={this.renderField}
          name="image"
          type="text"
          placeholder=""
        />
        <Field
          component={this.renderField}
          name="addresses"
          type="text"
          placeholder=""
          normalize={v => (v === '' ? [] : v.split(','))}
        />
        <Field
          component={this.renderField}
          name="bankAccounts"
          type="text"
          placeholder=""
          normalize={v => (v === '' ? [] : v.split(','))}
        />
        <Field
          component={this.renderField}
          name="forums"
          type="text"
          placeholder=""
          normalize={v => (v === '' ? [] : v.split(','))}
        />
        <Field
          component={this.renderField}
          name="messages"
          type="text"
          placeholder=""
          normalize={v => (v === '' ? [] : v.split(','))}
        />
        <Field
          component={this.renderField}
          name="customerKey"
          type="text"
          placeholder="Customer key on Stripe platform"
        />
        <Field
          component={this.renderField}
          name="nbAbuseIdentified"
          type="number"
          placeholder="Number of abuse identified"
          normalize={v => parseFloat(v)}
        />
        <Field
          component={this.renderField}
          name="averageRating"
          type="number"
          step="0.1"
          placeholder="Average rating given to supplier's products"
          normalize={v => parseFloat(v)}
        />
        <Field
          component={this.renderField}
          name="nbOrderCompleted"
          type="number"
          placeholder="Number of order completed"
          normalize={v => parseFloat(v)}
        />
        <Field
          component={this.renderField}
          name="nbOrderWithdrawn"
          type="number"
          placeholder="Number of order withdrawn"
          normalize={v => parseFloat(v)}
        />
        <Field
          component={this.renderField}
          name="orderGlobals"
          type="text"
          placeholder="Order sets made by this customer"
          normalize={v => (v === '' ? [] : v.split(','))}
        />
        <Field
          component={this.renderField}
          name="customerBills"
          type="text"
          placeholder="Orders Bill of this customer"
          normalize={v => (v === '' ? [] : v.split(','))}
        />
        <Field
          component={this.renderField}
          name="refundBills"
          type="text"
          placeholder="Refund's bill of this customer"
          normalize={v => (v === '' ? [] : v.split(','))}
        />
        <Field
          component={this.renderField}
          name="comments"
          type="text"
          placeholder="Comments made by this customer"
          normalize={v => (v === '' ? [] : v.split(','))}
        />
        <Field
          component={this.renderField}
          name="favorites"
          type="text"
          placeholder="Supplier's product loved by this customer"
          normalize={v => (v === '' ? [] : v.split(','))}
        />
        <Field
          component={this.renderField}
          name="address"
          type="text"
          placeholder=""
          normalize={v => (v === '' ? [] : v.split(','))}
        />
        <Field
          component={this.renderField}
          name="bankAccount"
          type="text"
          placeholder=""
          normalize={v => (v === '' ? [] : v.split(','))}
        />
        <Field
          component={this.renderField}
          name="forum"
          type="text"
          placeholder=""
          normalize={v => (v === '' ? [] : v.split(','))}
        />
        <Field
          component={this.renderField}
          name="message"
          type="text"
          placeholder=""
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
  form: 'user',
  enableReinitialize: true,
  keepDirtyOnReinitialize: true
})(Form);
