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
          htmlFor={`withdrawal_${data.input.name}`}
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
          id={`withdrawal_${data.input.name}`}
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
          placeholder="Status of this withdrawal"
          required={true}
        />
        <Field
          component={this.renderField}
          name="dateCreated"
          type="dateTime"
          placeholder="Date when this withdrawal was created"
        />
        <Field
          component={this.renderField}
          name="isValid"
          type="checkbox"
          placeholder="Is this withdrawal valid"
        />
        <Field
          component={this.renderField}
          name="orderDelivered"
          type="checkbox"
          placeholder="The order concerned by this withdrawal is delivered"
        />
        <Field
          component={this.renderField}
          name="billRefund"
          type="text"
          placeholder="Bill refund associated to this withdrawal"
        />
        <Field
          component={this.renderField}
          name="orderDetail"
          type="text"
          placeholder="Order detail concerned by this withdrawal"
        />

        <button type="submit" className="btn btn-success">
          Submit
        </button>
      </form>
    );
  }
}

export default reduxForm({
  form: 'withdrawal',
  enableReinitialize: true,
  keepDirtyOnReinitialize: true
})(Form);
