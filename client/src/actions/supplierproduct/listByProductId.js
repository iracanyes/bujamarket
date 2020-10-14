import {
  fetch,
  normalize,
  extractHubURL,
  mercureSubscribe as subscribe
} from '../../utils/dataAccess';
import { success as deleteSuccess } from './delete';
import {toast} from "react-toastify";
import {ToastError} from "../../layout/ToastMessage";
import React from "react";

export function error(error) {
  return { type: 'SUPPLIERPRODUCT_LIST_BY_PROD_ID_ERROR', error };
}

export function loading(loading) {
  return { type: 'SUPPLIERPRODUCT_LIST_BY_PROD_ID_LOADING', loading };
}

export function success(retrieved) {
  return { type: 'SUPPLIERPRODUCT_LIST_BY_PROD_ID_SUCCESS', retrieved };
}

export function retrieveByProductId(productId) {
  return dispatch => {
    dispatch(loading(true));
    dispatch(error(null));

    fetch('/products/'+productId+'/all_suppliers')
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

        toast(
          <ToastError message={"Impossible de trouver les offres associées à ce produit !"} />,
          { type: "default" }
        );
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
