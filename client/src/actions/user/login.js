import { SubmissionError } from 'redux-form';
import { fetch } from '../../utils/dataAccess';
//import history from '../../utils/history';
import { push } from 'connected-react-router';

export function error(error) {
  return { type: 'USER_LOGIN_ERROR', error };
}

export function request(user) {
  return { type: 'USER_LOGIN_REQUEST', user };
}

export function loading(loading) {
  return { type: 'USER_LOGIN_LOADING', loading };
}

export function success(user) {
  return { type: 'USER_LOGIN_SUCCESS', user };
}

export function logout() {
  /* Supprimer les infos de l'utilisateur du localStorage */
  localStorage.removeItem('user');

  return { type: 'USER_LOGOUT'};
}

/*
* En passant l'objet this.props.history du composant
* vers son action creator permet de transmettre le changement d'URL au connected-react-router
**/
export function login(email, password, history) {
  return dispatch => {
    dispatch(request({ email }));
    dispatch(loading(true));

    const headers = new Headers({
      'Content-Type': 'application/json',
    });

    const requestOptions = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({email, password})
    };

    return fetch('login', requestOptions  )
      .then(response => {
        dispatch(loading(false));

        /* Utilisation si un objet est retourné
        return response.json();

         */
        console.log("fetch response headers", response.headers);
        return response;
      })
      .then(retrieved => {
        /* Utilisation du localStorage pour stocker les infos non-sécurisé de l'utilisateur authentifié */
        //localStorage.setItem("user", JSON.stringify(retrieved));

        console.log("fetch - retrieved",  retrieved);

        /* Utilisation du React context pour transmettre les infos non-sécurisé */

        return retrieved;

      })
      .then(retrieved => {
        dispatch(success(retrieved));
        /* history push change l'URL sans raffraichissement de la page */
        //dispatch(push('/profile')); /* with push from connected-react-router */

        /* En passant l'objet this.props.history du composant vers son action creator permet de transmettre le changement d'URL au connected-react-router  */
        history.push('/profile');  /* with history from utils/history */

        //window.location.reload(true);

      })
      .catch(e => {
        dispatch(loading(false));

        console.log("login action login catch error " , e );

        /* Déconnexion et forcer le rechargement de la page si erreur 401 */
        if(e.code === 401)
        {
          dispatch(logout());
          window.location.reload(true);
        }

        if (e instanceof SubmissionError) {
          dispatch(error(e.errors._error));
          throw e;
        }

        dispatch(error(e));
        //dispatch(error(e.message));
      });
  };
}


export function reset() {
  return dispatch => {
    dispatch(loading(false));
    dispatch(error(null));
  };
}
