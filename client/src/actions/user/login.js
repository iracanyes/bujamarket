import { SubmissionError } from 'redux-form';
import { fetch } from '../../utils/dataAccess';
import history from '../../utils/history';

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

export function login(email, password) {
  return dispatch => {
    dispatch(request({ email }));
    dispatch(loading(true));

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/ld+json'
      },
      body: JSON.stringify({email, password})
    };

    return fetch('login', requestOptions  )
      .then(response => {
        dispatch(loading(false));

        return response.json();
      })
      .then(retrieved => {
        /* Utilisation du localStorage pour stocker les infos non-sécurisé de l'utilisateur authentifié */
        localStorage.setItem("user", JSON.stringify(retrieved));

        /* Utilisation du React context pour transmettre les infos non-sécurisé */

        return retrieved;
      })
      .then(retrieved => {
        dispatch(success(retrieved));
        history.push('/');

      })
      .catch(e => {
        dispatch(loading(false));

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

        dispatch(error(e.message));
      });
  };
}

export function reset() {
  return dispatch => {
    dispatch(loading(false));
    dispatch(error(null));
  };
}
