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
          htmlFor={`category_${data.input.name}`}
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
          id={`category_${data.input.name}`}
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
          name="name"
          type="text"
          placeholder="Name of this category"
          required={true}
        />
        <Field
          component={this.renderField}
          name="description"
          type="text"
          placeholder="Description of the category"
          required={true}
        />
        <Field
          component={this.renderField}
          name="dateCreated"
          type="dateTime"
          placeholder="When the category was created"
        />
        <Field
          component={this.renderField}
          name="isValid"
          type="checkbox"
          placeholder="Is valided?"
        />
        <Field
          component={this.renderField}
          name="platformFee"
          type="number"
          step="0.1"
          placeholder="Platform fee for the sale of this products' category"
          normalize={v => parseFloat(v)}
        />
        <Field
          component={this.renderField}
          name="products"
          type="text"
          placeholder="Products of this category"
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
  form: 'category',
  enableReinitialize: true,
  keepDirtyOnReinitialize: true
})(Form);
