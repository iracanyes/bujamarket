import { SubmissionError } from 'redux-form';
import {
  fetch,
  extractHubURL,
  normalize,
  mercureSubscribe as subscribe
} from '../../utils/dataAccess';
import { success as createSuccess } from './create';
import authHeader from "../../utils/authHeader";

export function retrieveError(retrieveError) {
  return { type: 'SUPPLIERPRODUCT_UPDATE_RETRIEVE_ERROR', retrieveError };
}

export function retrieveLoading(retrieveLoading) {
  return { type: 'SUPPLIERPRODUCT_UPDATE_RETRIEVE_LOADING', retrieveLoading };
}

export function retrieveSuccess(retrieved) {
  return { type: 'SUPPLIERPRODUCT_UPDATE_RETRIEVE_SUCCESS', retrieved };
}

export function retrieve(id) {
  return dispatch => {
    dispatch(retrieveLoading(true));

    return fetch('supplier_product/'+id)
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

        switch (true) {
          case typeof e === "string":
            dispatch(retrieveError(e));
            break;
          case typeof e['hydra:description'] === "string":
            dispatch(retrieveError(e['hydra:description']));
            break;
          case typeof e.message === "string":
            dispatch(retrieveError(e.message));
            break;
          default:
            dispatch(retrieveError(e));
            break;
        }
        dispatch(retrieveError(null));
      });
  };
}

export function updateError(updateError) {
  return { type: 'SUPPLIERPRODUCT_UPDATE_UPDATE_ERROR', updateError };
}

export function updateLoading(updateLoading) {
  return { type: 'SUPPLIERPRODUCT_UPDATE_UPDATE_LOADING', updateLoading };
}

export function updateSuccess(updated) {
  return { type: 'SUPPLIERPRODUCT_UPDATE_UPDATE_SUCCESS', updated };
}

export function update(item, values, history, location) {
  return dispatch => {
    dispatch(updateError(null));
    dispatch(createSuccess(null));
    dispatch(updateLoading(true));

    const headers = authHeader(history, location);

    return fetch("supplier_product/update/" + item['id'], {
      method: 'POST',
      headers,
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

        if (e instanceof SubmissionError) {
          dispatch(updateError(e.errors._error));
        }

        switch (true) {
          case e.code === 401:
            dispatch(updateError("Authentification nécessaire avant de supprimer l'image!"));
            dispatch(updateError(null));
            history.push({ pathname: '../../login', state: { from: location.pathname }});
            break;
          case typeof e === "string":
            dispatch(updateError(e));
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

    dispatch({ type: 'SUPPLIERPRODUCT_UPDATE_RESET' });
    dispatch(updateError(null));
    dispatch(updateLoading(false));
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
  return { type: 'SUPPLIERPRODUCT_UPDATE_MERCURE_OPEN', eventSource };
}

export function mercureMessage(retrieved) {
  return dispatch => {
    if (1 === Object.keys(retrieved).length) {
      dispatch({ type: 'SUPPLIERPRODUCT_UPDATE_MERCURE_DELETED', retrieved });
      return;
    }

    dispatch({ type: 'SUPPLIERPRODUCT_UPDATE_MERCURE_MESSAGE', retrieved });
  };
}
