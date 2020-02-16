/**
 * Author: iracanyes
 * Date: 11/8/19
 * Description:
 */
import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_ERROR, AUTH_CHECK } from 'react-admin';

export default (type, params) => {
  /* Login */
  if (type === AUTH_LOGIN) {
    const { username, password } = params;
    const request = new Request(process.env.REACT_APP_API_ENTRYPOINT + '/authentication_token', {
      method: 'POST',
      body: JSON.stringify({ email: username, password }),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    })
    return fetch(request)
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then(({ token }) => {
        localStorage.removeItem("token");
        localStorage.setItem('token', token);
      });
  }
  /* Logout */
  if (type === AUTH_LOGOUT) {
    localStorage.removeItem('token');
    return Promise.resolve();
  }

  /* Authentification error */
  if (type === AUTH_ERROR) {
    const status  = params.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem('token');
      return Promise.reject({redirectTo: '/login'});
    }
    return Promise.resolve();
  }

  if (type === AUTH_CHECK) {
    const user = localStorage.getItem('token') !== null ?  JSON.parse(atob(localStorage.getItem('token').split('.')[1])) : null;
    return localStorage.getItem('token') || !user || user.roles.includes('ROLE_ADMIN') ? Promise.resolve() : Promise.reject({ redirectTo: '/login' });
  }

  return Promise.resolve();
}
