import { SubmissionError } from 'redux-form';
import {
  extractHubURL,
  fetch,
  normalize,
  mercureSubscribe as subscribe
} from '../../utils/dataAccess';
import {toastSuccess, toastError} from "../../layout/component/ToastMessage";

export function error(error) {
  return { type: 'USER_UNLOCK_ACCOUNT_ERROR', error };
}

export function request(user) {
  return { type: 'USER_UNLOCK_ACCOUNT_REQUEST', user  };
}

export function loading(loading) {
  return { type: 'USER_UNLOCK_ACCOUNT_LOADING', loading };
}

export function success(user) {
  return { type: 'USER_UNLOCK_ACCOUNT_SUCCESS', user };
}

export function successRetrieved(retrieved) {
  return { type: 'USER_UNLOCK_ACCOUNT_RETRIEVE_SUCCESS', retrieved };
}

export function retrieve(token) {
  return dispatch => {
    dispatch(loading(true));

    const headers = new Headers({
      'Content-Type': 'application/json',
    });

    return fetch('/locked_user',{ method: 'POST', headers: headers, body: JSON.stringify({'token': token}) })
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
        dispatch(error(e));

        toastError(e.message);
      });
  };
}


export function unlockAccount(values, history) {
  return dispatch => {
    dispatch(loading(true));
    dispatch(request(values));


    return fetch('unlock_account', { method: 'POST', body: values })
      .then(response => {
        dispatch(loading(false));

        return response.json();
      })
      .then(retrieved => {
        dispatch(success(retrieved));

        toastSuccess('Compte activé!\nAu plaisir!');
        // Redirection vers la page d'accueil
        history.push('../../login');
      })
      .catch(e => {
        dispatch(loading(false));
        dispatch(error(e));

        if (e instanceof SubmissionError) {
          dispatch(error(e));
          throw e;
        }

        toastError(e["hydra:description"]);

        history.push({pathname: '/unlock_account/' + values.get('token')});

      });
  };
}

export function reset(eventSource) {
  return dispatch => {
    if (eventSource) eventSource.close();

    dispatch({ type: 'USER_UNLOCK_ACCOUNT_RESET' });
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
  return { type: 'USER_UNLOCK_ACCOUNT_MERCURE_OPEN', eventSource };
}

export function mercureMessage(retrieved) {
  return dispatch => {
    if (1 === Object.keys(retrieved).length) {
      dispatch({ type: 'USER_UNLOCK_ACCOUNT_MERCURE_DELETED', retrieved });
      return;
    }

    dispatch({ type: 'USER_UNLOCK_ACCOUNT_MERCURE_MESSAGE', retrieved });
  };
}

