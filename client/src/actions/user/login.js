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

    return fetch('authentication_token', requestOptions  )
      .then(response => {
        dispatch(loading(false));

        console.log("fetch response headers", response.headers);

        /* Utilisation si un objet est retourné*/
        return response.json();


        /* Si un objet n'est pas retourné, on transmet la réponse initial
        return response;

         */
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
        *
        */
        history.goBack();



      })
      .catch(e => {
        dispatch(loading(false));

        console.log("login action login catch error " , e );

        /* Déconnexion et forcer le rechargement de la page si erreur 401 */
        if(e.code === 401)
        {
          dispatch(logout());
          history.push('login');
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
