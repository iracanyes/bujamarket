import { combineReducers } from 'redux';

export function notify(state = {}, action) {
  switch (action.type) {
    case 'USER_REGISTER_NOTIFICATION':
      return action.notification;

    default:
      return state;
  }
}

export function error(state = {}, action) {
  switch (action.type) {
    case 'USER_REGISTER_ERROR':
      return action.error;

    default:
      return state;
  }
}

export function request(state = {}, action) {
  switch (action.type) {
    case 'USER_REGISTER_REQUEST':
      return { registering: true };

    default:
      return state;
  }
}

export function loading(state = {}, action) {
  switch (action.type) {
    case 'USER_REGISTER_LOADING':
      return action.loading;

    default:
      return state;
  }
}

export function success(state = {}, action) {
  switch (action.type) {
    case 'USER_REGISTER_SUCCESS':
        return action.user;

    default:
      return state;
  }
}

export default combineReducers({ error, loading, request, success, notify });
