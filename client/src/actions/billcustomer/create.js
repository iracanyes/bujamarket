import { SubmissionError } from 'redux-form';
import { fetch } from '../../utils/dataAccess';
import {logout} from "../user/login";


export function error(error) {
  return { type: 'BILL_CUSTOMER_CREATE_ERROR', error };
}

export function loading(loading) {
  return { type: 'BILL_CUSTOMER_CREATE_LOADING', loading };
}

export function success(created) {
  return { type: 'BILL_CUSTOMER_CREATE_SUCCESS', created };
}

export function create(values, history, location, stripe) {
  return dispatch => {
    dispatch(loading(true));

    const userToken = JSON.parse(localStorage.getItem('token'));
    let headers = new Headers();
    headers.set('Authorization', 'Bearer ' + userToken.token);

    /*  */
    const user = JSON.parse(atob(userToken.token.split('.')[1]));


    return fetch('bill_customer/create', { method: 'POST', headers: headers, body: JSON.stringify(values) })
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
            sessionStorage.removeItem('flash-message-error');
            sessionStorage.getItem('flash-message-error', JSON.stringify({message: result.error.message }));
            history.push({pathname: 'validate_order', state: { from : location.pathname, params: location.state.params }});
          })



      })
      .catch(e => {
        dispatch(loading(false));

        if (e instanceof SubmissionError) {
          dispatch(error(e.errors._error));
          throw e;
        }

        if( /Unauthorized/.test(e))
        {
          sessionStorage.removeItem('flash-message-error');
          sessionStorage.setItem('flash-message-error', JSON.stringify({message: "Authentification nécessaire avant de continuer!"}));
          history.push({pathname: 'login', state: { from: location.pathname, params: location.state.params }});
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
