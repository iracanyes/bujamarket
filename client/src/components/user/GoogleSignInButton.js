import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import { loginGoogleUser, reset } from "../../actions/user/loginGoogleUser";
import {toastError} from "../../layout/ToastMessage";

class GoogleSignInButton extends Component{
  constructor(props) {
    super(props);

    this.state = {
      isLogged: false,
      accessToken: ''
    };

    this.login = this.login.bind(this);
    this.handleLoginFailure = this.handleLoginFailure.bind(this);
    this.logout = this.logout.bind(this);
    this.handleLogoutFailure = this.handleLogoutFailure.bind(this);
  }

  login(response){
    const { history, location } = this.props;
    if(response.accessToken){
      this.setState(state => ({
        isLogged: true,
        accessToken: response.accessToken
      }));
    }
    console.log('[Login] response: ', response);
    this.props.loginGoogleUser(response, history, location);
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
    const { retrieved, error, loading  } = this.props;

    typeof error === 'string' && toastError(error);

    return (<Fragment>
      <GoogleLogin
        clientId={process.env.REACT_APP_GOOGLE_SIGNIN_CLIENT_ID}
        buttonText={"Connexion avec Google"}
        onSuccess={this.login}
        onFailure={this.handleLoginFailure}
        cookiePolicy={'single_host_origin'}
        //style={{ marginTop: '100px'}}
        //responseType={'code,token'}
      />
    </Fragment>);
  }
}

const mapStateToProps = state => {
  const { retrieved, error, loading } = state.user.loginGoogleUser;
  return { retrieved, error, loading };
};
const mapDispatchToProps = (dispatch) => ({
  loginGoogleUser: (userProfile, history, location) => dispatch(loginGoogleUser(userProfile, history, location))
});

export default connect(null, mapDispatchToProps)(withRouter(GoogleSignInButton));
