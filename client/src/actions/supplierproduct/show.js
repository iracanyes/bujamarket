import {
  fetch,
  extractHubURL,
  normalize,
  mercureSubscribe as subscribe
} from '../../utils/dataAccess';

export function error(error) {
  return { type: 'SUPPLIERPRODUCT_SHOW_ERROR', error };
}

export function loading(loading) {
  return { type: 'SUPPLIERPRODUCT_SHOW_LOADING', loading };
}

export function success(retrieved) {
  return { type: 'SUPPLIERPRODUCT_SHOW_SUCCESS', retrieved };
}

export function retrieve(id, history, location) {
  return dispatch => {
    dispatch(loading(true));

    return fetch('supplier_product/' + id)
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

        if(e.code === 401)
        {
          dispatch(error("Authentification nécessaire avant de poursuivre!"));
          history.push({pathname: '../../login', state: { from : location.pathname }});
        }

        if(typeof e === 'string')
        {
          dispatch(error(e));
        }else{
          if(e['hydra:description'])
          {
            dispatch(error(e['hydra:description']));
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

    dispatch({ type: 'SUPPLIERPRODUCT_SHOW_RESET' });
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
  return { type: 'SUPPLIERPRODUCT_SHOW_MERCURE_OPEN', eventSource };
}

export function mercureMessage(retrieved) {
  return dispatch => {
    if (1 === Object.keys(retrieved).length) {
      dispatch({ type: 'SUPPLIERPRODUCT_SHOW_MERCURE_DELETED', retrieved });
      return;
    }

    dispatch({ type: 'SUPPLIERPRODUCT_SHOW_MERCURE_MESSAGE', retrieved });
  };
}
