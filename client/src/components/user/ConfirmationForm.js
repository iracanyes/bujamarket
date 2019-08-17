import React, { Component, Fragment } from 'react';
import { Link } from "react-router-dom";
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import { Col, Row } from "reactstrap";
import { FormattedMessage, injectIntl } from "react-intl";

class RegisterForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    error: PropTypes.string
  };

  constructor(props)
  {
    super(props);

    this.state = {
      user: {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        currency: '',
        language: '',
        image: {}
      },
      submitted: false
    };

    this.fileInput = React.createRef();

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e)
  {
    e.preventDefault();

    const { name, value } = e.target;

    const { user } = this.state;

    this.setState({
      user: {
        ...user,
        [name]: value
      }
    });
  }

  handleSubmit(e)
  {
    e.preventDefault();

    this.setState({ submitted: true });

    const { user } = this.state;

    if( user.email && user.password && user.firstname && user.lastname && user.currency && user.language )
    {
      this.props.register(user);
    }

  }

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
    const { intl, registering } = this.props;

    const { user, submitted } = this.state;

    return (
      <div classname={"user-authentication-form"}>
        <h1>
          <FormattedMessage  id={"app.page.user.register.title"}
                             defaultMessage="Inscription"
                             description="Page User - Register title"
          />
        </h1>
        <form
          id="register-form"
          name="register"
          className={"col-lg-6 mx-auto px-3"}
          onSubmit={this.props.handleSubmit}
        >
          <Row>
            <Col>
              <Field
                component={this.renderField}
                name="email"
                type="email"
                placeholder="tim_dubois@gmail.com"
              />
            </Col>
            <Col>
              <Field
                component={this.renderField}
                name="password"
                type="password"
                placeholder=""
                required={true}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Field
                component={this.renderField}
                name="Nom"
                type="text"
                placeholder="Dubois"
                required={true}
              />
            </Col>
            <Col>
              <Field
                component={this.renderField}
                name="Prénom"
                type="text"
                placeholder="Timothy"
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
              &nbsp;:&nbsp;
              <Field
                component={"select"}
                name="language"
                type="select"
                placeholder=""
              >
                <option value="FR">
                  { intl.formatMessage({
                    id: "app.user.item.language.french",
                    description: "User item - language french",
                    defaultMessage: "Français"
                  })}
                </option>
                <option value="EN">
                  { intl.formatMessage({
                    id: "app.user.item.language.french",
                    description: "User item - language french",
                    defaultMessage: "Anglais"
                  })}

                </option>
                <option value="RN">
                  { intl.formatMessage({
                    id: "app.user.item.language.french",
                    description: "User item - language french",
                    defaultMessage: "Français"
                  })}
                  Kirundi
                </option>
              </Field>
            </Col>
            <Col>
              <label
                htmlFor={'user_currency'}
                className="form-control-label"
              >
                <FormattedMessage  id={"app.user.item.currency"}
                                   defaultMessage="Devise"
                                   description="User item - currency"

                />
              </label>
              &nbsp;:&nbsp;
              <Field
                component={"select"}
                name="currency"
                type="select"
                placeholder=""

              >
                <option value="BIF">
                  { intl.formatMessage({
                    id: "app.user.item.currency.bif",
                    description: "User item - currency BIF",
                    defaultMessage: "Francs burundais (BIF)"
                  })}

                </option>
                <option value="EUR">
                  { intl.formatMessage({
                    id: "app.user.item.currency.euro",
                    description: "User item - currency EUR",
                    defaultMessage: "Euro (EUR)"
                  })}

                </option>
                <option value="USD">
                  { intl.formatMessage({
                    id: "app.user.item.currency.dollar",
                    description: "User item - currency Dollar",
                    defaultMessage: "Dollar (USD)"
                  })}

                </option>
              </Field>
            </Col>
          </Row>

          <Field
            component={this.renderField}
            name="image"
            type="file"
            ref={this.fileInput}
            value={null}
            accept="image/*"
          />

          <button type="submit" className="btn btn-success">
            Submit
          </button>
        </form>
      </div>

    );
  }
}

export default reduxForm({
  form: 'user',
  enableReinitialize: true,
  keepDirtyOnReinitialize: true
})(injectIntl(RegisterForm));
