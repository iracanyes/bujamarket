/**
 * Date: 28/06/2020
 * Description: Authentication
 * Ajouter l'en-tête Authorization : Bearer $token
 */
import {toastError} from "../layout/ToastMessage";

function authHeader(history, location) {
  const token = localStorage.getItem('token') !== null ? JSON.parse(localStorage.getItem("token")).token : null;

  if(token === null)
  {
    toastError('Authentification nécessaire!');
    history.push({pathname:'../../login', state: { from: location.pathname, params: (location.state && location.state.params ) ? location.state.params : null }});
  }

  const headers = new Headers({ 'Content-Type': 'application/ld+json'});
  token && headers.set('Authorization','Bearer '+ token)

  return headers;

}

export default  authHeader;
