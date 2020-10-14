import {
  fetch,
  extractHubURL,
  normalize,
  mercureSubscribe as subscribe
} from '../../utils/dataAccess';
import { success as registerSuccess } from './register';
import authHeader from "../../utils/authHeader";

export function retrieveError(retrieveError) {
  return { type: 'USER_UPDATE_RETRIEVE_ERROR', retrieveError };
}

export function retrieveLoading(retrieveLoading) {
  return { type: 'USER_UPDATE_RETRIEVE_LOADING', retrieveLoading };
}

export function retrieveSuccess(retrieved) {
  return { type: 'USER_UPDATE_RETRIEVE_SUCCESS', retrieved };
}

export function retrieve(history, location) {
  return dispatch => {
    dispatch(retrieveLoading(true));

    const headers = authHeader(history, location);

    return fetch('profile', {method: 'POST', headers})
      .then(response =>
        response
          .json()
          .then(retrieved => ({ retrieved, hubURL: extractHubURL(response) }))
      )
      .then(({ retrieved, hubURL }) => {
        retrieved = normalize(retrieved);

        dispatch(retrieveLoading(false));
        dispatch(retrieveSuccess(retrieved));

        if (hubURL) dispatch(mercureSubscribe(hubURL, retrieved['@id']));
      })
      .catch(e => {
        dispatch(retrieveLoading(false));

        if (e.code  === 401) {
          dispatch(retrieveError("Authentification nécessaire!"));
          history.push({pathname: "../../login", state: { from: location.pathname } });
        }else{

          if(typeof e === 'string')
          {
            dispatch(retrieveError(e));
          }else{
            if(e['hydra:description'])
              dispatch(retrieveError(e['hydra:description']));
            else
              dispatch(retrieveError(e))
          }
        }
        dispatch(retrieveError(null));
      });
  };
}

export function updateError(updateError) {
  return { type: 'USER_UPDATE_UPDATE_ERROR', updateError };
}

export function updateLoading(updateLoading) {
  return { type: 'USER_UPDATE_UPDATE_LOADING', updateLoading };
}

export function updateSuccess(updated) {
  return { type: 'USER_UPDATE_UPDATE_SUCCESS', updated };
}

export function update(values, history, location) {
  return dispatch => {
    dispatch(updateError(null));
    dispatch(registerSuccess(null));
    dispatch(updateLoading(true));

    const headers = new Headers();
    if(localStorage.getItem('token') !== null)
      headers.set('Authorization', 'Bearer '+ JSON.parse(localStorage.getItem('token')).token);

    return fetch('profile/update', {
      method: 'POST',
      headers: headers,
      body: values
    })
      .then(response =>
        response
          .json()
          .then(retrieved => ({ retrieved, hubURL: extractHubURL(response) }))
      )
      .then(({ retrieved, hubURL }) => {
        retrieved = normalize(retrieved);

        dispatch(updateLoading(false));
        dispatch(updateSuccess(retrieved));

        if (hubURL) dispatch(mercureSubscribe(hubURL, retrieved['@id']));
      })
      .catch(e => {
        dispatch(updateLoading(false));

        switch(true){
          case e.code  === 401:
            dispatch(updateError("Authentification nécessaire!"));
            dispatch(updateError("null"));
            history.push({pathname: "../../login", state: { from: location.pathname } });
            break;
          case typeof e['hydra:description'] === "string":
            dispatch(updateError(e['hydra:description']));
            break;
          case typeof e === 'string':
            dispatch(updateError(e));
            break;
          default:
            dispatch(updateError(e));
            break;
        }
        dispatch(updateError(null));
        history.push({pathname: '/profile/update'});
      });
  };
}

export function reset(eventSource) {
  return dispatch => {
    if (eventSource) eventSource.close();

    dispatch({ type: 'USER_UPDATE_RESET' });
    dispatch(updateError(null));
    dispatch(updateLoading(false));
    dispatch(registerSuccess(null));
  };
}

export function mercureSubscribe(hubURL, topic) {
  return dispatch => {
    const eventSource = subscribe(hubURL, [topic]);
    dispatch(mercureOpen(eventSource));
    eventSource.addEventListener('message', event =>
      dispatch(mercureMessage(normalize(JSON.parse(event.data))))
    );
  };
}

export function mercureOpen(eventSource) {
  return { type: 'USER_UPDATE_MERCURE_OPEN', eventSource };
}

export function mercureMessage(retrieved) {
  return dispatch => {
    if (1 === Object.keys(retrieved).length) {
      dispatch({ type: 'USER_UPDATE_MERCURE_DELETED', retrieved });
      return;
    }

    dispatch({ type: 'USER_UPDATE_MERCURE_MESSAGE', retrieved });
  };
}
