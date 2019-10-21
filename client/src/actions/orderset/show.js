import {
  fetch,
  extractHubURL,
  normalize,
  mercureSubscribe as subscribe
} from '../../utils/dataAccess';

export function error(error) {
  return { type: 'ORDERSET_SHOW_ERROR', error };
}

export function loading(loading) {
  return { type: 'ORDERSET_SHOW_LOADING', loading };
}

export function success(retrieved) {
  return { type: 'ORDERSET_SHOW_SUCCESS', retrieved };
}

export function retrieve(id, history, location) {
  return dispatch => {
    dispatch(loading(true));

    const userToken = JSON.parse(localStorage.getItem('token'));
    let headers = new Headers();
    headers.set('Authorization', 'Bearer ' + userToken.token);

    return fetch('order_set/success', {method: 'POST', headers: headers, body: JSON.stringify({sessionId: id})})
      .then(response =>
        response
          .json()
          .then(retrieved => ({ retrieved, hubURL: extractHubURL(response) }))
      )
      .then(({ retrieved, hubURL }) => {
        retrieved = normalize(retrieved);


        if(retrieved !== null){
          dispatch(loading(false));
          dispatch(success(retrieved));

          if (hubURL) dispatch(mercureSubscribe(hubURL, retrieved['@id']));
        }

      })
      .catch(e => {
        dispatch(loading(false));
        dispatch(error(e.message));

        if( /Unauthorized/.test(e))
        {
          sessionStorage.removeItem('flash-message-error');
          sessionStorage.setItem('flash-message-error', JSON.stringify({message: "Authentification nécessaire avant de continuer!"}));
          history.push('');
          history.push({pathname: '../login', state: { from: location.pathname}});
          //window.location.reload();
        }
      });
  };
}

export function reset(eventSource) {
  return dispatch => {
    if (eventSource) eventSource.close();

    dispatch({ type: 'ORDERSET_SHOW_RESET' });
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
  return { type: 'ORDERSET_SHOW_MERCURE_OPEN', eventSource };
}

export function mercureMessage(retrieved) {
  return dispatch => {
    if (1 === Object.keys(retrieved).length) {
      dispatch({ type: 'ORDERSET_SHOW_MERCURE_DELETED', retrieved });
      return;
    }

    dispatch({ type: 'ORDERSET_SHOW_MERCURE_MESSAGE', retrieved });
  };
}
