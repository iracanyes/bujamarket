import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { GoogleLogin } from "react-google-login";
import { registerGoogleUser, reset } from "../../actions/user/registerGoogleUser";
import {toastError} from "../../layout/ToastMessage";

class GoogleRegisterButton extends Component{
  constructor(props) {
    super(props);

    this.state = {
      isLogged: false,
      accessToken: ''
    };

    this.register = this.register.bind(this);
  }

  register(response){
    const { history, location, userType, termsAccepted } = this.props;
    const data = {
      userType,
      termsAccepted,
      response
    };

    if(response.accessToken){
      this.setState(state => ({
        isLogged: true,
        accessToken: response.accessToken
      }));
    }


    this.props.registerGoogleUser(data, history, location);
  }

  render() {
    const { error, termsAccepted  } = this.props;

    typeof error === 'string' && toastError(error);

    return (<Fragment>
      <GoogleLogin
        clientId={process.env.REACT_APP_GOOGLE_SIGNIN_CLIENT_ID}
        buttonText={"Inscription avec Google"}
        onSuccess={this.register}
        onFailure={this.handleLoginFailure}
        cookiePolicy={'single_host_origin'}
        disabled={!termsAccepted}
        //style={{ marginTop: '100px'}}
        //responseType={'code,token'}
      />
    </Fragment>);
  }
}

const mapStateToProps = state => {
  const { retrieved, error, loading } = state.user.googleUserRegistration;
  return { retrieved, error, loading };
};
const mapDispatchToProps = (dispatch) => ({
  registerGoogleUser: (userProfile, history, location) => dispatch(registerGoogleUser(userProfile, history, location)),
  reset: () => dispatch(reset())
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(GoogleRegisterButton));
