import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { GoogleLogin} from "react-google-login";
import { loginGoogleUser} from "../../actions/user/loginGoogleUser";
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
  }

  login(response){
    const { history, location } = this.props;
    if(response.accessToken){
      this.setState(state => ({
        isLogged: true,
        accessToken: response.accessToken
      }));
    }

    this.props.loginGoogleUser(response, history, location);
  }

  handleLoginFailure(response){
    console.log('[Login] failure - response: ', response);
  }

  render() {
    const { error  } = this.props;

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
  const { error, loading } = state.user.googleUserAuthentication;
  return { error, loading };
};
const mapDispatchToProps = (dispatch) => ({
  loginGoogleUser: (userProfile, history, location) => dispatch(loginGoogleUser(userProfile, history, location))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(GoogleSignInButton));
