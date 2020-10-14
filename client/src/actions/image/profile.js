import {
  fetch,
  normalize,
  mercureSubscribe as subscribe
} from '../../utils/dataAccess';

export function error(error) {
  return { type: 'IMAGE_PROFILE_ERROR', error };
}

export function loading(loading) {
  return { type: 'IMAGE_PROFILE_LOADING', loading };
}

export function success(retrieved) {
  return { type: 'IMAGE_PROFILE_SUCCESS', retrieved };
}

export function getProfileImage(history, location) {
  return dispatch => {
    dispatch(loading(true));

    const headers = new Headers();
    if(localStorage.getItem('token') !== null)
      headers.set('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('token')).token);

    return fetch('/image_profile' , { method: 'GET', headers })
      .then(response => response.body)
      .then(stream => new Response(stream))
      .then(response => response.blob())
      .then(blob => URL.createObjectURL(blob))
      .then(url => {
        dispatch(loading(false));
        dispatch(success(url));

      })
      .catch(e => {
        dispatch(loading(false));

        switch(true){
          case e.code === 401:
            dispatch(error("Authentification nécessaire!"));
            dispatch(error(null));
            localStorage.removeItem('token');
            history.push({ pathname: '../../login', state: { from: location.pathname }});
            break;
          case typeof e['hydra:description'] === "string":
            dispatch(error(e['hydra:description']));
            break;
          case typeof e.message === "string":
            dispatch(error(e.message));
            break;
          case typeof e === "string":
            dispatch(error(e));
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

    dispatch({ type: 'IMAGE_PROFILE_RESET' });
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
  return { type: 'IMAGE_PROFILE_MERCURE_OPEN', eventSource };
}

export function mercureMessage(retrieved) {
  return dispatch => {
    if (1 === Object.keys(retrieved).length) {
      dispatch({ type: 'IMAGE_PROFILE_MERCURE_DELETED', retrieved });
      return;
    }

    dispatch({ type: 'IMAGE_PROFILE_MERCURE_MESSAGE', retrieved });
  };
}
