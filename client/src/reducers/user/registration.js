import { combineReducers } from 'redux';


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

export function register(state = {}, action) {
  switch (action.type) {
    case 'USER_REGISTER_SUCCESS':
        return {};

    default:
      return state;
  }
}

export default combineReducers({ error, loading, request, register });
