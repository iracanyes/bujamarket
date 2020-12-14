/**
 * Author: iracanyes
 * Date: 02/09/2019
 * Description:
 */
import React,{ Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Col, Row } from "reactstrap";
import { FormattedMessage, injectIntl } from "react-intl";
import { register, reset } from "../../actions/user/register";
import PropTypes from 'prop-types';
import {toastError} from "../../layout/ToastMessage";
import { SpinnerLoading } from "../../layout/Spinner";
import {
  Button,
  Paper,
  InputLabel,
  FormHelperText,
  FormControl,
  Select
} from "@material-ui/core";
import GoogleRegisterButton from "./GoogleRegisterButton";
import BackgroundImage from "../../assets/img/page/register-page.jpg";

class RegisterForm extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    error: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.state = {
      user: {
        firstname: '',
        lastname: '',
        password: '',
        userType: '',
        termsAccepted: false
      },
      submitted: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    //  Set the background style of the main content of this page
    this.props.setStyle({
      main: {
        backgroundImage: 'url('+BackgroundImage+')',
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat'
      }
    });
  }

  componentWillUnmount() {
    this.props.reset();
  }

  handleChange(event) {
    const { name, value } = event.target;
    const { user } = this.state;

    this.setState({
      user: {
        ...user,
        [name]: value
      }
    });

  }

  handleCheckboxChange(event){
    const { name } = event.target;

    this.setState(state => ({
      user: {
        ...state.user,
        [name]: !state.user.termsAccepted
      }
    }));
  }

  handleSubmit(e)
  {
    e.preventDefault();

    this.setState({ submitted: true });

    const { user } = this.state;

    if( user.email && user.password && user.firstname && user.lastname && user.userType )
    {
      this.props.register(user, this.props.history);
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
    const { intl, errorRegister, loading  } = this.props;
    const { user } = this.state;

    errorRegister && typeof errorRegister === "string" && toastError(errorRegister);

    return (
      <Fragment>
        <Paper elevation={3} className={"user-authentication-form col-lg-6 mx-auto my-5 pt-2 pb-5"}>
          <h1>
            <FormattedMessage  id={"app.page.user.register.title"}
                               defaultMessage="Inscription"
                               description="Page User - Register title"
            />
          </h1>
          {}
          <form
            id="register-form"
            name="register"
            className={"col-lg-10 mx-auto px-3"}
            onSubmit={this.handleSubmit}
          >

            <Row className={'my-2'}>
              <Col>
                <Field
                  component={this.renderField}
                  name="email"
                  type="email"
                  placeholder="tim_dubois@gmail.com"
                  value={user.email}
                  labelText={intl.formatMessage({
                    id: "app.user.item.email",
                    defaultMessage: "Email",
                    description: "User item - email"
                  })}
                  onChange={this.handleChange}
                />
              </Col>
              <Col>
                <Field
                  component={this.renderField}
                  name="password"
                  type="password"
                  placeholder=""
                  required={true}
                  labelText={intl.formatMessage({
                    id: "app.user.item.password",
                    defaultMessage: "Mot de passe",
                    description: "User item - password"
                  })}
                  onChange={this.handleChange}
                />
              </Col>
            </Row>
            <Row className={'my-2'}>
              <Col>
                <Field
                  component={this.renderField}
                  name="lastname"
                  type="text"
                  placeholder="Dubois"
                  required={true}
                  labelText={intl.formatMessage({
                    id: "app.user.item.lastname",
                    defaultMessage: "Nom",
                    description: "User item - lastname"
                  })}
                  onChange={this.handleChange}
                  value={user.lastname}
                />
              </Col>
              <Col>
                <Field
                  component={this.renderField}
                  name="firstname"
                  type="text"
                  placeholder="Timothy"
                  required={true}
                  labelText={intl.formatMessage({
                    id: "app.user.item.firstname",
                    defaultMessage: "Prénom",
                    description: "User item - firstname"
                  })}
                  onChange={this.handleChange}
                  value={user.firstname}
                />
              </Col>
            </Row>
            <Row className={'my-4'}>
              <Col>
                <FormControl variant={'outlined'}>
                  <InputLabel
                    htmlFor={"user_type"}
                  >
                    <FormattedMessage  id={"app.user.item.user_type"}
                                       defaultMessage="Type d'utilisateur"
                                       description="User item - user type"

                    />
                  </InputLabel>
                  <Select
                    native
                    labelWidth={100}
                    value={this.state.user.userType}
                    onChange={this.handleChange}
                    label={"Type d'utilisateur"}
                    required={true}
                    inputProps = {{
                      name: 'userType',
                      id: 'user_type',
                      className: 'pl-5'
                    }}
                  >
                    <option aria-label="None" value={""}/>
                    <option value={'customer'}>
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

                  </Select>
                  <FormHelperText>
                    <FormattedMessage
                      id={'app.form.required_input_for_all_accounts'}
                      defaultMessage={'Champ obligatoire pour tous les comptes'}
                      description={'Form - Required input'}
                    />
                  </FormHelperText>
                </FormControl>
              </Col>
            </Row>
            <Row className={'mt-4 mb-3'}>
              <Col>

                <div className={`form-group d-flex mt-2`}>
                  <input
                    name="termsAccepted"
                    type="checkbox"
                    className={'mx-2'}
                    style={{position: 'absolute', top: '10px'}}
                    required={true}
                    id={`user_termsAccepted`}
                    onClick={this.handleCheckboxChange}
                    value={true}
                  />
                  <label
                    htmlFor={`user_termsAccepted`}
                    className="form-control-label col-10 ml-5 px-0"
                  >
                    J'accepte les condition d'utilisation de la plateforme. <Link to={'/terms_condition'}>Voir termes et conditions</Link> <br/>
                    J'autorise l'exploitation de mes données personnelles fournis à cette plateforme dans les limites indiquées par les <Link to={'/rgpd'}>Utilisations des données personnelles</Link>
                  </label>


                </div>
              </Col>
            </Row>
            { loading === true && (
              <Row className={'justify-content-center'}>
                <SpinnerLoading color={'info'} message={'Inscription en cours'}/>
              </Row>
            )}

            <Row className={'d-flex flex-column'}>
              <div className={'d-flex flex-row justify-content-center'}>
                <Button
                  variant={'contained'}
                  color={'primary'}
                  type="submit"
                  className="mx-2"
                >
                  Envoyer
                </Button>
                <Link  to={"/login"} className={"MuiButtonBase-root MuiButton-root MuiButton-contained mx-2"}>
                  Annuler
                </Link>
              </div>
              <hr/>
              <div className={'d-flex flex-row justify-content-center'}>
                {user.userType !== "" && (
                  <GoogleRegisterButton
                    userType={user.userType}
                    termsAccepted={user.termsAccepted}
                  />
                )}
              </div>

            </Row>


          </form>
        </Paper>
      </Fragment>

    );
  }
}

const mapStateToProps = state => {
  const { registering, error: errorRegister, loading } = state.user.registration;

  return { registering, errorRegister, loading };
};

const mapDispatchToProps = dispatch => ({
  register: (user, history ) => dispatch( register(user, history)),
  reset: () => dispatch(reset())
});

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({
    form: 'register',
    enableReinitialize: true,
    keepDirtyOnReinitialize: true
  })(injectIntl(RegisterForm))
)
