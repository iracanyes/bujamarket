import { fetch } from '../../utils/dataAccess';

export function error(error) {
  return { type: 'ADDRESS_DELETE_ERROR', error };
}

export function loading(loading) {
  return { type: 'ADDRESS_DELETE_LOADING', loading };
}

export function success(deleted) {
  return { type: 'ADDRESS_DELETE_SUCCESS', deleted };
}

export function del(item, history, location) {
  return dispatch => {
    dispatch(loading(true));

    /* Ajout du JWT authentication token de l'utilisateur connecté */
    const token = localStorage.getItem('token') !== null ? JSON.parse(localStorage.getItem('token')) : null;
    const headers = new Headers({'Content-Type':'application/ld+json'});
    token && headers.set('Authorization', 'Bearer '+ token.token);

    return fetch('address/' + item.id, { method: 'DELETE', headers })
      .then(() => {
        dispatch(loading(false));
        dispatch(success(item));
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
            dispatch(error(e['hydra:title']));
          }else{
            dispatch(error(e.message));
          }
        }
        dispatch(error(null));
      });
  };
}
