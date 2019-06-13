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
          htmlFor={`comment_${data.input.name}`}
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
          id={`comment_${data.input.name}`}
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
          name="rating"
          type="number"
          placeholder="Rating given to the vendor product"
          normalize={v => parseFloat(v)}
        />
        <Field
          component={this.renderField}
          name="content"
          type="text"
          placeholder="Content of the comment"
          required={true}
        />
        <Field
          component={this.renderField}
          name="dateCreated"
          type="dateTime"
          placeholder="Date when the comment was created"
        />
        <Field
          component={this.renderField}
          name="customer"
          type="text"
          placeholder="Customer who wrote this comment"
          required={true}
        />
        <Field
          component={this.renderField}
          name="supplierProduct"
          type="text"
          placeholder="Supplier product commented"
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
  form: 'comment',
  enableReinitialize: true,
  keepDirtyOnReinitialize: true
})(Form);
