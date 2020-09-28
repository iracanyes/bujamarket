//import { SubmissionError } from 'redux-form';
import { fetch } from '../../utils/dataAccess';
import React from "react";
import { toast } from "react-toastify";
import { ToastSuccess, ToastError, ToastWelcome } from "../../layout/ToastMessage";

export function notify(notification){
  return { type: 'USER_LOGIN_NOTIFICATION', notification};
}

export function error(error) {
  return { type: 'USER_LOGIN_ERROR', error };
}

export function request(user) {
  return { type: 'USER_LOGIN_REQUEST', user };
}

export function loading(loading) {
  return { type: 'USER_LOGIN_LOADING', loading };
}

export function success(user) {
  return { type: 'USER_LOGIN_SUCCESS', user };
}

export function logout(user = null) {
  /* Supprimer les infos de l'utilisateur du localStorage */
  localStorage.removeItem('token');

  return { type: 'USER_LOGOUT_SUCCESS', user};
}

/*
* En passant l'objet this.props.history du composant
* vers son action creator permet de transmettre le changement d'URL au connected-react-router
**/
export function login(email, password, history, locationState) {
  return dispatch => {
    dispatch(request({ email }));
    dispatch(loading(true));

    const headers = new Headers({
      'Content-Type': 'application/json',
    });

    const requestOptions = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({email, password})
    };

    return fetch('authentication_token', requestOptions  )
      .then(response => {
        dispatch(loading(false));

        /* Utilisation si un objet est retourné*/
        return response.json();

      })
      .then(retrieved => {
        /* Utilisation du localStorage pour stocker le token de sécurité de l'utilisateur authentifié */
        localStorage.removeItem("token");
        localStorage.setItem("token", JSON.stringify(retrieved));

        return retrieved;

      })
      .then(retrieved => {
        dispatch(success(retrieved));

        const user = JSON.parse(atob(retrieved["token"].split(".")[1]));
        dispatch(notify(`Bienvenue ${ user.name }`));

        //
        if(locationState.state && locationState.state.params && locationState.state.from)
        {
          // Redirection vers la page précédent l'identification avec les données
          history.push({ pathname: locationState.state.from, state: { params: locationState.state.params } });
        }else{
          if(locationState.state.from && !/login/.test(locationState.state.from) )
          {
            // Redirection page précédente sans données
            history.push({ pathname: locationState.state.from });
          }else{
            // Redirection page d'accueil
            history.push('/');
          }

        }


      })
      .catch(e => {
        dispatch(loading(false));
        dispatch(logout(null));

        switch (true) {
          case e.code === 500:
            dispatch(error("Tentative de connexion avec l'adresse e-mail suivant est impossible! Contactez l'administrateur de la plateforme." ));
          case /Bad Credentials/.test(e.message.message):
            dispatch(error("Connexion non-autorisé! Identifiant et/ou mot de passe incorrect."));
            break;
          case /Account locked/.test(e.message.message):
            dispatch(error("Connexion non-autorisé! Ce compte a été bloqué, un e-mail vous a été envoyé pour débloquer le compte."));
            break;
          case /Account banned/.test(e.message.message):
            dispatch(error("Connexion non-autorisé! Ce compte a été banni de la plateforme."))
            break;
          case typeof e.message === "string":
            dispatch(error(e.message));
            break;
          case typeof e === "string":
            dispatch(error(e));
            break;
        }
        dispatch(error(null));
        /* Redirection vers la page de connexion + message d'erreur */
        history.push({pathname: 'login', state: locationState });
      });
  };
}


export function reset() {
  return dispatch => {
    dispatch(loading(false));
    dispatch(error(null));
  };
}
