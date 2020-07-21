import { fetch } from '../../utils/dataAccess';
import authHeader from "../../utils/authHeader";

export function error(error) {
  return { type: 'USER_UNSUBSCRIBE_ERROR', error };
}

export function loading(loading) {
  return { type: 'USER_UNSUBSCRIBE_LOADING', loading };
}

export function unsubscribed(unsubscribed) {
  return { type: 'USER_UNSUBSCRIBE_SUCCESS', unsubscribed };
}

export function unsubscribe(history, location) {
  return dispatch => {
    dispatch(loading(true));

    const headers = authHeader(history, location);
    const user = localStorage.getItem('token') ? JSON.parse(atob(localStorage.getItem('token').split('.')[1])) : null;

    return fetch('/unsubscribe', { method: 'POST', headers, body: user !== null ? JSON.stringify(user) : '' })
      .then(() => {
        dispatch(loading(false));
        localStorage.removeItem('token');
        dispatch(unsubscribed(true));

        history.push('/');


      })
      .catch(e => {
        dispatch(loading(false));

        switch (true) {
          case e.code === 401:
            dispatch(error('Authentification nécessaire!'));
            dispatch(error(null))
            history.push({ pathname: '../login', state: { from: location.pathname }});
            break;
          case typeof e['hydra:description'] === 'string':
            dispatch(error(e['hydra:description']));
            break;
          case typeof e.message === 'string':
            dispatch(error(e.message));
            break;
          case typeof e === 'string':
            dispatch(error(e));
            break;
        }
        dispatch(error(null));
      });
  };
}
