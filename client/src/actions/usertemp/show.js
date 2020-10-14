import {extractHubURL, fetch, normalize, mercureSubscribe as subscribe} from '../../utils/dataAccess';

export function error(error) {
  return { type: 'USER_TEMP_SHOW_ERROR', error };
}

export function request(user) {
  return { type: 'USER_TEMP_SHOW_REQUEST', user  };
}

export function loading(loading) {
  return { type: 'USER_TEMP_SHOW_LOADING', loading };
}

export function success(retrieved) {
  return { type: 'USER_TEMP_SHOW_SUCCESS', retrieved };
}

export function retrieve(token, history) {
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
        dispatch(success(retrieved));

        //if (hubURL) dispatch(mercureSubscribe(hubURL, retrieved['@id']));
      })
      .catch(e => {
        dispatch(loading(false));

        switch(true){
          case typeof e['hydra:description'] === "string":
            dispatch(error("Security token invalid!"));
            dispatch(error(null));
            history.push('/register');
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

    dispatch({ type: 'USER_TEMP_SHOW_RESET' });
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
  return { type: 'USER_TEMP_SHOW_MERCURE_OPEN', eventSource };
}

export function mercureMessage(retrieved) {
  return dispatch => {
    if (1 === Object.keys(retrieved).length) {
      dispatch({ type: 'USER_TEMP_SHOW_MERCURE_DELETED', retrieved });
      return;
    }

    dispatch({ type: 'USER_TEMP_SHOW_MERCURE_MESSAGE', retrieved });
  };
}

