import { SubmissionError } from 'redux-form';
import { fetch } from '../../utils/dataAccess';
import {toastSuccess} from "../../layout/ToastMessage";

export function error(error) {
  return { type: 'BANKACCOUNT_CREATE_ERROR', error };
}

export function loading(loading) {
  return { type: 'BANKACCOUNT_CREATE_LOADING', loading };
}

export function success(created) {
  return { type: 'BANKACCOUNT_CREATE_SUCCESS', created };
}


export function create(values, history, location) {
  return dispatch => {
    dispatch(loading(true));

    let headers = new Headers();
    localStorage.getItem('token') !== null && headers.set('Authorization', "Bearer " + JSON.parse(localStorage.getItem('token')).token);

    return fetch('bank_account/create', { method: 'POST', headers,  body: JSON.stringify(values) })
      .then(response => {
        dispatch(loading(false));

        return response.json();
      })
      .then(retrieved => {
        dispatch(success(retrieved));

        if(retrieved) {
          toastSuccess("Moyen de paiement ajouté avec succès!");
          history.push('../../profile');
        }
      })
      .catch(e => {
        dispatch(loading(false));

        switch(true){
          case e.code === 401:
            dispatch(error('Authentification nécessaire!'));
            history.push('/login', { state: {from: location.pathname, params: values.id_card }});
            break;
          case typeof e.message === "string" :
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
  };
}
