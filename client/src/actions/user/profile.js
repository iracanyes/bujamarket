import {
  fetch,
  extractHubURL,
  normalize,
  mercureSubscribe as subscribe
} from '../../utils/dataAccess';
import { toastError } from "../../layout/component/ToastMessage";

export function error(error) {
  return { type: 'USER_PROFILE_ERROR', error };
}

export function loading(loading) {
  return { type: 'USER_PROFILE_LOADING', loading };
}

export function success(retrieved) {
  return { type: 'USER_PROFILE_SUCCESS', retrieved };
}

export function getProfile(history, location) {
  return dispatch => {
    dispatch(loading(true));

    const headers = new Headers();
    if(localStorage.getItem('token') !== null){
      headers.set('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('token')).token );
    }else{
      toastError("Authentification nécessaire!");
      history.push({pathname: 'login', state: { from: location.pathname }});
    }


    return fetch("/profile", { method: 'POST', headers })
      .then(response =>
        response
          .json()
          .then(retrieved => ({ retrieved, hubURL: extractHubURL(response) }))
      )
      .then(({ retrieved, hubURL }) => {
        retrieved = normalize(retrieved);

        dispatch(loading(false));
        dispatch(success(retrieved));

        if (hubURL) dispatch(mercureSubscribe(hubURL, retrieved['@id']));
      })
      .catch(e => {
        dispatch(loading(false));

        switch(true){
          case e.code === 401:
            toastError('Authentification nécessaire!');
            history.push({pathname: '/login', state: {from: location.pathname}});
            break;
          case typeof e === 'string':
            dispatch(error(e));
            break;
          case typeof e["hydra:description"] === "string":
            dispatch(error(e["hydra:description"]));
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

export function reset(eventSource) {
  return dispatch => {
    if (eventSource) eventSource.close();

    dispatch({ type: 'USER_PROFILE_RESET' });
    dispatch(error(null));
    dispatch(loading(false));
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
  return { type: 'USER_PROFILE_MERCURE_OPEN', eventSource };
}

export function mercureMessage(retrieved) {
  return dispatch => {
    if (1 === Object.keys(retrieved).length) {
      dispatch({ type: 'USER_PROFILE_MERCURE_DELETED', retrieved });
      return;
    }

    dispatch({ type: 'USER_PROFILE_MERCURE_MESSAGE', retrieved });
  };
}
