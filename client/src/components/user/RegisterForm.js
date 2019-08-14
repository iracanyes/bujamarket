import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import { Col, Row } from "reactstrap";
import { FormattedMessage, injectIntl } from "react-intl";

class RegisterForm extends Component {
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
        <Row>
          <Col>
            <Field
              component={this.renderField}
              name="email"
              type="email"
              placeholder=""
            />
          </Col>
          <Col>
            <Field
              component={this.renderField}
              name="plainPassword"
              type="text"
              placeholder=""
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Field
              component={this.renderField}
              name="firstname"
              type="text"
              placeholder=""
              required={true}
            />
          </Col>
          <Col>
            <Field
              component={this.renderField}
              name="lastname"
              type="text"
              placeholder=""
              required={true}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <label
              htmlFor={'user_language'}
              className="form-control-label"
            >
              <FormattedMessage  id={"app.user.item.language"}
                                 defaultMessage="Langue"
                                 description="User item - language"

              />
            </label>
            <Field
              component={"select"}
              name="language"
              type="select"
              placeholder=""
            >
              <option value="FR">
                <FormattedMessage  id={"app.user.item.language.french"}
                                                    defaultMessage="Français"
                                                    description="User item - language french"

              />
              Français
              </option>
              <option value="EN">Anglais</option>
              <option value="RN">Kirundi</option>
            </Field>
          </Col>
          <Col>
            <label
              htmlFor={'user_currency'}
              className="form-control-label"
            >
              <FormattedMessage  id={"app.customers.list.page.title"}
                                 defaultMessage="Nos clients"
                                 description="Customer list page - title"

              />
            </label>
            <Field
              component={"select"}
              name="currency"
              type="select"
              placeholder=""

            >
              <option value="BIF">Francs burundais (BIF)</option>
              <option value="EUR">Euro (EUR)</option>
              <option value="USD">Dollar (USD)</option>
            </Field>
          </Col>
        </Row>

        <Field
          component={this.renderField}
          name="image"
          type="text"
          placeholder=""
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
})(injectIntl(RegisterForm));
