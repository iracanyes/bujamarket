import { SubmissionError } from 'redux-form';
import { fetch } from '../../utils/dataAccess';
import React from "react";
import { toast } from "react-toastify";
import { ToastWelcome, ToastError } from "../../layout/ToastMessage";

export function error(error) {
  return { type: 'USER_REGISTER_ERROR', error };
}

export function request(user) {
  return { type: 'USER_REGISTER_REQUEST', user  };
}

export function loading(loading) {
  return { type: 'USER_REGISTER_LOADING', loading };
}

export function success(user) {
  return { type: 'USER_REGISTER_SUCCESS', user };
}

export function logout() {
  /* Supprimer les infos de l'utilisateur du localStorage */
  localStorage.removeItem('token');

  return { type: 'USER_LOGOUT'};
}

export function register(values, history) {
  return dispatch => {
    dispatch(loading(true));
    dispatch(request(values));

    const headers = new Headers({
      'Content-Type': 'application/json',
    });

    return fetch('register', { method: 'POST', headers: headers, body: JSON.stringify(values) })
      .then(response => {
        dispatch(loading(false));

        return response.json();
      })
      .then(retrieved => {
        dispatch(success(retrieved));

        toast(
          <ToastWelcome message={`Bienvenue ${ retrieved.firstname + " " + retrieved.lastname }, visitez votre boîte de réception pour valider votre inscription!`}/>
        );

        history.push('/');
      })
      .catch(e => {
        dispatch(loading(false));



        /* Déconnexion et forcer le rechargement de la page si erreur 401 */
        if(e.code === 401)
        {
          dispatch(logout());
          history.push('register');
        }


        if(typeof e == 'string')
        {
          dispatch(error(e));
          dispatch(error(null));
        }else{
          if(e["hydra:description"])
          {
            dispatch(error(e["hydra:title"]));
            dispatch(error(null));
          }else{
            dispatch(error(e.message));
            dispatch(error(null));
          }

        }

      });
  };
}

export function reset() {
  return dispatch => {
    dispatch(loading(false));
    dispatch(error(null));
  };
}
