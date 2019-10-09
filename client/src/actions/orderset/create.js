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

        console.log('retrieved', retrieved);
        /* Redirection vers la page de paiement  */
        sessionStorage.removeItem('my_order');
        sessionStorage.setItem('my_order', JSON.stringify(retrieved));
        history.push({pathname:'validate_order', state: {from: locationState ,  params : {orderSet: retrieved}}});
      })
      .catch(e => {
        dispatch(loading(false));

        if (e instanceof SubmissionError) {
          dispatch(error(e.errors._error));
          throw e;
        }

        if(/Unauthorized/.test(e))
        {
          dispatch(logout());
          sessionStorage.removeItem('flash-message-error');
          sessionStorage.setItem("flash-message-error", JSON.stringify({ message: "Accés non-autorisé! Identifiez-vous."}));
          history.push({pathname:'login', state: {from: locationState.from }});
        }

        dispatch(error(e.message));
      });
  };
}

export function reset() {
  return dispatch => {
    dispatch(loading(false));
    dispatch(error(null));
  };
}
