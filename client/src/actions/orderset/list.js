import {
  fetch,
  normalize,
  extractHubURL,
  mercureSubscribe as subscribe
} from '../../utils/dataAccess';
import { success as deleteSuccess } from './delete';
import authHeader from "../../utils/authHeader";

export function error(error) {
  return { type: 'ORDERSET_LIST_ERROR', error };
}

export function loading(loading) {
  return { type: 'ORDERSET_LIST_LOADING', loading };
}

export function success(retrieved) {
  return { type: 'ORDERSET_LIST_SUCCESS', retrieved };
}

export function list(page = null, history, location) {
  return dispatch => {
    dispatch(loading(true));

    /* Ajout du JWT authentication token de l'utilisateur connecté */
    const headers = authHeader(history, location);

    fetch('my_orders' + (page ? ('/'+ page) : ''), {method: 'GET', headers})
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

        switch (true){
          case e.code === 401:
            dispatch(error("Authentification nécessaire avant de poursuivre!"));
            dispatch(error(null));
            history.push({pathname: '../../login', state: { from : location.pathname }});
            break;
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

    dispatch({ type: 'ORDERSET_LIST_RESET' });
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
  return { type: 'ORDERSET_LIST_MERCURE_OPEN', eventSource };
}

export function mercureMessage(retrieved) {
  return dispatch => {
    if (1 === Object.keys(retrieved).length) {
      dispatch({ type: 'ORDERSET_LIST_MERCURE_DELETED', retrieved });
      return;
    }

    dispatch({ type: 'ORDERSET_LIST_MERCURE_MESSAGE', retrieved });
  };
}
