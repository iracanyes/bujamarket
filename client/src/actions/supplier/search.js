import {
  fetch,
  normalize,
  extractHubURL,
  mercureSubscribe as subscribe
} from '../../utils/dataAccess';

export function error(error) {
  return { type: 'SUPPLIER_SEARCH_ERROR', error };
}

export function loading(loading) {
  return { type: 'SUPPLIER_SEARCH_LOADING', loading };
}

export function success(retrieved) {
  return { type: 'SUPPLIER_SEARCH_SUCCESS', retrieved };
}

export function search(page = 'suppliers', options) {
  return dispatch => {
    dispatch(loading(true));
    dispatch(error(''));



    fetch(page, options)
      .then(response =>
        response
          .json()
          .then(retrieved => ({ retrieved, hubURL: extractHubURL(response) }))
      )
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
      });
  };
}

export function reset(eventSource) {
  return dispatch => {
    if(eventSource) eventSource.close();

    dispatch({type: "SUPPLIER_SEARCH_RESET"});
    // dispatch(deleteSuccess(null);
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
  return { type: 'SUPPLIER_SEARCH_MERCURE_OPEN', eventSource };
}

export function mercureMessage(retrieved) {
  return dispatch => {
    if (1 === Object.keys(retrieved).length) {
      dispatch({ type: 'SUPPLIER_SEARCH_MERCURE_DELETED', retrieved });
      return;
    }

    dispatch({ type: 'SUPPLIER_SEARCH_MERCURE_MESSAGE', retrieved });
  };
}
