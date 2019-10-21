import {
  fetch,
  normalize,
  extractHubURL,
  mercureSubscribe as subscribe
} from '../../utils/dataAccess';
import { success as deleteSuccess } from './delete';

export function error(error) {
  return { type: 'SUPPLIERPRODUCT_LIST_BY_PROD_ID_ERROR', error };
}

export function loading(loading) {
  return { type: 'SUPPLIERPRODUCT_LIST_BY_PROD_ID_LOADING', loading };
}

export function success(retrieved) {
  return { type: 'SUPPLIERPRODUCT_LIST_BY_PROD_ID_SUCCESS', retrieved };
}

export function retrieveBySupplierId(productId) {
  return dispatch => {
    dispatch(loading(true));
    dispatch(error(''));

    const userToken = JSON.parse(localStorage.getItem('token'));
    let headers = new Headers();
    headers.set('Authorization', 'Bearer ' + userToken.token);

    fetch('/supplier/'+productId+'/supplier_products', {method: 'GET', headers: headers})
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
    if (eventSource) eventSource.close();

    dispatch({ type: 'SUPPLIERPRODUCT_LIST_BY_PROD_ID_RESET' });
    dispatch(deleteSuccess(null));
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
  return { type: 'SUPPLIERPRODUCT_LIST_BY_PROD_ID_MERCURE_OPEN', eventSource };
}

export function mercureMessage(retrieved) {
  return dispatch => {
    if (1 === Object.keys(retrieved).length) {
      dispatch({ type: 'SUPPLIERPRODUCT_LIST_BY_PROD_ID_MERCURE_DELETED', retrieved });
      return;
    }

    dispatch({ type: 'SUPPLIERPRODUCT_LIST_BY_PROD_ID_MERCURE_MESSAGE', retrieved });
  };
}
