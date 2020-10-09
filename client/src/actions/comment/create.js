import { SubmissionError } from 'redux-form';
import { fetch } from '../../utils/dataAccess';
import authHeader from "../../utils/authHeader";

export function error(error) {
  return { type: 'COMMENT_CREATE_ERROR', error };
}

export function loading(loading) {
  return { type: 'COMMENT_CREATE_LOADING', loading };
}

export function success(created) {
  return { type: 'COMMENT_CREATE_SUCCESS', created };
}

export function create(values, history, location) {
  return dispatch => {
    dispatch(loading(true));

    const headers = authHeader(history, location);

    return fetch('comment/create', { method: 'POST', headers, body: JSON.stringify(values) })
      .then(response => {
        dispatch(loading(false));

        return response.json();
      })
      .then(retrieved => dispatch(success(retrieved)))
      .catch(e => {
        dispatch(loading(false));

        switch (true){
          case e.code === 401:
            dispatch( error("Authentification nécessaire"));
            dispatch(error(null));
            history.push({ pathname: "../login", state: { from: location.pathname }});
            break;
          case typeof e.message === "string":
            dispatch(error(e.message));
            break;
          case typeof e['hydra:description'] === "string":
            dispatch(error(e['hydra:description']));
            break;
        }
      });
  };
}

export function reset() {
  return dispatch => {
    dispatch(loading(false));
    dispatch(error(null));
  };
}
