/**
 * Author: iracanyes
 * Date: 04/06/2020
 * Description:
 */
import React, { Fragment } from 'react';
import { Link } from "react-router-dom";
//import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import CardImg from "reactstrap/es/CardImg";
import { unlockAccount } from "../../actions/user/unlockAccount";
import { logout } from "../../actions/user/login";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { Field, reduxForm } from "redux-form";
import { Spinner } from "reactstrap";
import {toast} from "react-toastify";
import {ToastError} from "../../layout/ToastMessage";

class UnlockAccountForm extends React.Component {
  constructor(props)
  {
    super(props);

    this.props.logout();

    this.state = {
      password: '',
      confirmPassword: '',
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

    if(this.state.password !== this.state.confirmPassword)
    {
      toast(<ToastError message={"Les mots de passe ne correspondent pas!"} />);
      return;
    }

    /* Marquer la soumission du formulaire */
    this.setState({ submitted: true });


    const data = new FormData(document.getElementById('unlock-account-form'));
    data.append('token', this.props.match.params.token);

    if( data )
    {
      this.props.unlockAccount(data, this.props.history);
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
    const { unlocking, intl } = this.props;
    const { password, confirmPassword } = this.state;
    return (
      <Fragment>

        <div  className="col-md-6 mx-auto col-md-offset-3">
          <h1>
            <FormattedMessage  id={"app.page.user.unlock_account.title"}
                               defaultMessage="Ré-activation du compte"
                               description="Page User - Unlock account title"
            />
          </h1>

          <form
            name="form"
            id={'unlock-account-form'}
            className={"col-lg-6 mx-auto px-3"}
            onSubmit={this.handleSubmit}
          >
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
              value={password}
              onChange={this.handleChange}
            />
            <Field
              component={this.renderField}
              name="confirmPassword"
              type="password"
              labelText={intl.formatMessage({
                id: "app.user.item.confirmPassword",
                defaultMessage: "Confirmer votre mot de passe",
                description: "User item - confirm password"
              })}
              placeholder="*************"
              onChange={this.handleChange}
            />

            <div className="form-group">
              <button className="btn btn-primary mx-2 my-3">
                <FormattedMessage  id={"app.button.validate"}
                                   defaultMessage="Valider"
                                   description="Page User - validate"
                />
              </button>
              {unlocking &&
                <Spinner color={"primary"} />
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
  const { unlocking } = state.user.authentication;

  return { unlocking };
};

const mapDispatchToProps = dispatch => ({
  unlockAccount : (data, history) => dispatch(unlockAccount(data,history)),
  logout: () => dispatch(logout())
});

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({
    form: 'unlock-account-form',
    enableReinitialize: true,
    keepDirtyOnReinitialize: true
  })(injectIntl(UnlockAccountForm))
);
