import { SubmissionError } from 'redux-form';
import {extractHubURL, fetch, normalize} from '../../utils/dataAccess';
import {logout} from "../user/login";
import {mercureSubscribe} from "./show";

export function error(error) {
  return { type: 'ORDERSET_CREATE_ERROR', error };
}

export function loading(loading) {
  return { type: 'ORDERSET_CREATE_LOADING', loading };
}

export function success(created) {
  return { type: 'ORDERSET_CREATE_SUCCESS', created };
}

export function create(values, history, locationState) {
  return dispatch => {
    dispatch(loading(true));

    let headers = new Headers();
    if(localStorage.getItem('token') !== null)
      headers.set('Authorization', 'Bearer '+ JSON.parse(localStorage.getItem('token')).token);

    return fetch('order_set/create', { method: 'POST', headers: headers, body: JSON.stringify(values) })
      .then(response =>
        response
          .json()
          .then(retrieved => ({ retrieved, hubURL: extractHubURL(response) }))
      )
      .then(({ retrieved, hubURL }) => {
        retrieved = normalize(retrieved);

        dispatch(loading(false));
        dispatch(success(retrieved));

        if (hubURL) dispatch(mercureSubscribe(hubURL, retrieved['@id']));


        /* Redirection vers la page de paiement  */
        sessionStorage.removeItem('my_order');
        sessionStorage.setItem('my_order', JSON.stringify(retrieved));
        history.push({pathname:'validate_order', state: {from: locationState ,  params : {orderSet: retrieved}}});
      })
      .catch(e => {
        dispatch(loading(false));

        switch (true){
          case e.code === 401:
            dispatch(error("Authentification nécessaire avant de poursuivre!"));
            history.push({pathname: '../../login', state: { from : locationState.from }});
            break;
          case /Unauthorized/.test(e):
            dispatch(logout());
            dispatch(error("Accès non-autorisé! Authentification obligatoire"));
            dispatch(error(null));
            history.push({pathname:'login', state: {from: locationState.from }});
            break;
          case typeof e.message === 'string':
            dispatch(error(e.message));
            break;
          case typeof e['hydra:description'] === "string":
            dispatch(error(e['hydra:description']));
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
    dispatch(success(null));
  };
}
