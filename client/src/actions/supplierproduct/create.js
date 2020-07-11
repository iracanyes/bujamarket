import React from "react";
import { SubmissionError } from 'redux-form';
import { fetch, extractHubURL, normalize, mercureSubscribe } from '../../utils/dataAccess';

export function error(error) {
  return { type: 'SUPPLIERPRODUCT_CREATE_ERROR', error };
}

export function loading(loading) {
  return { type: 'SUPPLIERPRODUCT_CREATE_LOADING', loading };
}

export function success(created) {
  return { type: 'SUPPLIERPRODUCT_CREATE_SUCCESS', created };
}

export function create(values, history, location) {
  return dispatch => {
    dispatch(loading(true));

    /* Récupération de la clé JWT et ajout au header de la requête */
    const userToken = JSON.parse(localStorage.getItem('token'));
    const headers = new Headers();
    if(userToken === null)
    {
      history.push({pathname: '../../login', state: { from : location.pathname }});
    }else{
      /* Création du header de la requête */
      headers.append('Authorization', 'Bearer ' + userToken.token);
    }
    headers.set('Accept','application/ld+json');


    return fetch('supplier_product/create', { method: 'POST', headers, body: values, mode: 'cors' })
      .then(response => {
        dispatch(loading(false));


        return response
          .json()
          .then(retrieved => ({ retrieved, hubURL: extractHubURL(response)}));
      })
      .then(({ retrieved, hubURL }) => {
        retrieved = normalize(retrieved);

        dispatch(success(retrieved));

        history.push({pathname: '../show/'+ retrieved.id });

        if(hubURL) dispatch(mercureSubscribe(hubURL, retrieved['@id']));

      })
      .catch(e => {
        dispatch(loading(false));

        switch (true) {
          case e instanceof SubmissionError:
            dispatch(error(e.errors._error));
            break;
          case e.code === 401:
            dispatch(error("Identification nécessaire avant l'ajout de produit!"));
            dispatch(error(null));
            localStorage.removeItem('token');
            history.push({ pathname: '../../login', state: { from : location.pathname }});
            break;
          case typeof e['hydra:description'] === "string":
            dispatch(error(e['hydra:description']));
            break;
          case typeof e.message === "string":
            if(e.message.includes('NetworkError'))
              dispatch(error("Serveur temporairement indisponible! Veuillez ré-essayer plus tard."))
            else
              dispatch(error(e.message));
            break;
          case typeof e === "string":
            if(e.includes('NetworkError'))
              dispatch(error("Serveur temporairement indisponible! Veuillez ré-essayer plus tard."))
            else
              dispatch(error(e));
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
  };
}
