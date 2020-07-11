import {
  fetch,
  normalize,
  extractHubURL,
  mercureSubscribe as subscribe
} from '../../utils/dataAccess';
import { success as deleteSuccess } from './delete';
import authHeader from "../../utils/authHeader";

export function error(error) {
  return { type: 'SUPPLIERPRODUCT_LIST_BY_SUPPLIER_ID_ERROR', error };
}

export function loading(loading) {
  return { type: 'SUPPLIERPRODUCT_LIST_BY_SUPPLIER_ID_LOADING', loading };
}

export function success(retrieved) {
  return { type: 'SUPPLIERPRODUCT_LIST_BY_SUPPLIER_ID_SUCCESS', retrieved };
}

export function retrieveBySupplierId(productId,history, location) {
  return dispatch => {
    dispatch(loading(true));
    dispatch(error(''));


    const headers = authHeader(history,location);

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

    dispatch({ type: 'SUPPLIERPRODUCT_LIST_BY_SUPPLIER_ID_RESET' });
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
  return { type: 'SUPPLIERPRODUCT_LIST_BY_SUPPLIER_ID_MERCURE_OPEN', eventSource };
}

export function mercureMessage(retrieved) {
  return dispatch => {
    if (1 === Object.keys(retrieved).length) {
      dispatch({ type: 'SUPPLIERPRODUCT_LIST_BY_SUPPLIER_ID_MERCURE_DELETED', retrieved });
      return;
    }

    dispatch({ type: 'SUPPLIERPRODUCT_LIST_BY_SUPPLIER_ID_MERCURE_MESSAGE', retrieved });
  };
}
