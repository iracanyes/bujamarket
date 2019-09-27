import { SubmissionError } from 'redux-form';
import { fetch } from '../../utils/dataAccess';


export function error(error) {
  return { type: 'USER_REGISTER_ERROR', error };
}

export function request(user) {
  return { type: 'USER_REGISTER_REQUEST', user  };
}

export function loading(loading) {
  return { type: 'USER_REGISTER_LOADING', loading };
}

export function success(user) {
  return { type: 'USER_REGISTER_SUCCESS', user };
}

export function logout() {
  /* Supprimer les infos de l'utilisateur du localStorage */
  localStorage.removeItem('token');

  return { type: 'USER_LOGOUT'};
}

export function register(values, history) {
  return dispatch => {
    dispatch(loading(true));
    dispatch(request(values));

    const headers = new Headers({
      'Content-Type': 'application/json',
    });

    return fetch('register', { method: 'POST', headers: headers, body: JSON.stringify(values) })
      .then(response => {
        dispatch(loading(false));

        return response.json();
      })
      .then(retrieved => {
        dispatch(success(retrieved));

        /* Sauvegarde de l'utilisateur temporaire */
        sessionStorage.setItem(
          'flash-message',
          JSON.stringify({
            message : `Bienvenue ${ retrieved.firstname + " " + retrieved.lastname }, visitez votre boîte de réception pour valider votre inscription!`
          })

        );
        history.push('/');
      })
      .catch(e => {
        dispatch(loading(false));



        /* Déconnexion et forcer le rechargement de la page si erreur 401 */
        if(e.code === 401)
        {
          dispatch(logout());
          history.push('register');
        }


        if (e instanceof SubmissionError) {
          dispatch(error(e));
          throw e;
        }

        console.log(Error(e));

        dispatch(error(e));
        throw e;
      });
  };
}

export function reset() {
  return dispatch => {
    dispatch(loading(false));
    dispatch(error(null));
  };
}
