/**
 * Date: 11/8/19
 * Description:
 */
import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_ERROR, AUTH_CHECK } from 'react-admin';

export default (type, params) => {
  /* Login */
  if (type === AUTH_LOGIN) {
    const { username, password } = params;
    const options = {
      method: 'POST',
      headers: {'Content-Type':'application/ld+json'},
      body: JSON.stringify(params)
    };


    return global.fetch(process.env.REACT_APP_API_ENTRYPOINT + '/authentication_token', options)
      .then(response => {

        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        console.log('auth response', response);
        return response.json();
      })
      .then(({ token }) => {
        console.log('auth token', token);
        localStorage.removeItem("token");
        localStorage.setItem('token', token);
        // Redirect to Dashboard
        return Promise.resolve({redirectTo: '/'})
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
    if ((status === 401 || status === 403)) {
      localStorage.removeItem('token');
      return Promise.reject({redirectTo: '/login'});
    }
    return Promise.resolve();
  }

  if (type === AUTH_CHECK) {
    console.log("AuthProvider - authcheck", params);

    const user = localStorage.getItem('token') !== null ?  JSON.parse(atob(localStorage.getItem('token').split('.')[1])) : null;

    console.log('auth_check - user', user);

    return localStorage.getItem('token') || !user || user.roles.includes('ROLE_ADMIN') ? Promise.resolve() : Promise.reject({ redirectTo: '/login' });
  }

  return Promise.resolve();
}
