import {
  fetch,
  normalize,
  extractHubURL,
  mercureSubscribe as subscribe
} from '../../utils/dataAccess';
import { success as deleteSuccess } from './delete';

export function error(error) {
  return { type: 'FAVORITE_LIST_ERROR', error };
}

export function loading(loading) {
  return { type: 'FAVORITE_LIST_LOADING', loading };
}

export function success(retrieved) {
  return { type: 'FAVORITE_LIST_SUCCESS', retrieved };
}

export function list(page = 'my_favorites', history) {
  return dispatch => {
    dispatch(loading(true));
    dispatch(error(''));

    /* Récupération de la clé JWT et ajout au header de la requête */
    const userToken = JSON.parse(localStorage.getItem('token'));
    let headers = new Headers();
    if(userToken === null)
    {
      history.push({pathname: '../../login', state: { from : window.location.pathname }});
    }else{
      /* Création du header de la requête */
      headers.set('Authorization', 'Bearer ' + userToken.token);

    }

    fetch(page, {method: 'GET', headers: headers})
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

        if(/Access Denied/.test(e.message))
        {
          if(sessionStorage.getItem('flash-message-error') !== null)
          {
            sessionStorage.removeItem('flash-message-error');
          }
          sessionStorage.setItem('flash-message-error', JSON.stringify({message: "Accès refusé!"}));
          history.push({pathname: '../../', state: {from : window.location.pathname}});
        }

        if(/Unauthorized/.test(e.message))
        {
          if(sessionStorage.getItem('flash-message-error') !== null)
          {
            sessionStorage.removeItem('flash-message-error');
          }
          sessionStorage.setItem('flash-message-error', JSON.stringify({message: "Connexion nécessaire!"}));
          history.push({ pathname: '../../login', state: { from: window.location.pathname }})
        }
      });
  };
}

export function retrieveIds(history) {
  return dispatch => {
    dispatch(loading(true));
    dispatch(error(''));

    /* Récupération de la clé JWT et ajout au header de la requête */
    const userToken = JSON.parse(localStorage.getItem('token'));

    /* Ajout du header */
    let headers = new Headers();
    if(userToken !== null)
    {

      headers.set('Authorization', 'Bearer ' + userToken.token);
    }else{
      history.push({pathname:"../../login", state: { from: window.location.pathname }})
    }


    fetch('favorites/ids', {method: 'GET', headers: headers})
      .then(response =>
        response
          .json()
          .then(retrieved => ({ retrieved, hubURL: extractHubURL(response) }))
      )
      .then(({ retrieved, hubURL }) => {
        retrieved = normalize(retrieved);

        dispatch(loading(false));


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
        dispatch(error(e.message));

        if( /Unauthorized/.test(e))
        {
          /* Création du message d'avertissement */
          sessionStorage.removeItem('flash-message-error');
          sessionStorage.setItem('flash-message-error', JSON.stringify({message: "Authentification nécessaire avant de continuer!"}));
          /* Suppression du token de sécurité actuel  */
          localStorage.removeItem("token");
          /* Redirection vers la page de connexion */
          history.push({pathname: '../../login', state: { from: window.location.pathname}});
        }

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
