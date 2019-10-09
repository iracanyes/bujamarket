import { SubmissionError } from 'redux-form';
import { fetch } from '../../utils/dataAccess';

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
  localStorage.removeItem('token');

  return { type: 'USER_LOGOUT'};
}

/*
* En passant l'objet this.props.history du composant
* vers son action creator permet de transmettre le changement d'URL au connected-react-router
**/
export function login(email, password, history, locationState) {
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

    return fetch('authentication_token', requestOptions  )
      .then(response => {
        dispatch(loading(false));

        /* Utilisation si un objet est retourné*/
        return response.json();

      })
      .then(retrieved => {
        /* Utilisation du localStorage pour stocker le token de sécurité de l'utilisateur authentifié */
        localStorage.removeItem("token");
        localStorage.setItem("token", JSON.stringify(retrieved));

        return retrieved;

      })
      .then(retrieved => {
        dispatch(success(retrieved));

        /* En passant l'objet this.props.history du composant vers son action creator cela permet de transmettre le changement d'URL au store
        */
        history.push({ pathname: locationState.from, state: { params: locationState.params } });

      })
      .catch(e => {
        dispatch(loading(false));

        console.log("login action login catch error " , e );

        /* Déconnexion et forcer le rechargement de la page si erreur 401 */
        if(e.code === 401)
        {
          dispatch(logout());
          history.push({pathname: 'login', state: locationState });
        }

        if(/Unauthorized/.test(e.message))
        {

          dispatch(logout());
          /* Redirection vers la page de connexion + message d'erreur */
          history.push('login');
          sessionStorage.removeItem('flash-message-error');
          sessionStorage.setItem('flash-message-error', JSON.stringify({message: "Connexion non-autorisé! identifiant et/ou mot de passe incorrect."}));
          history.push({pathname: 'login', state: locationState });
        }

        /*
        if (e instanceof SubmissionError) {
          dispatch(error(e.errors._error));
          throw e;
        }
        */
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
