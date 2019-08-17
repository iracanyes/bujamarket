/**
 * Author: dashouney
 * Date: 16/08/2019
 * Description:
 */
import React from 'react';
import { Link } from "react-router-dom";
//import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import CardImg from "reactstrap/es/CardImg";
import { login, logout } from "../../actions/user/login";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { Field, reduxForm } from "redux-form";

class LoginForm extends React.Component {
  constructor(props)
  {
    super(props);

    this.props.logout();

    this.state = {
      email: '',
      password: '',
      submitted: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e)
  {
    const { name, value } = e.target;

    this.setState({ [name] : value });
  }

  handleSubmit(e)
  {
    /* Empêche la soumission  du formulaire  */
    e.preventDefault();

    /* Marquer la soumission du formulaire */
    this.setState({ submitted: true });

    /* On récupère les infos du formulaire contenu dans l'état du composant */
    const { email,  password } = this.state;

    if( email && password )
    {
      this.props.login(email, password);
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
          {data.labelText}
          {/*data.input.name.charAt(0).toUpperCase() + data.input.name.slice(1) */}
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
    const { loggingIn, intl } = this.props;
    const { username, password, submitted } = this.state;
    return (
      <div id={'form-login'} className="col-md-6 mx-auto col-md-offset-3">
        <h1>
          <FormattedMessage  id={"app.page.user.login.title"}
                             defaultMessage="Connexion"
                             description="Page User - Login title"
          />
        </h1>
        <form
          name="form"
          className={"col-lg-6 mx-auto px-3"}
          onSubmit={this.handleSubmit}
        >
          <Field
            component={this.renderField}
            name="email"
            type="email"
            labelText={intl.formatMessage({
              id: "app.user.item.your_email",
              defaultMessage: "E-mail",
              description: "User item - your email"
            })}
            placeholder="tim_dubois@gmail.com"
          />
          <Field
            component={this.renderField}
            name="password"
            type="password"
            labelText={intl.formatMessage({
              id: "app.user.item.your_password",
              defaultMessage: "Mot de passe",
              description: "User item - your password"
            })}
            placeholder="*************"
          />

          <div className="form-group">
            <button className="btn btn-primary mx-2 my-3">
              <FormattedMessage  id={"app.page.user.login.title"}
                                 defaultMessage="Connexion"
                                 description="Page User - login"
              />
            </button>
            {loggingIn &&
              <CardImg />
            }
            <Link to="/register" className="btn btn-outline-primary mx-2 my-3">
              <FormattedMessage  id={"app.page.user.register.title"}
                                 defaultMessage="Inscription"
                                 description="Page User - register"
              />

            </Link>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { loggingIn } = state.user.authentication;

  return { loggingIn };
};

const mapDispatchToProps = dispatch => ({
  login : (email, password) => dispatch(login(email,password)),
  logout: () => dispatch( logout())
});

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({
    form: 'user',
    enableReinitialize: true,
    keepDirtyOnReinitialize: true
  })(injectIntl(LoginForm))
);
