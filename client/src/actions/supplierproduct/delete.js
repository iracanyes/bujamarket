import { fetch } from '../../utils/dataAccess';
import authHeader from "../../utils/authHeader";

export function error(error) {
  return { type: 'SUPPLIERPRODUCT_DELETE_ERROR', error };
}

export function loading(loading) {
  return { type: 'SUPPLIERPRODUCT_DELETE_LOADING', loading };
}

export function success(deleted) {
  return { type: 'SUPPLIERPRODUCT_DELETE_SUCCESS', deleted };
}

export function del(item, history, location) {
  return dispatch => {
    dispatch(loading(true));

    const headers = authHeader(history, location);

    return fetch(item['@id'], { method: 'DELETE', headers })
      .then(() => {
        dispatch(loading(false));
        dispatch(success(item));
        history.push('.');
      })
      .catch(e => {
        dispatch(loading(false));

        switch (true) {
          case e.code === 401:
            dispatch(error("Authentification nécessaire avant tout suppression de produit"))
            dispatch(error(null));
            history.push({ pathname: '../../login', state: { from: location.pathname }});

            break;
          case typeof e === "string":
            dispatch(error(e));
            break;
          case typeof e["hydra:description"] === "string":
            dispatch(error(e["hydra:description"]));
            break;
          case typeof e.message === "string":
            dispatch(error(e.message));
            break;
        }

        dispatch(error(null));
      });
  };
}
