import { fetch } from '../../utils/dataAccess';
import authHeader from "../../utils/authHeader";

export function error(error) {
  return { type: 'IMAGE_DELETE_ERROR', error };
}

export function loading(loading) {
  return { type: 'IMAGE_DELETE_LOADING', loading };
}

export function success(deleted) {
  return { type: 'IMAGE_DELETE_SUCCESS', deleted };
}

export function del(item, history, location) {
  return dispatch => {
    dispatch(loading(true));

    const headers =  authHeader(history, location);

    return fetch(item['@id'], { method: 'DELETE', headers })
      .then(() => {
        dispatch(loading(false));
        dispatch(success(true));
        dispatch(success(false));
      })
      .catch(e => {
        dispatch(loading(false));

        switch (true) {
          case e.code === 401:
            dispatch(error("Authentification nécessaire avant de supprimer l'image!"));
            history.push({ pathname: '../../login', state: { from: location.pathname }});
            break;
          case typeof e === "string":
            dispatch(error(e));
            break;
          case e['hydra:description']:
            dispatch(error(e['hydra:description']));
            break;
          case e.message:
            dispatch(error(e.message));
            break;
        }
        dispatch(error(null));

      });
  };
}
