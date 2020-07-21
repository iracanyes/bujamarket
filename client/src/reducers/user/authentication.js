import { combineReducers } from 'redux';

let token = localStorage.getItem("token") || (localStorage.getItem("token") !== "undefined") && JSON.parse(localStorage.getItem("token"));
const initialState = token ? { loggingIn: true, token } : {};

export function error(state = initialState, action) {
  switch (action.type) {
    case 'USER_LOGIN_ERROR':
      return action.error;

    default:
      return state;
  }
}

export function request(state = initialState, action) {
  switch (action.type) {
    case 'USER_LOGIN_REQUEST':
      return { loggingIn: true, user: action.user };

    default:
      return state;
  }
}

export function loading(state = initialState, action) {
  switch (action.type) {
    case 'USER_LOGIN_LOADING':
      return action.loading;

    default:
      return state;
  }
}

export function login(state = initialState, action) {
  switch (action.type) {
    case 'USER_LOGIN_SUCCESS':
        return { loggedIn: true, user: action.user};

    default:
      return state;
  }
}

export function logout(state = initialState, action) {
  switch (action.type) {
    case 'USER_LOGOUT_SUCCESS':
      return { loggedOut: true, user: action.user};

    default:
      return state;
  }
}

export default combineReducers({ error, loading, request, login, logout });
