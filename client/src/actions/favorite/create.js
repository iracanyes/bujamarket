import { fetch } from '../../utils/dataAccess';

export function error(error) {
  return { type: 'FAVORITE_CREATE_ERROR', error };
}

export function loading(loading) {
  return { type: 'FAVORITE_CREATE_LOADING', loading };
}

export function success(created) {
  return { type: 'FAVORITE_CREATE_SUCCESS', created };
}

export function create(values, history) {
  return dispatch => {
    dispatch(loading(true));

    /* Récupération de la clé JWT et ajout au header de la requête */
    const userToken = JSON.parse(localStorage.getItem('token'));
    let headers = new Headers();
    headers.set('Authorization', 'Bearer ' + userToken.token);


    return fetch('favorite/create', { method: 'POST', headers: headers, body: JSON.stringify(values) })
      .then(response => {
        dispatch(loading(false));
        return response.json();
      })
      .then(retrieved => {


        let favorites = localStorage.getItem('favorites') ? JSON.parse(localStorage.getItem('favorites')) : [];
        favorites.push({id: retrieved.supplierProduct.id});

        localStorage.removeItem('favorites');
        localStorage.setItem('favorites', JSON.stringify(favorites));
        dispatch(success(retrieved));

      })
      .catch(e => {
        dispatch(loading(false));

        switch (true){
          case typeof e.message === "string":
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
