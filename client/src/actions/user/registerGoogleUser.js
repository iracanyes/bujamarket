
import { fetch } from '../../utils/dataAccess';


export function notify(notification){
  return { type: 'GOOGLE_USER_REGISTER_NOTIFICATION', notification};
}

export function error(error) {
  return { type: 'GOOGLE_USER_REGISTER_ERROR', error };
}

export function request(user) {
  return { type: 'GOOGLE_USER_REGISTER_REQUEST', user };
}

export function loading(loading) {
  return { type: 'GOOGLE_USER_REGISTER_LOADING', loading };
}

export function success(user) {
  return { type: 'GOOGLE_USER_REGISTER_SUCCESS', user };
}


/*
* En passant l'objet this.props.history du composant
* vers son action creator permet de transmettre le changement d'URL au connected-react-router
**/
export function registerGoogleUser(data, history, locationState) {
  return dispatch => {
    dispatch(request({ data }));
    dispatch(loading(true));

    const headers = new Headers({
      'Content-Type': 'application/json',
    });

    const requestOptions = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data)
    };

    return fetch('register_google', requestOptions  )
      .then(response => {
        dispatch(loading(false));

        /* Utilisation si un objet est retourné*/
        return response.json();

      })
      .then(retrieved => {

        dispatch(notify(`
        Bienvenue ${ data.response.profileObj.name }!
        Compléter vos informations de profil.
        `));

        return retrieved;
      })
      .then(retrieved => {
        dispatch(success(retrieved));

        history.push({
          pathname: '/subscribe/'+ retrieved["token"]
        });


      })
      .catch(e => {
        dispatch(loading(false));

        switch (true) {
          case e.code === 500:
            dispatch(error("Tentative d'inscription échouée! Contactez l'administrateur de la plateforme." ));
            break;
          case e['hydra:description'] && typeof e['hydra:description'] === "string":
            dispatch(error("Connexion non-autorisé! Identifiant et/ou mot de passe incorrect."));
            break;
          case typeof e.message === "string":
            dispatch(error(e.message));
            break;
          case typeof e === "string":
            dispatch(error(e));
            break;
          default:
            dispatch(error(e));
            break;
        }
        dispatch(error(null));
        /* Redirection vers la page de connexion + message d'erreur */
        //history.push({pathname: 'login', state: locationState });
      });
  };
}


export function reset() {
  return dispatch => {
    dispatch(loading(false));
    dispatch(error(null));
  };
}
