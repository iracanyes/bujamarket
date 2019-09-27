import { SubmissionError } from 'redux-form';
import { fetch } from '../../utils/dataAccess';
import {logout} from "../user/login";

export function error(error) {
  return { type: 'ADDRESS_CREATE_ERROR', error };
}

export function loading(loading) {
  return { type: 'ADDRESS_CREATE_LOADING', loading };
}

export function success(created) {
  return { type: 'ADDRESS_CREATE_SUCCESS', created };
}

export function create(values, history) {
  return dispatch => {
    dispatch(loading(true));

    let headers = new Headers();
    if(localStorage.getItem('token') !== null)
    {
      headers.set('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('token')).token);
    }


    return fetch('shopping_card/create', { method: 'POST', body: JSON.stringify(values), headers: headers })
      .then(response => {
        dispatch(loading(false));

        return response.json();
      })
      .then(retrieved => {



        dispatch(success(retrieved));

        /* Redirection vers la page des informations de livraison */
        history.push('/delivery_address');


      })
      .catch(e => {
        dispatch(loading(false));

        console.log("Shopping card - create error",e.message);

        if (e instanceof SubmissionError) {
          dispatch(error(e.errors._error));
          throw e;
        }

        if(/Unauthorized/.test(e.message))
        {
          dispatch(logout());
          history.push('login');
          sessionStorage.removeItem('flash-message-error');
          sessionStorage.setItem('flash-message-error', JSON.stringify({message: "Rappel: Seul les clients de la plateforme peuvent effectuer des achats.\nUne re-connexion est nécessaire."}));
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
