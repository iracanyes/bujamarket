import {
  fetch,
  extractHubURL,
  normalize,
  mercureSubscribe as subscribe
} from '../../utils/dataAccess';

export function error(error) {
  return { type: 'PRODUCT_SHOW_ERROR', error };
}

export function loading(loading) {
  return { type: 'PRODUCT_SHOW_LOADING', loading };
}

export function success(retrieved) {
  return { type: 'PRODUCT_SHOW_SUCCESS', retrieved };
}

export function retrieve(id) {
  return dispatch => {
    dispatch(loading(true));

    return fetch('/product/'+id)
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


        switch (true){
          case typeof e.message === "string":
            dispatch(error(e.message));
            break;
          case typeof e['hydra:description'] === "string":
            dispatch(error(e['hydra:description']));
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

    dispatch({ type: 'PRODUCT_SHOW_RESET' });
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
  return { type: 'PRODUCT_SHOW_MERCURE_OPEN', eventSource };
}

export function mercureMessage(retrieved) {
  return dispatch => {
    if (1 === Object.keys(retrieved).length) {
      dispatch({ type: 'PRODUCT_SHOW_MERCURE_DELETED', retrieved });
      return;
    }

    dispatch({ type: 'PRODUCT_SHOW_MERCURE_MESSAGE', retrieved });
  };
}
