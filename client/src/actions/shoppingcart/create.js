import { fetch } from '../../utils/dataAccess';
import {logout} from "../user/login";
import {toastSuccess} from "../../layout/component/ToastMessage";

export function error(error) {
  return { type: 'SHOPPING_CART_CREATE_ERROR', error };
}

export function loading(loading) {
  return { type: 'SHOPPING_CART_CREATE_LOADING', loading };
}

export function success(created) {
  return { type: 'SHOPPING_CART_CREATE_SUCCESS', created };
}

export function create(values, history, locationState) {
  return dispatch => {
    dispatch(loading(true));

    let headers = new Headers();
    if(localStorage.getItem('token') !== null)
    {
      headers.set('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('token')).token);
    }


    return fetch('shopping_cart/create', { method: 'POST', body: JSON.stringify(values), headers: headers })
      .then(response => {
        dispatch(loading(false));

        return response.json();
      })
      .then(retrieved => {
        dispatch(success(retrieved));

        /* Redirection vers la page des informations de livraison */
        toastSuccess('Panier de commande sauvegardé!');
        history.push('/delivery_address');


      })
      .catch(e => {
        dispatch(loading(false));

        switch(true){
          case e.code === 401:
            dispatch(logout());
            history.push({pathname:'login', state: locationState });
            break;
          case /Unauthorized/.test(e.message):
            dispatch(logout());
            history.push({pathname:'login', state: locationState });
            break;
          case typeof e['hydra:description'] === "string":
            dispatch(error(e['hydra:description']));
            break;
          case typeof e.message === "string":
            dispatch(error(e.message));
            break;
          default:
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
