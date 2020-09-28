import { SubmissionError } from 'redux-form';
import {extractHubURL, fetch, normalize} from '../../utils/dataAccess';
import React from "react";
import { toast } from "react-toastify";
import { toastSuccess, toastError } from "../../layout/ToastMessage";

export function error(error) {
  return { type: 'USER_SUBSCRIBE_ERROR', error };
}

export function request(user) {
  return { type: 'USER_SUBSCRIBE_REQUEST', user  };
}

export function loading(loading) {
  return { type: 'USER_SUBSCRIBE_LOADING', loading };
}

export function success(user) {
  return { type: 'USER_SUBSCRIBE_SUCCESS', user };
}

export function successRetrieved(retrieved) {
  return { type: 'USER_SUBSCRIBE_RETRIEVE_SUCCESS', retrieved };
}

export function retrieve(token, history) {
  return dispatch => {
    dispatch(loading(true));

    const headers = new Headers({
      'Content-Type': 'application/json',
    });

    return fetch('/user_temp',{ method: 'POST', headers: headers, body: JSON.stringify({'token': token}) })
      .then(response =>
        response
          .json()
          .then(retrieved => ({ retrieved, hubURL: extractHubURL(response) }))
      )
      .then(({ retrieved, hubURL }) => {
        retrieved = normalize(retrieved);

        dispatch(loading(false));
        dispatch(successRetrieved(retrieved));

        //if (hubURL) dispatch(mercureSubscribe(hubURL, retrieved['@id']));
      })
      .catch(e => {
        dispatch(loading(false));

        switch(true){
          case typeof e['hydra:description'] === "string":
            dispatch(error("Security token invalid!"));
            dispatch(error(null));
            history.push('/register');
            break;
          case typeof e.message === "string":
            dispatch(error(e.message));
            break;
          case typeof e === "string":
            dispatch(error(e));
            break;
        }
        dispatch(error(null));

      });
  };
}


export function subscribe(values, history) {
  return dispatch => {
    dispatch(loading(true));
    dispatch(request(values));

    const headers = new Headers({
      'Content-Type': 'multipart/form-data',
    });

    return fetch('subscribe/'+values.get("token"), { method: 'POST', body: values })
      .then(response => {
        dispatch(loading(false));

        return response.json();
      })
      .then(retrieved => {
        dispatch(success(retrieved));


        if(/Customer/.test(retrieved['@context']))
        {
          toastSuccess('Inscription terminée!\nConnectez vous à la plateforme et visitez votre profil pour ajouter les informations de livraison pour vos achats.\nAu plaisir!');
        }else{
          toastSuccess('Inscription terminée!\nConnectez vous à la plateforme et visitez votre profil pour ajouter vos produits.\nAu plaisir!');
        }

        // Redirection vers la page d'accueil
        history.push('../../login');
      })
      .catch(e => {
        dispatch(loading(false));

        switch(true){
          case typeof e['hydra:description'] === "string":
            dispatch(error(e['hydra:description']));
            break;
          case typeof e.message === "string":
            dispatch(error(e.message));
            break;
          case typeof e === "string":
            dispatch(error(e));
            break;
        }
        dispatch(error(null));
        history.push({pathname: values.get('token')});

      });
  };
}

export function reset(eventSource) {
  return dispatch => {
    if (eventSource) eventSource.close();

    dispatch({ type: 'USER_SUBSCRIBE_RESET' });
    dispatch(error(null));
    dispatch(loading(false));
  };
}
/*
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
  return { type: 'USER_SUBSCRIBE_MERCURE_OPEN', eventSource };
}

export function mercureMessage(retrieved) {
  return dispatch => {
    if (1 === Object.keys(retrieved).length) {
      dispatch({ type: 'USER_SUBSCRIBE_MERCURE_DELETED', retrieved });
      return;
    }

    dispatch({ type: 'USER_SUBSCRIBE_MERCURE_MESSAGE', retrieved });
  };
}
*/
