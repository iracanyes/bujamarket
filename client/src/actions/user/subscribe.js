import { SubmissionError } from 'redux-form';
import {extractHubURL, fetch, normalize} from '../../utils/dataAccess';
import {mercureMessage, mercureOpen, mercureSubscribe} from "./show";

export function error(error) {
  return { type: 'USER_SUBSCRIBE_ERROR', error };
}

export function request(user) {
  return { type: 'USER_SUBSCRIBE_REQUEST', user  };
}

export function loading(loading) {
  return { type: 'USER_SUBSCRIBE_LOADING', loading };
}

export function success(user) {
  return { type: 'USER_SUBSCRIBE_SUCCESS', user };
}

export function successRetrieved(retrieved) {
  return { type: 'USER_SUBSCRIBE_RETRIEVE_SUCCESS', retrieved };
}

export function retrieve(token) {
  return dispatch => {
    dispatch(loading(true));

    const headers = new Headers({
      'Content-Type': 'application/json',
    });

    return fetch('/user_temp',{ method: 'POST', headers: headers, body: JSON.stringify({'token': token}) })
      .then(response =>
        response
          .json()
          .then(retrieved => ({ retrieved, hubURL: extractHubURL(response) }))
      )
      .then(({ retrieved, hubURL }) => {
        retrieved = normalize(retrieved);

        dispatch(loading(false));
        dispatch(successRetrieved(retrieved));

        if (hubURL) dispatch(mercureSubscribe(hubURL, retrieved['@id']));
      })
      .catch(e => {
        dispatch(loading(false));
        dispatch(error(e.message));
      });
  };
}


export function subscribe(values) {
  return dispatch => {
    dispatch(loading(true));
    dispatch(request(values));

    const headers = new Headers({
      'Content-Type': 'application/json',
    });

    return fetch('subscribe/'+values.token, { method: 'POST', headers: headers, body: JSON.stringify(values) })
      .then(response => {
        dispatch(loading(false));

        return response.json();
      })
      .then(retrieved => {
        dispatch(success(retrieved));
        /* Enregistrement du token dans le localStorage */
        localStorage.setItem('token', retrieved.token );

      })
      .catch(e => {
        dispatch(loading(false));


        if (e instanceof SubmissionError) {
          dispatch(error(e));
          throw e;
        }

        console.log(Error(e));

        dispatch(error(e));
        throw e;
      });
  };
}

export function reset(eventSource) {
  return dispatch => {
    if (eventSource) eventSource.close();

    dispatch({ type: 'USER_SUBSCRIBE_RESET' });
    dispatch(error(null));
    dispatch(loading(false));
  };
}


