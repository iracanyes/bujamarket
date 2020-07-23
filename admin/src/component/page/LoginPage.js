// in src/MyLoginPage.js
import * as React from 'react';
import {useEffect, useState, useRef} from 'react';
import { Redirect, useHistory } from "react-router-dom";
import { useLogin, useNotify, Notification } from 'react-admin';
import { ThemeProvider } from '@material-ui/styles';
import {
  TextField,
  Button,
  Typography,
  Icon,
  Paper,
  Grid,
  FormGroup
} from '@material-ui/core';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import {
  FaGoogle,
  FaUserLock
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { RiAccountPinCircleLine } from "react-icons/ri";
import backgroundImage from "../../assets/img/bg-1.jpg";



const LoginPage = ({ theme }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useLogin();
  const notify = useNotify();
  let backgroundImageLoaded = false;
  const containerRef = useRef();

  const submit = (e) => {
    e.preventDefault();
    login({ email, password })
      .then(() => <Redirect to={'/'}/>)
      .catch(() => toast.error('Invalid email or password'));
  };

  const updateBackgroundImage = () => {
    if (!backgroundImageLoaded && containerRef.current) {
      containerRef.current.style.backgroundImage = `url(${backgroundImage})`;
      containerRef.current.style.backgroundSize = 'cover';
      backgroundImageLoaded = true;
    }
  };

  // Load background image asynchronously to speed up time to interactive
  const lazyLoadBackgroundImage = () => {
    if (backgroundImage) {
      const img = new Image();
      img.onload = updateBackgroundImage;
      img.src = backgroundImage;
    }
  };

  useEffect(() => {
    if (!backgroundImageLoaded) {
      lazyLoadBackgroundImage();
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer />
      <div id={'login-page'}>
        <Grid
          container
          justify={"center"}
          alignItems={'center'}
          spacing={1}
          ref={containerRef}
        >
          <Paper>
            <Typography variant={'h4'}>Connexion</Typography>
            <form id={'login-form'} onSubmit={(e) => submit(e)} >
              <FormGroup row>
                <div className={'label-icon'}>
                  <RiAccountPinCircleLine/>
                </div>
                <div className={'input-textfield'}>
                  <TextField
                    id={'filled-basic'}
                    label={`E-mail`}
                    name={'email'}
                    defaultValue={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </FormGroup>
              <FormGroup row>
                <div className={'label-icon'}>
                  <FaUserLock/>
                </div>
                <div className={'input-textfield'}>
                  <TextField
                    id={'filled-basic'}
                    label={'Password'}
                    name={'password'}
                    type={'password'}
                    defaultValue={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
              </FormGroup>
              <div>
                <Button
                  variant={'contained'}
                  color={'primary'}
                  endIcon={<Icon>send</Icon>}
                  type={'submit'}
                >
                  Confirmer
                </Button>
                <Button
                  variant={'contained'}
                  color={'primary'}
                  startIcon={<FcGoogle/>}
                >
                  Connexion avec Google
                </Button>
              </div>
            </form>
          </Paper>
        </Grid>
      </div>
      <Notification />
    </ThemeProvider>
  );
};

export default LoginPage;


