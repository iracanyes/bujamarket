import { SubmissionError } from 'redux-form';
import { fetch } from '../../utils/dataAccess';

export function error(error) {
  return { type: 'BILL_CUSTOMER_DOWNLOAD_ERROR', error };
}

export function loading(loading) {
  return { type: 'BILL_CUSTOMER_DOWNLOAD_LOADING', loading };
}

export function success(retrieved) {
  return { type: 'BILL_CUSTOMER_DOWNLOAD_SUCCESS', retrieved };
}

export function download(filename, history) {
  return dispatch => {
    dispatch(loading(true));

    /* Récupération de la clé JWT et ajout au header de la requête */
    const userToken = JSON.parse(localStorage.getItem('token'));
    let headers = new Headers();
    headers.set('Authorization', 'Bearer ' + userToken.token);

    return fetch('customer_bill/download?file='+ filename, { method: 'GET', headers: headers })
      .then(response => {
        dispatch(loading(false));

        return response.blob();
      })
      .then(retrieved => {
        dispatch(success(retrieved));


        /* Création du lien de téléchargement */
        let url = window.URL.createObjectURL(retrieved);
        let a = document.createElement('a');
        a.href = url;
        a.target = "_blank";
        a.download = 'sample.pdf';

        /* Ajout dans la page  */
        document.body.appendChild(a);
        /* Forcer le téléchargement */
        //a.click();

        window.addEventListener('focus', window_focus, false);
        function window_focus(){
          window.removeEventListener('focus', window_focus, false);
          URL.revokeObjectURL(url);
        }

        /* Ouvrir le fichier pdf  */
        //window.location.href = url;

        // Activer le bouton - Télécharger le pdf
        //a.click();
        window.open(url, '_blank');

        /* Supprimer le lien  */
        a.parentNode.removeChild(a);

      })
      .catch(e => {
        dispatch(loading(false));

        switch (true){
          case e.code === 401:
            dispatch(error("Authentification obligatoire!"));
            dispatch(error(null));
            history.push({pathname: '../login', state: { from: window.location.pathname}});
            break;
          case typeof e['hydra:description'] === 'string':
            dispatch(error(e['hydra:description']));
            break;
          case typeof e.message === "string":
            dispatch(error(e.message));
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
