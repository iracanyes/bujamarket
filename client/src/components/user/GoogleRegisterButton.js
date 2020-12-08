import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { GoogleLogin, GoogleLogout } from "react-google-login";
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
    this.handleLoginFailure = this.handleLoginFailure.bind(this);
    this.logout = this.logout.bind(this);
    this.handleLogoutFailure = this.handleLogoutFailure.bind(this);
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
    console.log('[Login] response: ', response);

    this.props.registerGoogleUser(data, history, location);
  }

  logout(response){
    this.setState(state => ({
      isLogged: false,
      accessToken: null
    }));
  }

  handleLoginFailure(response){
    console.log('[Login] failure - response: ', response);
  }

  handleLogoutFailure(response){
    console.log('[Logout - failure] response: ', response);
  }

  render() {
    const { retrieved, error, loading, termsAccepted  } = this.props;

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
  const { retrieved, error, loading } = state.user.registerGoogleUser;
  return { retrieved, error, loading };
};
const mapDispatchToProps = (dispatch) => ({
  registerGoogleUser: (userProfile, history, location) => dispatch(registerGoogleUser(userProfile, history, location))
});

export default connect(null, mapDispatchToProps)(withRouter(GoogleRegisterButton));
