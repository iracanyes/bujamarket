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
          htmlFor={`product_${data.input.name}`}
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
          id={`product_${data.input.name}`}
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
          name="title"
          type="text"
          placeholder="Title of the product"
          required={true}
        />
        <Field
          component={this.renderField}
          name="resume"
          type="text"
          placeholder="Resume of the product's description"
          required={true}
        />
        <Field
          component={this.renderField}
          name="description"
          type="text"
          placeholder="Complete description of the product"
          required={true}
        />
        <Field
          component={this.renderField}
          name="countryOrigin"
          type="text"
          placeholder="Country where this product was made"
        />
        <Field
          component={this.renderField}
          name="weight"
          type="number"
          step="0.1"
          placeholder="Weight of the product packed up"
          required={true}
          normalize={v => parseFloat(v)}
        />
        <Field
          component={this.renderField}
          name="length"
          type="number"
          step="0.1"
          placeholder="Length of this product packed up"
          normalize={v => parseFloat(v)}
        />
        <Field
          component={this.renderField}
          name="width"
          type="number"
          step="0.1"
          placeholder="Width of this product packed up"
          normalize={v => parseFloat(v)}
        />
        <Field
          component={this.renderField}
          name="height"
          type="number"
          step="0.1"
          placeholder="Height of this product packed up"
          normalize={v => parseFloat(v)}
        />
        <Field
          component={this.renderField}
          name="category"
          type="text"
          placeholder="Classification category of this product"
        />
        <Field
          component={this.renderField}
          name="productSuppliers"
          type="text"
          placeholder="Product's supplier"
          normalize={v => (v === '' ? [] : v.split(','))}
        />
        <Field
          component={this.renderField}
          name="images"
          type="text"
          placeholder="Images of the product"
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
  form: 'product',
  enableReinitialize: true,
  keepDirtyOnReinitialize: true
})(Form);
