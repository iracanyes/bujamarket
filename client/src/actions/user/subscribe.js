import { SubmissionError } from 'redux-form';
import {extractHubURL, fetch, normalize} from '../../utils/dataAccess';

export function error(error) {
  return { type: 'USER_SUBSCRIBE_ERROR', error };
}

export function request(user) {
  return { type: 'USER_SUBSCRIBE_REQUEST', user  };
}

export function loading(loading) {
  return { type: 'USER_SUBSCRIBE_LOADING', loading };
}

export function success(user) {
  return { type: 'USER_SUBSCRIBE_SUCCESS', user };
}

export function successRetrieved(retrieved) {
  return { type: 'USER_SUBSCRIBE_RETRIEVE_SUCCESS', retrieved };
}

export function retrieve(token) {
  return dispatch => {
    dispatch(loading(true));

    const headers = new Headers({
      'Content-Type': 'application/json',
    });

    return fetch('/user_temp',{ method: 'POST', headers: headers, body: JSON.stringify({'token': token}) })
      .then(response =>
        response
          .json()
          .then(retrieved => ({ retrieved, hubURL: extractHubURL(response) }))
      )
      .then(({ retrieved, hubURL }) => {
        retrieved = normalize(retrieved);

        dispatch(loading(false));
        dispatch(successRetrieved(retrieved));

        if (hubURL) dispatch(mercureSubscribe(hubURL, retrieved['@id']));
      })
      .catch(e => {
        dispatch(loading(false));
        dispatch(error(e));

        if(sessionStorage.getItem('flash-message-error') !== null)
        {
          sessionStorage.removeItem('flash-message-error');
        }
        sessionStorage.setItem('flash-message-error', e);
      });
  };
}


export function subscribe(values, history) {
  return dispatch => {
    dispatch(loading(true));
    dispatch(request(values));

    const headers = new Headers({
      'Content-Type': 'application/json',
    });

    return fetch('subscribe/'+values.token, { method: 'POST', headers: headers, body: JSON.stringify(values) })
      .then(response => {
        dispatch(loading(false));

        return response.json();
      })
      .then(retrieved => {
        dispatch(success(retrieved));
        /* Enregistrement du token dans le localStorage */

        sessionStorage.removeItem("flash-message");
        sessionStorage.setItem('flash-message', JSON.stringify({message: 'Inscription terminée!\nConnectez vous à la plateforme et visitez votre profil pour ajouter les informations de livraison pour vos achats.\nAu plaisir!'}));

        /* En passant l'objet this.props.history du composant vers son action creator permet de transmettre le changement d'URL au connected-react-router  */
        history.push('login');
      })
      .catch(e => {
        dispatch(loading(false));


        if (e instanceof SubmissionError) {
          dispatch(error(e));
          throw e;
        }

        if(sessionStorage.getItem('flash-message-error') !== null)
        {
          sessionStorage.removeItem('flash-message-error');
        }
        sessionStorage.setItem('flash-message-error', e);

        dispatch(error(e));
        throw e;
      });
  };
}

export function reset(eventSource) {
  return dispatch => {
    if (eventSource) eventSource.close();

    dispatch({ type: 'USER_SUBSCRIBE_RESET' });
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
  return { type: 'USER_SUBSCRIBE_MERCURE_OPEN', eventSource };
}

export function mercureMessage(retrieved) {
  return dispatch => {
    if (1 === Object.keys(retrieved).length) {
      dispatch({ type: 'USER_SUBSCRIBE_MERCURE_DELETED', retrieved });
      return;
    }

    dispatch({ type: 'USER_SUBSCRIBE_MERCURE_MESSAGE', retrieved });
  };
}

