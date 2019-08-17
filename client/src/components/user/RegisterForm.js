import React, { Component, Fragment } from 'react';
import { Link } from "react-router-dom";
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import { Col, Row } from "reactstrap";
import { FormattedMessage, injectIntl } from "react-intl";
import { register } from "../../actions/user/register";
import { connect } from "react-redux";

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
      <div className={"user-authentication-form my-3"}>
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
                htmlFor={'user_type'}
                className="form-control-label"
              >
                <FormattedMessage  id={"app.user.item.user_type"}
                                   defaultMessage="Type d'utilisateur"
                                   description="User item - user type"

                />
              </label>
              &nbsp;:&nbsp;
              <Field
                component={"select"}
                name="userType"
                type="select"
                placeholder=""
              >
                <option value="client">
                  { intl.formatMessage({
                    id: "app.user.item.user_type.client",
                    description: "User item - user type client",
                    defaultMessage: "Client"
                  })}
                </option>
                <option value="supplier">
                  { intl.formatMessage({
                    id: "app.user.item.user_type.supplier",
                    description: "User item - user type supplier",
                    defaultMessage: "Fournisseur"
                  })}

                </option>
              </Field>
            </Col>

          </Row>
          <Row>
            <button type="submit" className="btn btn-success my-3 mx-2">
              Submit
            </button>
            <Link to={"/login"} className={"btn btn-outline-danger my-3 mx-2"}>
              Cancel
            </Link>
          </Row>


        </form>
      </div>

    );
  }
}

const mapStateToProps = state => {
  const { registering } = state.user.registration;

  return { registering };
};

const mapDispatchToProps = dispatch => ({
  register: user => dispatch(register(user))
});

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({
    form: 'user',
    enableReinitialize: true,
    keepDirtyOnReinitialize: true
  })(injectIntl(RegisterForm))
);

