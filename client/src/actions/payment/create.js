import { SubmissionError } from 'redux-form';
import { fetch } from '../../utils/dataAccess';
import {logout} from "../user/login";
import authHeader from "../../utils/authHeader";


export function error(error) {
  return { type: 'PAYMENT_CREATE_ERROR', error };
}

export function loading(loading) {
  return { type: 'PAYMENT_CREATE_LOADING', loading };
}

export function success(created) {
  return { type: 'PAYMENT_CREATE_SUCCESS', created };
}

export function create(values, history, location, stripe) {
  return dispatch => {
    dispatch(loading(true));

    const headers = authHeader(history, location);

    return fetch('payment/create', { method: 'POST', headers: headers, body: JSON.stringify({orderSet:values}) })
      .then(response => {
        dispatch(loading(false));

        return response.json();
      })
      .then(retrieved => {
        dispatch(success(retrieved));

        /* En cas de réussite  de la requête, on redirige le client vers la page Checkout à son identification de session  */
        stripe
          .redirectToCheckout({
            sessionId: retrieved.id
          })
          .then( result => {
            if(result.error){
              dispatch(error(result.error.message));
              dispatch(error(null));
            }

            history.push({pathname: 'validate_order', state: { from : location.pathname, params: location.state.params }});
          })
      })
      .catch(e => {
        dispatch(loading(false));

        switch (true){
          case e.code === 401:
            dispatch(error('Authentification nécessaire!'));
            dispatch(error(null));
            history.push({pathname: '../../login', state: { from: location.pathname, params: location.state.params }});
            break;
          case typeof e['hydra:description'] === "string":
          case typeof e.message === "string":
            console.log("erreur : ", e);
            dispatch(error( "Une erreur est survenue durant le processus de redirection vers la page de paiement Stripe! Contactez l'administrateur de la plateforme"));
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
