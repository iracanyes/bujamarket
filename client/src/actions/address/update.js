import { SubmissionError } from 'redux-form';
import {
  fetch,
  extractHubURL,
  normalize,
  mercureSubscribe as subscribe
} from '../../utils/dataAccess';
import { success as createSuccess } from './create';
import { loading, error } from './delete';
import authHeader from "../../utils/authHeader";
export function retrieveError(retrieveError) {
  return { type: 'ADDRESS_UPDATE_RETRIEVE_ERROR', retrieveError };
}

export function retrieveLoading(retrieveLoading) {
  return { type: 'ADDRESS_UPDATE_RETRIEVE_LOADING', retrieveLoading };
}

export function retrieveSuccess(retrieved) {
  return { type: 'ADDRESS_UPDATE_RETRIEVE_SUCCESS', retrieved };
}

export function retrieve(id) {
  return dispatch => {
    dispatch(retrieveLoading(true));

    return fetch(id)
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
        dispatch(retrieveError(e.message));
      });
  };
}

export function updateError(updateError) {
  return { type: 'ADDRESS_UPDATE_UPDATE_ERROR', updateError };
}

export function updateLoading(updateLoading) {
  return { type: 'ADDRESS_UPDATE_UPDATE_LOADING', updateLoading };
}

export function updateSuccess(updated) {
  return { type: 'ADDRESS_UPDATE_UPDATE_SUCCESS', updated };
}

export function update(item, values, history, location) {
  return dispatch => {
    dispatch(updateError(null));
    dispatch(createSuccess(null));
    dispatch(updateLoading(true));

    /* Ajout du JWT authentication token de l'utilisateur connecté */
    const headers = authHeader(history, location);

    return fetch('/address/' + item.id, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(values)
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

        if (e instanceof SubmissionError) {
          dispatch(updateError(e.errors._error['hydra:description']));
        }

        switch (true){
          case e.code === 401:
            dispatch(updateError("Authentification nécessaire avant de poursuivre!"));
            history.push({pathname: '../../login', state: { from : location.pathname }});
            break;
          case typeof e['hydra:description'] === "string" && /Not found/.test(e['hydra:description']):
            dispatch(updateError(e['hydra:description']));
            break;
          case typeof e['hydra:description'] === "string":
            dispatch(updateError(e['hydra:description']));
            break;
          case typeof e.message === "string":
            dispatch(updateError(e.message));
            break;
          default:
            dispatch(updateError(e));
            break;

        }

        dispatch(updateError(null));
      });
  };
}

export function reset(eventSource) {
  return dispatch => {
    if (eventSource) eventSource.close();

    dispatch({ type: 'ADDRESS_UPDATE_RESET' });
    dispatch(error(null));
    dispatch(loading(false));
    dispatch(createSuccess(null));
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
  return { type: 'ADDRESS_UPDATE_MERCURE_OPEN', eventSource };
}

export function mercureMessage(retrieved) {
  return dispatch => {
    if (1 === Object.keys(retrieved).length) {
      dispatch({ type: 'ADDRESS_UPDATE_MERCURE_DELETED', retrieved });
      return;
    }

    dispatch({ type: 'ADDRESS_UPDATE_MERCURE_MESSAGE', retrieved });
  };
}
