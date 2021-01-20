import { fetch } from '../../utils/dataAccess';
import {toastError} from "../../layout/component/ToastMessage";

export function error(error) {
  return { type: 'BANKACCOUNT_DELETE_ERROR', error };
}

export function loading(loading) {
  return { type: 'BANKACCOUNT_DELETE_LOADING', loading };
}

export function success(deleted) {
  return { type: 'BANKACCOUNT_DELETE_SUCCESS', deleted };
}

export function del(item, history, location) {
  return dispatch => {
    dispatch(loading(true));

    const headers= new Headers();
    if(localStorage.getItem('token') !== null){
      headers.set('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('token')).token );
    }else{
      toastError("Authentification nécessaire!");
      history.push({pathname: 'login'});
    }

    return fetch("bank_account/delete", { method: 'POST', headers, body: JSON.stringify(item) })
      .then(() => {
        dispatch(loading(false));
        dispatch(success(item));
      })
      .catch(e => {
        dispatch(loading(false));

        switch (true){
          case typeof e.message === "string":
            dispatch(error(e.message));
            break;
          case typeof e['hydra:description'] === "string":
            dispatch(error(e['hydra:description']));
            break;
          default:
            dispatch(error(e));
            break;
        }
        dispatch(error(null));
      });
  };
}
