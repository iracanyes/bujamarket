/**
 * Author: iracanyes
 * Date: 02/09/2019
 * Description:
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Col, Row } from "reactstrap";
import { FormattedMessage, injectIntl } from "react-intl";
import { create } from "../../actions/message/create";
import PropTypes from 'prop-types';

class SupplierContactForm extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    error: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.state = {
      message: {
        content: '',
        attachmentUrl: '',
        attachmentFile: '',
        attachmentImage: ''
      },
      submitted: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    const { message } = this.state;

    this.setState({
      message: {
        ...message,
        [name]: value
      }
    });

  }

  handleSubmit(e)
  {
    e.preventDefault();

    this.setState({ submitted: true });

    const { message } = this.state;

    if( message.content )
    {
      this.props.send(message, this.props.history);
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
    const { intl  } = this.props;
    const { message } = this.state;
    return (
      <Fragment>
        <div className={"supplier-contact-form my-3"}>
          <h1>
            <FormattedMessage  id={"app.form.contact.title"}
                               defaultMessage="Contactez-nous"
                               description="Page Supplier - Contact form title"
            />
          </h1>
          {this.props.error && (
            <div className="alert alert-danger" role="alert">
              <span className="fa fa-exclamation-triangle" aria-hidden="true" />{' '}
              {this.props.error}
            </div>
          )}
          <form
            id="contact-form"
            name="contact"
            className={"col-lg-6 mx-auto px-3"}
            onSubmit={this.handleSubmit}
          >
            <Row>
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
            <Row>
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
            <Row>
              <Col>
                <label
                  htmlFor={'userType'}
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
                  onChange={this.handleChange}
                  value={this.state.user.userType}
                >
                  <option value="customer">
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
              <Col>

                <div className={`form-group d-flex mt-2`}>
                  <input
                    name="termsAccepted"
                    type="checkbox"
                    className={'mx-2'}
                    style={{position: 'absolute', top: '10px'}}
                    required={true}
                    id={`user_termsAccepted`}
                    onChange={this.handleChange}
                    value={true}
                  />
                  <label
                    htmlFor={`user_termsAccepted`}
                    className="form-control-label col-10 ml-5"
                  >
                    J'accepte les condition d'utilisation de la plateforme. <Link to={'/terms_condition'}>Voir termes et conditions</Link> <br/>
                    J'autorise l'exploitation de mes données personnelles fournis à cette plateforme dans les limites indiquées par les <Link to={'/rgpd'}>Utilisations des données personnelles</Link>
                  </label>


                </div>
              </Col>
            </Row>
            <Row>
              <button type="submit" className="btn btn-success my-3 mx-2">
                Envoyer
              </button>
              <Link to={"/login"} className={"btn btn-outline-danger my-3 mx-2"}>
                Annuler
              </Link>
            </Row>


          </form>
        </div>
      </Fragment>

    );
  }
}

const mapStateToProps = state => {
  const { created } = state.message.create;

  return { created };
};

const mapDispatchToProps = dispatch => ({
  create: (values, history ) => dispatch( register(values, history))
});

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({
    form: 'contact',
    enableReinitialize: true,
    keepDirtyOnReinitialize: true
  })(injectIntl(SupplierContactForm))
)
