import { fetch } from '../../utils/dataAccess';

export function notify(notification){
  return { type: 'FAVORITE_DELETE_NOTIFICATION', notification};
}
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
    const headers = new Headers();
    headers.set('Authorization', 'Bearer ' + userToken.token);

    return fetch('favorite/'+ item, { method: 'DELETE', headers: headers })
      .then(() => {
        dispatch(loading(false));
        deleteLocalStorageFavorite(item);
        dispatch( notify(`L'élément ID ${item} a été supprimé de vos favoris!`));
        dispatch(success(item));


        //window.location.reload();

      })
      .catch(e => {
        dispatch(loading(false));
        console.log('exception', e);
        switch (true){
          case /not found/.test(e['hydra:description']):
            deleteLocalStorageFavorite(item);
            dispatch( notify(`L'élément ID ${item} a été supprimé de vos favoris.`));
            dispatch(notify(null));
            //window.location.reload();
            break;
          case typeof e.message === "string":
            dispatch(error(e.message));
            break;
          case /Unauthorized/.test(e):
            dispatch(error("Authentification nécessaire avant de continuer!"));
            dispatch(error(null));
            history.push({pathname: '../../login', state: { from: window.location.pathname}});
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
    dispatch(success(null));
    dispatch(notify(null));
  };
}

function deleteLocalStorageFavorite(id){
  /* On supprime l'élément des favorites */
  let favorites = localStorage.getItem("favorites") ? JSON.parse(localStorage.getItem("favorites")) : [];
  console.log('deleteLocalStorageFavorite - favorites', favorites);
  let index = favorites.findIndex(value => value.id === id);
  console.log('index', index);
  // Suppression du produit dans le panier de commande
  favorites.splice(index, 1);
  // Mise à jour du panier de commade
  localStorage.removeItem('favorites');
  if(favorites.length > 0)
  {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }
  console.log('localStorage - favorites', localStorage.getItem('favorites'));

}
