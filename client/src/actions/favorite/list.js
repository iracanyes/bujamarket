import {
  fetch,
  normalize,
  extractHubURL,
  mercureSubscribe as subscribe
} from '../../utils/dataAccess';
import { success as deleteSuccess } from './delete';
import authHeader from "../../utils/authHeader";

export function error(error) {
  return { type: 'FAVORITE_LIST_ERROR', error };
}

export function loading(loading) {
  return { type: 'FAVORITE_LIST_LOADING', loading };
}

export function success(retrieved) {
  return { type: 'FAVORITE_LIST_SUCCESS', retrieved };
}

export function list( page = null, history, location) {
  return dispatch => {
    dispatch(loading(true));
    dispatch(error(null));

    /* Récupération de la clé JWT et ajout au header de la requête */
    const headers = authHeader(history, location);
    let route = "my_favorites"
    if(page && typeof page === "number")
    {
      route = route + "?page=" + page;
    }

    fetch(route , {method: 'GET', headers})
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

        switch(true) {
          case e.code === 401:
            dispatch(error("Authentification nécessaire avant de poursuivre!"));
            dispatch(error(null));
            history.push({pathname: '../../login', state: {from: location.pathname}});
            break;
          case typeof e['hydra:description'] === "string":
            dispatch(error(e['hydra:description']));
            break;
          case typeof e.message === "string":
            dispatch(error(e.message));
            break;
          case typeof e === 'string':
            dispatch(error(e));
            break;
        }
        dispatch(error(null));

      });
  };
}

export function retrieveIds(history, location) {
  return dispatch => {
    dispatch(loading(true));
    dispatch(error(''));

    /* Récupération de la clé JWT et ajout au header de la requête */
    let headers = authHeader();


    fetch('favorites/ids', {method: 'GET', headers: headers})
      .then(response =>
        response
          .json()
          .then(retrieved => ({ retrieved, hubURL: extractHubURL(response) }))
      )
      .then(({ retrieved, hubURL }) => {
        retrieved = normalize(retrieved);

        dispatch(loading(false));

        // Set in favorite products in the localStorage
        if(localStorage.getItem('favorites') !== null)
        {
          localStorage.removeItem('favorites');
        }
        localStorage.setItem("favorites", JSON.stringify(retrieved.favorites));

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

    dispatch({ type: 'FAVORITE_LIST_RESET' });
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
  return { type: 'FAVORITE_LIST_MERCURE_OPEN', eventSource };
}

export function mercureMessage(retrieved) {
  return dispatch => {
    if (1 === Object.keys(retrieved).length) {
      dispatch({ type: 'FAVORITE_LIST_MERCURE_DELETED', retrieved });
      return;
    }

    dispatch({ type: 'FAVORITE_LIST_MERCURE_MESSAGE', retrieved });
  };
}
