import { fetch } from '../../utils/dataAccess';

export function error(error) {
  return { type: 'ADDRESS_CREATE_ERROR', error };
}

export function loading(loading) {
  return { type: 'ADDRESS_CREATE_LOADING', loading };
}

export function success(created) {
  return { type: 'ADDRESS_CREATE_SUCCESS', created };
}

export function create(values, history, location) {
  return dispatch => {
    dispatch(loading(true));

    /* Ajout du JWT authentication token de l'utilisateur connecté */
    const token = localStorage.getItem('token') !== null ? JSON.parse(localStorage.getItem('token')) : null;
    const headers = new Headers({'Content-Type':'application/ld+json'});
    token && headers.set('Authorization', 'Bearer '+ token.token);

    return fetch('address/create', { method: 'POST', headers, body: JSON.stringify(values) })
      .then(response => {
        dispatch(loading(false));

        return response.json();
      })
      .then(retrieved => dispatch(success(retrieved)))
      .catch(e => {
        dispatch(loading(false));

        switch (true){
          case e.code === 401:
            dispatch(error("Authentification nécessaire avant de poursuivre!"));
            history.push({pathname: '../../login', state: { from : location.pathname }});
            break;
          case typeof e.message === 'string':
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

export function reset() {
  return dispatch => {
    dispatch(loading(false));
    dispatch(error(null));
  };
}
