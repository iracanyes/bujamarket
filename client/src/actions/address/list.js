import {
  fetch,
  normalize,
  extractHubURL,
  mercureSubscribe as subscribe
} from '../../utils/dataAccess';
import { success as deleteSuccess } from './delete';

export function error(error) {
  return { type: 'ADDRESS_LIST_ERROR', error };
}

export function loading(loading) {
  return { type: 'ADDRESS_LIST_LOADING', loading };
}

export function success(retrieved) {
  return { type: 'ADDRESS_LIST_SUCCESS', retrieved };
}

export function list(history, prevRoute) {
  return dispatch => {
    dispatch(loading(true));
    dispatch(error(''));

    /* Ajout du JWT authentication token de l'utilisateur connecté */
    const token = localStorage.getItem('token') !== null ? JSON.parse(localStorage.getItem('token')) : null;
    const headers = new Headers();
    headers.set('Authorization', 'Bearer '+ token.token);

    fetch('my_addresses', {headers: headers})
      .then(response => {


        if (response.code === 401) {
          history.push({pathname: 'login', state: {from: window.location.pathname }});
        }

        return response
                  .json()
                  .then(retrieved => ({ retrieved, hubURL: extractHubURL(response) }))
      })
      .then(({ retrieved, hubURL }) => {
        retrieved = normalize(retrieved);

        dispatch(loading(false));
        dispatch(success(retrieved));

        if (hubURL && retrieved['hydra:member'].length)
          dispatch(
            mercureSubscribe(
              hubURL,
              retrieved['hydra:member'].map(i => i['@id'])
            )
          );
      })
      .catch(e => {
        dispatch(loading(false));
        dispatch(error(e.message));


        /* Si une authentification est requise, redirection vers la page de connexion */
        if(/Full authentication/.test(e) || /Expired JWT Token/.test(e) || /Unauthorized/.test(e))
        {
          history.push({pathname: 'login', state: {from: window.location.pathname }});
        }
      });
  };
}

export function reset(eventSource) {
  return dispatch => {
    if (eventSource) eventSource.close();

    dispatch({ type: 'ADDRESS_LIST_RESET' });
    dispatch(deleteSuccess(null));
  };
}

export function mercureSubscribe(hubURL, topics) {
  return dispatch => {
    const eventSource = subscribe(hubURL, topics);
    dispatch(mercureOpen(eventSource));
    eventSource.addEventListener('message', event =>
      dispatch(mercureMessage(normalize(JSON.parse(event.data))))
    );
  };
}

export function mercureOpen(eventSource) {
  return { type: 'ADDRESS_LIST_MERCURE_OPEN', eventSource };
}

export function mercureMessage(retrieved) {
  return dispatch => {
    if (1 === Object.keys(retrieved).length) {
      dispatch({ type: 'ADDRESS_LIST_MERCURE_DELETED', retrieved });
      return;
    }

    dispatch({ type: 'ADDRESS_LIST_MERCURE_MESSAGE', retrieved });
  };
}
