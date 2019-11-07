import { fetch } from '../../utils/dataAccess';

export function error(error) {
  return { type: 'FAVORITE_DELETE_ERROR', error };
}

export function loading(loading) {
  return { type: 'FAVORITE_DELETE_LOADING', loading };
}

export function success(deleted) {
  return { type: 'FAVORITE_DELETE_SUCCESS', deleted };
}

export function del(item, history) {
  return dispatch => {
    dispatch(loading(true));

    /* Récupération de la clé JWT et ajout au header de la requête */
    const userToken = JSON.parse(localStorage.getItem('token'));
    let headers = new Headers();
    headers.set('Authorization', 'Bearer ' + userToken.token);

    return fetch('favorite/'+ item, { method: 'DELETE', headers: headers })
      .then(() => {
        dispatch(loading(false));
        dispatch(success(item));

        /* On supprime l'élément des favorites */
        
      })
      .catch(e => {
        dispatch(loading(false));
        dispatch(error(e.message));

        if( /Unauthorized/.test(e))
        {
          sessionStorage.removeItem('flash-message-error');
          sessionStorage.setItem('flash-message-error', JSON.stringify({message: "Authentification nécessaire avant de continuer!"}));
          history.push({pathname: '../../login', state: { from: window.location.pathname}});
        }

      });
  };
}
