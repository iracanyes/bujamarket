import {
  fetch,
  extractHubURL,
  normalize,
  mercureSubscribe as subscribe
} from '../../utils/dataAccess';
import authHeader from "../../utils/authHeader";

export function error(error) {
  return { type: 'IMAGE_SUPPLIER_ERROR', error };
}

export function loading(loading) {
  return { type: 'IMAGE_SUPPLIER_LOADING', loading };
}

export function success(retrieved) {
  return { type: 'IMAGE_SUPPLIER_SUCCESS', retrieved };
}

export function getSupplierImage(id) {
  return dispatch => {
    dispatch(loading(true));

    const headers = authHeader();

    return fetch('/image_supplier/'+ id , { method: 'GET', headers })
      .then(response => response.body)
      .then(stream => new Response(stream))
      .then(response => response.blob())
      .then(blob => URL.createObjectURL(blob))
      .then(url => {
        dispatch(loading(false));
        dispatch(success(url));

      })
      .catch(e => {
        dispatch(loading(false));

        if(typeof e == 'string')
        {
          dispatch(error(e));
        }else{
          if(e["hydra:description"])
          {
            dispatch(error(e["hydra:description"]));
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

    dispatch({ type: 'IMAGE_SUPPLIER_RESET' });
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
  return { type: 'IMAGE_SUPPLIER_MERCURE_OPEN', eventSource };
}

export function mercureMessage(retrieved) {
  return dispatch => {
    if (1 === Object.keys(retrieved).length) {
      dispatch({ type: 'IMAGE_SUPPLIER_MERCURE_DELETED', retrieved });
      return;
    }

    dispatch({ type: 'IMAGE_SUPPLIER_MERCURE_MESSAGE', retrieved });
  };
}
