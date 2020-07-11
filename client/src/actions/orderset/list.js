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

export function list(page, history, location) {
  return dispatch => {
    dispatch(loading(true));
    dispatch(error(''));

    /* Ajout du JWT authentication token de l'utilisateur connecté */
    const headers = authHeader();

    fetch('orders'+ (page ? '/'+page : ''), {method: 'GET', headers})
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
