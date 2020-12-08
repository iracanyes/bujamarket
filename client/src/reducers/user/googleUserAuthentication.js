import { combineReducers } from 'redux';

let token = localStorage.getItem("token") !== null && JSON.parse(localStorage.getItem("token"));
const initialState = token ? { loggingIn: true, token } : {};


export function notify( state = initialState, action){
  switch(action.type){
    case 'GOOGLE_USER_LOGIN_NOTIFICATION':
      return action.notification;
    default:
      return state;
  }
}

export function error(state = initialState, action) {
  switch (action.type) {
    case 'GOOGLE_USER_LOGIN_ERROR':
      return action.error;

    default:
      return state;
  }
}

export function request(state = initialState, action) {
  switch (action.type) {
    case 'GOOGLE_USER_LOGIN_REQUEST':
      return { loggingIn: true, user: action.user };

    default:
      return state;
  }
}

export function loading(state = initialState, action) {
  switch (action.type) {
    case 'GOOGLE_USER_LOGIN_LOADING':
      return action.loading;

    default:
      return state;
  }
}

export function loginGoogleUser(state = initialState, action) {
  switch (action.type) {
    case 'GOOGLE_USER_LOGIN_SUCCESS':
        return { loggedIn: true, user: action.user};

    default:
      return state;
  }
}

export function logout(state = initialState, action) {
  switch (action.type) {
    case 'GOOGLE_USER_LOGOUT_SUCCESS':
      return { loggedOut: true, user: action.user};

    default:
      return state;
  }
}

export default combineReducers({ error, loading, request, loginGoogleUser, logout, notify });
