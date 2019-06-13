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
          htmlFor={`image_${data.input.name}`}
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
          id={`image_${data.input.name}`}
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
          name="place"
          type="number"
          placeholder="Place of this image"
          normalize={v => parseFloat(v)}
        />
        <Field
          component={this.renderField}
          name="title"
          type="text"
          placeholder="Title of this image"
        />
        <Field
          component={this.renderField}
          name="alt"
          type="text"
          placeholder="Alternative title of this image"
        />
        <Field
          component={this.renderField}
          name="url"
          type="url"
          placeholder="URL to the file of this image"
          required={true}
        />
        <Field
          component={this.renderField}
          name="size"
          type="number"
          placeholder="Size of this image"
          required={true}
          normalize={v => parseFloat(v)}
        />
        <Field
          component={this.renderField}
          name="user"
          type="text"
          placeholder="User represented by this image"
        />
        <Field
          component={this.renderField}
          name="product"
          type="text"
          placeholder="Product represented by this image"
        />

        <button type="submit" className="btn btn-success">
          Submit
        </button>
      </form>
    );
  }
}

export default reduxForm({
  form: 'image',
  enableReinitialize: true,
  keepDirtyOnReinitialize: true
})(Form);
