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
          htmlFor={`forum_${data.input.name}`}
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
          id={`forum_${data.input.name}`}
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
          placeholder="Title of this discussion in the forum"
          required={true}
        />
        <Field
          component={this.renderField}
          name="status"
          type="text"
          placeholder="Status of this forum"
        />
        <Field
          component={this.renderField}
          name="type"
          type="text"
          placeholder="Type of subject ex: abuse, litigation, question"
          required={true}
        />
        <Field
          component={this.renderField}
          name="isClosed"
          type="checkbox"
          placeholder="Is this forum exchange closed"
        />
        <Field
          component={this.renderField}
          name="dateCreated"
          type="dateTime"
          placeholder="Date when this forum subject was created"
        />
        <Field
          component={this.renderField}
          name="user"
          type="text"
          placeholder="User who created this forum subject"
          required={true}
        />
        <Field
          component={this.renderField}
          name="responder"
          type="text"
          placeholder="Admin who responded this forum's subject"
        />
        <Field
          component={this.renderField}
          name="messages"
          type="text"
          placeholder="Messages written in this forum's subject"
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
  form: 'forum',
  enableReinitialize: true,
  keepDirtyOnReinitialize: true
})(Form);
