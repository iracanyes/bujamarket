import { SubmissionError } from 'redux-form';
import {
  extractHubURL,
  fetch,
  normalize,
  mercureSubscribe as subscribe
} from '../../utils/dataAccess';
import React from "react";
import { toast } from "react-toastify";
import {toastError, ToastSuccess, ToastError, toastSuccess} from "../../layout/ToastMessage";

export function error(error) {
  return { type: 'USER_UPDATE_PASSWORD_ERROR', error };
}

export function request(user) {
  return { type: 'USER_UPDATE_PASSWORD_REQUEST', user  };
}

export function loading(loading) {
  return { type: 'USER_UPDATE_PASSWORD_LOADING', loading };
}

export function success(user) {
  return { type: 'USER_UPDATE_PASSWORD_SUCCESS', user };
}

export function successRetrieved(retrieved) {
  return { type: 'USER_UPDATE_PASSWORD_RETRIEVE_SUCCESS', retrieved };
}

export function retrieve() {
  return dispatch => {
    dispatch(loading(true));

    const headers = new Headers({
      'Content-Type': 'application/json',
    });

    if(localStorage.getItem('token') !== null)
      headers.set('Authorization', 'Bearer '+ JSON.parse(localStorage.getItem('token')).token);

    return fetch('/me',{ method: 'POST', headers: headers })
      .then(response =>
        response
          .json()
          .then(retrieved => ({ retrieved, hubURL: extractHubURL(response) }))
      )
      .then(({ retrieved, hubURL }) => {
        retrieved = normalize(retrieved);

        dispatch(loading(false));
        dispatch(successRetrieved(retrieved));

        if (hubURL) dispatch(mercureSubscribe(hubURL, retrieved['@id']));
      })
      .catch(e => {
        dispatch(loading(false));
        dispatch(error(e));

      });
  };
}


export function updatePassword(values, history, location) {
  return dispatch => {
    dispatch(error({}));
    dispatch(loading(true));
    dispatch(request(values));

    const headers = new Headers();
    if(localStorage.getItem('token') !== null)
      headers.set('Authorization', 'Bearer '+ JSON.parse(localStorage.getItem('token')).token);


    return fetch('update_password', { method: 'POST', headers: headers, body: values})
      .then(response => {
        dispatch(loading(false));

        return response.json();
      })
      .then(retrieved => {
        dispatch(success(retrieved));

        toastSuccess('Mot de passe mis à jour!\nAu plaisir!');

        // Redirection vers la page de provenance
        if(location.state && location.state.from)
          history.push({pathname: location.state.from });
        else
          history.push({pathname: '/'});
      })
      .catch(e => {
        dispatch(loading(false));

        if (e.code  === 401) {
          toastError("Authentification nécessaire!");
          history.push({pathname: "../../login", state: { from: location.pathname } });
        }else{

          if(typeof e === 'string')
          {
            //dispatch(error(e));
            toastError(e);
          }else{
            //dispatch(error(e['hydra:description']));
            toastError(e['hydra:description'])
          }
          history.push({pathname: '/profile/update_password'});
        }
        dispatch(error({}));
      });
  };
}

export function reset(eventSource) {
  return dispatch => {
    if (eventSource) eventSource.close();

    dispatch({ type: 'USER_UPDATE_PASSWORD_RESET' });
    dispatch(error(null));
    dispatch(loading(false));
  };
}

export function mercureSubscribe(hubURL, topic) {
  return dispatch => {
    const eventSource = subscribe(hubURL, [topic]);
    dispatch(mercureOpen(eventSource));
    eventSource.addEventListener('message', event =>
      dispatch(mercureMessage(normalize(JSON.parse(event.data))))
    );
  };
}

export function mercureOpen(eventSource) {
  return { type: 'USER_UPDATE_PASSWORD_MERCURE_OPEN', eventSource };
}

export function mercureMessage(retrieved) {
  return dispatch => {
    if (1 === Object.keys(retrieved).length) {
      dispatch({ type: 'USER_UPDATE_PASSWORD_MERCURE_DELETED', retrieved });
      return;
    }

    dispatch({ type: 'USER_UPDATE_PASSWORD_MERCURE_MESSAGE', retrieved });
  };
}

