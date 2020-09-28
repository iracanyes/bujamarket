import { SubmissionError } from 'redux-form';
import { fetch } from '../../utils/dataAccess';

export function error(error) {
  return { type: 'BANKACCOUNT_CREATE_CLIENT_SECRET_ERROR', error };
}

export function loading(loading) {
  return { type: 'BANKACCOUNT_CREATE_CLIENT_SECRET_LOADING', loading };
}

export function success(retrieved) {
  return { type: 'BANKACCOUNT_CREATE_CLIENT_SECRET_SUCCESS', retrieved };
}

export function getClientSecret(history, location){
  return dispatch => {
    dispatch(loading(true));

    let headers = new Headers();
    localStorage.getItem('token') !== null && headers.set('Authorization', "Bearer " + JSON.parse(localStorage.getItem('token')).token);

    return fetch('bank_account/client_secret', { method: 'GET', headers })
      .then(response => {
        dispatch(loading(false));

        return response.json();
      })
      .then(retrieved => {
        dispatch(success(retrieved));
      })
      .catch(e => {
        dispatch(loading(false));

        switch(true){
          case e.code === 401:
            dispatch(error('Authentification nécessaire!'));
            history.push('/login', { state: {from: location.pathname }});
            break;
          case typeof e.message === "string" :
            dispatch(error(e.message));
            break;
          case typeof e['hydra:description'] === "string":
            dispatch(error(e['hydra:description']));
            break;

        }
        dispatch(error(null));
      })
  };
}


export function reset() {
  return dispatch => {
    dispatch(loading(false));
    dispatch(error(null));
  };
}
