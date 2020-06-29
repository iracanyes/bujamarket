import {
  fetch,
  normalize,
  extractHubURL,
  mercureSubscribe as subscribe
} from '../../utils/dataAccess';
import { success as deleteSuccess } from './delete';

export function error(error) {
  return { type: 'ADDRESS_PROFILE_ERROR', error };
}

export function loading(loading) {
  return { type: 'ADDRESS_PROFILE_LOADING', loading };
}

export function success(retrieved) {
  return { type: 'ADDRESS_PROFILE_SUCCESS', retrieved };
}

export function getProfileAddresses(history, location) {
  return dispatch => {
    dispatch(loading(true));
    dispatch(error(''));

    /* Ajout du JWT authentication token de l'utilisateur connecté */
    const token = localStorage.getItem('token') !== null ? JSON.parse(localStorage.getItem('token')) : null;
    const headers = new Headers();
    token && headers.set('Authorization', 'Bearer '+ token.token);

    fetch('my_addresses', {headers: headers})
      .then(response => {
        console.log(response);

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

        console.log(e);

        /* Si une authentification est requise, redirection vers la page de connexion */
        if(e.code === 401)
        {
          history.push({pathname: '../../login', state: {from: location.pathname }});
        }

        if(typeof e === 'string')
        {
          dispatch(error(e));
        }else{
          if(e['hydra:description'])
          {
            dispatch(error(e['hydra:title']));
          }else{
            dispatch(error(e.message));

          }
        }
        dispatch(error(null));
      });
  };
}

export function reset(eventSource) {
  return dispatch => {
    if (eventSource) eventSource.close();

    dispatch({ type: 'ADDRESS_PROFILE_RESET' });
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
  return { type: 'ADDRESS_PROFILE_MERCURE_OPEN', eventSource };
}

export function mercureMessage(retrieved) {
  return dispatch => {
    if (1 === Object.keys(retrieved).length) {
      dispatch({ type: 'ADDRESS_PROFILE_MERCURE_DELETED', retrieved });
      return;
    }

    dispatch({ type: 'ADDRESS_PROFILE_MERCURE_MESSAGE', retrieved });
  };
}
