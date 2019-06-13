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
          htmlFor={`message_${data.input.name}`}
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
          id={`message_${data.input.name}`}
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
          name="content"
          type="text"
          placeholder="Content of this message"
          required={true}
        />
        <Field
          component={this.renderField}
          name="dateCreated"
          type="dateTime"
          placeholder="Date when this message was written"
        />
        <Field
          component={this.renderField}
          name="attachmentUrl"
          type="url"
          placeholder="Attachment URL of this message"
        />
        <Field
          component={this.renderField}
          name="attachmentFile"
          type="url"
          placeholder="Attachment file of this message"
        />
        <Field
          component={this.renderField}
          name="attachmentImage"
          type="url"
          placeholder="Attachment image of this message"
        />
        <Field
          component={this.renderField}
          name="forum"
          type="text"
          placeholder="Forum in which this message is written"
          required={true}
        />
        <Field
          component={this.renderField}
          name="user"
          type="text"
          placeholder="User who wrote this message"
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
  form: 'message',
  enableReinitialize: true,
  keepDirtyOnReinitialize: true
})(Form);
