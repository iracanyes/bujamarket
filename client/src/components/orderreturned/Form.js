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
          htmlFor={`orderreturned_${data.input.name}`}
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
          id={`orderreturned_${data.input.name}`}
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
          name="description"
          type="text"
          placeholder="Description of the order returned"
          required={true}
        />
        <Field
          component={this.renderField}
          name="reason"
          type="text"
          placeholder="Reason for returning the order"
          required={true}
        />
        <Field
          component={this.renderField}
          name="isIntact"
          type="checkbox"
          placeholder="Is the product concerned by this order returned intact"
        />
        <Field
          component={this.renderField}
          name="fileUrl"
          type="url"
          placeholder="URL to the file"
        />
        <Field
          component={this.renderField}
          name="orderDetail"
          type="text"
          placeholder="Order detail returned"
          required={true}
        />
        <Field
          component={this.renderField}
          name="billRefund"
          type="text"
          placeholder="Refund bill associated to this order returned"
        />

        <button type="submit" className="btn btn-success">
          Submit
        </button>
      </form>
    );
  }
}

export default reduxForm({
  form: 'orderreturned',
  enableReinitialize: true,
  keepDirtyOnReinitialize: true
})(Form);
