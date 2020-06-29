import { SubmissionError } from 'redux-form';
import { fetch } from '../../utils/dataAccess';
import {updateError} from "./update";

export function error(error) {
  return { type: 'ADDRESS_CREATE_ERROR', error };
}

export function loading(loading) {
  return { type: 'ADDRESS_CREATE_LOADING', loading };
}

export function success(created) {
  return { type: 'ADDRESS_CREATE_SUCCESS', created };
}

export function create(values, history, location) {
  return dispatch => {
    dispatch(loading(true));

    /* Ajout du JWT authentication token de l'utilisateur connecté */
    const token = localStorage.getItem('token') !== null ? JSON.parse(localStorage.getItem('token')) : null;
    const headers = new Headers({'Content-Type':'application/ld+json'});
    token && headers.set('Authorization', 'Bearer '+ token.token);

    return fetch('address/create', { method: 'POST', headers, body: JSON.stringify(values) })
      .then(response => {
        dispatch(loading(false));

        return response.json();
      })
      .then(retrieved => dispatch(success(retrieved)))
      .catch(e => {
        dispatch(loading(false));

        if (e instanceof SubmissionError) {
          dispatch(error(e.errors._error));
        }

        if(e.code === 401)
        {
          dispatch(error("Authentification nécessaire avant de poursuivre!"));
          history.push({pathname: '../../login', state: { from : location.pathname }});
        }

        if(typeof e === 'string')
        {
          dispatch(error(e));
        }else{
          if(e['hydra:description'])
          {
            dispatch(error(e['hydra:title']));
          }else{
            dispatch(error(e.message));
          }
        }
        dispatch(error(null));
      });
  };
}

export function reset() {
  return dispatch => {
    dispatch(loading(false));
    dispatch(error(null));
  };
}
