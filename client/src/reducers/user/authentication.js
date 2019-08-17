import { combineReducers } from 'redux';

let user = JSON.parse(localStorage.getItem("user"));
const initialState = user ? { loggingIn: true, user } : {};

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
        return { loggingIn: true, user: action.user};

    default:
      return state;
  }
}

export default combineReducers({ error, loading, request, login });
