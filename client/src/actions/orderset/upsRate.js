import {extractHubURL, fetch, normalize} from '../../utils/dataAccess';
import {logout} from "../user/login";
import {mercureSubscribe} from "./show";
import authHeader from "../../utils/authHeader";

export function error(error) {
  return { type: 'ORDERSET_UPS_RATE_ERROR', error };
}

export function loading(loading) {
  return { type: 'ORDERSET_UPS_RATE_LOADING', loading };
}

export function success(created) {
  return { type: 'ORDERSET_UPS_RATE_SUCCESS', created };
}

export function upsRate(address, history, location) {
  return dispatch => {
    dispatch(loading(true));

    const headers = authHeader(history, location);

    return fetch('order_set/rate/ups', { method: 'POST', headers, body: JSON.stringify(address)})
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
          case e.code === 401:
            dispatch(logout());
            dispatch(error("Authentification nécessaire avant de poursuivre!"));
            dispatch(error(null));
            history.push({pathname: '../../login', state: { from : location.pathname }});
            break;
          case /Unauthorized/.test(e):
            dispatch(logout());
            dispatch(error("Accès non-autorisé! Authentification obligatoire"));
            dispatch(error(null));
            history.push({pathname:'login', state: {from: location.pathname }});
            break;
          case typeof e.message === 'string':
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

export function reset() {
  return dispatch => {
    dispatch(loading(false));
    dispatch(error(null));
    dispatch(success(null));
  };
}
