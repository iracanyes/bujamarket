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
          htmlFor={`deliverydetail_${data.input.name}`}
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
          id={`deliverydetail_${data.input.name}`}
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
          placeholder="Reference of this delivery detail"
          required={true}
        />
        <Field
          component={this.renderField}
          name="description"
          type="text"
          placeholder="Description of this delivery detail"
          required={true}
        />
        <Field
          component={this.renderField}
          name="dateCreated"
          type="dateTime"
          placeholder="Date when this delivery detail was created"
        />
        <Field
          component={this.renderField}
          name="isShipped"
          type="checkbox"
          placeholder="Is this delivery detail shipped"
        />
        <Field
          component={this.renderField}
          name="isReceived"
          type="checkbox"
          placeholder="Is this delivery detail received by the customer"
        />
        <Field
          component={this.renderField}
          name="attachmentFile"
          type="url"
          placeholder="Attachment file (proof of shipping)"
          required={true}
        />
        <Field
          component={this.renderField}
          name="orderDetail"
          type="text"
          placeholder="Order detail associated to this delivery detail"
          required={true}
        />
        <Field
          component={this.renderField}
          name="deliveryGlobal"
          type="text"
          placeholder="Delivery set which is in"
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
  form: 'deliverydetail',
  enableReinitialize: true,
  keepDirtyOnReinitialize: true
})(Form);
