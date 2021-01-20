import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { GoogleLogin} from "react-google-login";
import { loginGoogleUser} from "../../actions/user/loginGoogleUser";
import {toastError} from "../../layout/component/ToastMessage";
import {
  Fab,
  CircularProgress
} from "@material-ui/core";
import {
  RiLoginCircleLine
} from "react-icons/ri";
import {
  BsCheckCircle
} from "react-icons/bs";

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
    const { retrieved, error, loading  } = this.props;

    typeof error === 'string' && toastError(error);

    return (
      <Fragment>
        {/*
          <Fab
            aria-label={'login'}
            color={'primary'}
            className={'fab-google-login'}
          >
            {loading ? <RiLoginCircleLine /> : <BsCheckCircle /> }
          </Fab>
        */}
        { loading === true && (
          <div className={'position-relative mr-2'}>
            <Fab
              aria-label={'login'}
              color={'light'}
              className={'mui-fab-progress-icon'}
            >
              { !retrieved ? <RiLoginCircleLine /> : <BsCheckCircle /> }
            </Fab>
            { loading === true && <CircularProgress size={49} className={'mui-fab-progress-circular'} />}
          </div>
        )}
        <div>
          <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_SIGNIN_CLIENT_ID}
            buttonText={"Connexion avec Google"}
            onSuccess={this.login}
            onFailure={this.handleLoginFailure}
            cookiePolicy={'single_host_origin'}
            //responseType={'code,token'}
          />
        </div>

      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  const { retrieved, error, loading } = state.user.googleUserAuthentication;
  return { retrieved, error, loading };
};
const mapDispatchToProps = (dispatch) => ({
  loginGoogleUser: (userProfile, history, location) => dispatch(loginGoogleUser(userProfile, history, location))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(GoogleSignInButton));
