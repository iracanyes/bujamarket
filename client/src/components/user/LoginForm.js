/**
 * Author: iracanyes
 * Date: 16/08/2019
 * Description:
 */
import React, { Fragment } from 'react';
import { Link, withRouter } from "react-router-dom";

import { login, logout } from "../../actions/user/login";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { Field, reduxForm } from "redux-form";
import { Spinner } from "reactstrap";
import {toastError} from "../../layout/ToastMessage";
import GoogleSignInButton from "./GoogleSignInButton";
import {
  Button, CircularProgress,
  Paper,
  Typography,
} from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";
import BackgroundImage from "../../assets/img/page/login-page.jpg";
import { orange } from "@material-ui/core/colors";

const styles= theme =>  ({
  title: {
    fontFamily: 'Raleway',
    textAlign: 'center',
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
    color: orange[500],
    letterSpacing: '-0.025rem',
    fontWeight: '700'
  },
  circularProgress: {
    color: orange[500],
    marginRight: theme.spacing(1)
  }
});

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

    //  Set the background style of the main content of this page
    this.props.setStyle({
      main: {
        backgroundImage: 'url('+BackgroundImage+')',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%'
      }
    });
  }

  componentWillUnmount() {
    this.props.setStyle({});
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

      let prevRoute = this.props.location.state ? this.props.location.state.from : '/';
      let params = this.props.location.state && this.props.location.state.params ? this.props.location.state.params : null;
      this.props.login(email, password, this.props.history, {state: {from: prevRoute, params: params  }});
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
    const { loading, intl, errorLogin, classes } = this.props;
    const { email } = this.state;

    typeof errorLogin === 'string' && toastError(errorLogin);

    return (
      <Fragment>

        <Paper elevation={3} id={'form-login'} className="col-lg-4 mx-auto my-5 pt-2 pb-5">
          <Typography variant={'h4'} color={'primary'} className={classes.title}>
            <FormattedMessage  id={"app.page.user.login.title"}
                               defaultMessage="Connexion"
                               description="Page User - Login title"
            />
          </Typography>
          <form
            name="form"
            className={"col-lg-10 mx-auto px-3"}
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
              <div className={'d-flex flex-row  justify-content-center'}>
                <Button
                  variant={'contained'}
                  color={'primary'}
                  className={'mx-2'}
                  type={'submit'}
                >
                  { loading === true && <CircularProgress color={'primary'} size={18} className={classes.circularProgress}/> }
                  <FormattedMessage  id={"app.page.user.login.title"}
                                     defaultMessage="Connexion"
                                     description="Page User - login"
                  />
                </Button>
                <Link to="/register" className="MuiButtonBase-root MuiButton-root MuiButton-contained mx-2 MuiButton-containedPrimary">
                  <FormattedMessage  id={"app.page.user.register.title"}
                                     defaultMessage="Inscription"
                                     description="Page User - register"
                  />
                </Link>
              </div>
              <hr/>
              <div className={'d-flex flex-row justify-content-center'}>
                <GoogleSignInButton/>
              </div>
            </div>
          </form>
        </Paper>
      </Fragment>

    );
  }
}

const mapStateToProps = state => {
  const { login: authenticated, loading, error: errorLogin } = state.user.authentication;

  return { authenticated, loading, errorLogin };
};

const mapDispatchToProps = dispatch => ({
  login : (email, password, history, prevRoute) => dispatch(login(email, password, history, prevRoute)),
  logout: () => dispatch( logout())
});

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({
    form: 'user',
    enableReinitialize: true,
    keepDirtyOnReinitialize: true
  })(injectIntl(withRouter(withStyles(styles)(LoginForm))))
);
