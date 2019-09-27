/**
 * Author: dashouney
 * Date: 16/08/2019
 * Description:
 */
import React, { Fragment } from 'react';
import { Link } from "react-router-dom";
//import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import CardImg from "reactstrap/es/CardImg";
import { login, logout } from "../../actions/user/login";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { Field, reduxForm } from "redux-form";
import FlashInfo from "../../layout/FlashInfo";

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

    console.log("handleSubmit", { email, password });
    console.log("handleSubmit - state", this.state );

    if( email && password )
    {
      this.props.login(email, password, this.props.history);
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
    const { email, submitted } = this.state;
    return (
      <Fragment>
        <div className="flash-message col-lg-6 mx-auto text-center my-2">
          {sessionStorage.getItem("flash-message") !== null && (
            <FlashInfo color={"success"} message={JSON.parse(sessionStorage.getItem("flash-message")).message}/>
          )}
          {sessionStorage.getItem("flash-message-error") !== null && (
            <FlashInfo color={"info"} message={JSON.parse(sessionStorage.getItem("flash-message-error")).message}/>
          )}
        </div>
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
                id: "app.user.item.email",
                defaultMessage: "E-mail",
                description: "User item - email"
              })}
              placeholder="tim_dubois@gmail.com"
              value={email}
              onChange={this.handleChange}
            />
            <Field
              component={this.renderField}
              name="password"
              type="password"
              labelText={intl.formatMessage({
                id: "app.user.item.password",
                defaultMessage: "Mot de passe",
                description: "User item - password"
              })}
              placeholder="*************"
              onChange={this.handleChange}
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
      </Fragment>

    );
  }
}

const mapStateToProps = state => {
  const { loggingIn } = state.user.authentication;

  return { loggingIn };
};

const mapDispatchToProps = dispatch => ({
  login : (email, password, history) => dispatch(login(email, password, history)),
  logout: () => dispatch( logout())
});

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({
    form: 'user',
    enableReinitialize: true,
    keepDirtyOnReinitialize: true
  })(injectIntl(LoginForm))
);
