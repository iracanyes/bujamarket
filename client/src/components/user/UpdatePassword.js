/**
 * Author: iracanyes
 * Date: 04/06/2020
 * Description:
 */
import React, { Fragment } from 'react';
import { logout } from "../../actions/user/login";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { FormattedMessage, injectIntl } from "react-intl";
import { Field, reduxForm } from "redux-form";
import { Spinner } from "reactstrap";
import {toastError} from "../../layout/ToastMessage";
import { updatePassword } from "../../actions/user/updatePassword";

class UpdatePassword extends React.Component {
  static propTypes = {
    updatePassword: PropTypes.func.isRequired,
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    logout: PropTypes.func,
    eventSource: PropTypes.instanceOf(EventSource),
    intl: PropTypes.func
  };

  constructor(props)
  {
    super(props);

    this.state = {
      password: '',
      newPassword: '',
      confirmPassword: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  handleChange(e)
  {
    const { name, value } = e.target;

    this.setState({ [name] : value });
  }

  cancel(){
    if(this.props.location.state)
      this.props.history.push(this.props.location.state.from);
    else
      this.props.history.push("/");
  }

  handleSubmit(e)
  {
    /* Empêche la soumission  du formulaire  */
    e.preventDefault();

    if(this.state.newPassword !== this.state.confirmPassword)
    {
      toastError("Le nouveau mots de passe n'est pas identique dans les 2 champs de réponse!");
      return;
    }

    const data = new FormData(document.getElementById('update-password-form'));

    if( data )
    {
      this.props.updatePassword(data, this.props.history, this.props.location);
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
    const { intl, loading } = this.props;
    const { password } = this.state;

    return (
      <Fragment>
        <div  className="col mx-auto col-md-offset-3">
          <h1>
            <FormattedMessage  id={"app.button.update_password"} />
          </h1>
          <form
            name="form"
            id={'update-password-form'}
            className={"col-lg-6 mx-auto px-3"}
            onSubmit={this.handleSubmit}
          >
            <Field
              component={this.renderField}
              name="password"
              type="password"
              labelText={intl.formatMessage({
                id: "app.user.item.old_password",
                defaultMessage: "Ancien mot de passe",
                description: "User item - password"
              })}
              placeholder="*************"
              value={password}
              onChange={this.handleChange}
            />
            <Field
              component={this.renderField}
              name="newPassword"
              type="password"
              labelText={intl.formatMessage({
                id: "app.user.item.new_password",
                defaultMessage: "Nouveau mot de passe",
                description: "User item - New password"
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
              {loading &&
                <Spinner color={"primary"} className={"m-2"} style={{verticalAlign: "middle"}}/>
              }
              <button onClick={this.cancel} className="btn btn-outline-primary mx-2 my-3">
                <FormattedMessage  id={"app.button.cancel"}
                                   defaultMessage="Annuler"
                                   description="Button - cancel"
                />
              </button>
            </div>
          </form>
        </div>
      </Fragment>

    );
  }
}

const mapStateToProps = state => {
  const { error, loading, eventSource } = state.user.updatePassword;

  return { error, loading, eventSource };
};

const mapDispatchToProps = dispatch => ({
  updatePassword : (data, history, location) => dispatch(updatePassword(data, history, location)),
  logout: () => dispatch(logout())
});

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({
    form: 'update-password-form',
    enableReinitialize: true,
    keepDirtyOnReinitialize: true
  })(injectIntl(UpdatePassword))
);
