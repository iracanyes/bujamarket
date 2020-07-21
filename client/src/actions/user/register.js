import { SubmissionError } from 'redux-form';
import { fetch } from '../../utils/dataAccess';
import React from "react";
import { toastWelcome, toastError } from "../../layout/ToastMessage";

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

        history.push('/');
      })
      .catch(e => {
        dispatch(loading(false));

        switch(true){
          case typeof e === 'string':
            dispatch(error(e));
            break;
          case typeof e["hydra:description"] === "string":
            dispatch(error(e["hydra:description"]));
            break;
          case typeof e.message === "string":
            dispatch(error(e.message));
            break;
        }
        dispatch(error(null));

      });
  };
}

export function reset() {
  return dispatch => {
    dispatch(loading(false));
    dispatch(error(null));
    //dispatch(success({}));
  };
}
