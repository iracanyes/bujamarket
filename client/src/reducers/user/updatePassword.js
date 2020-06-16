import { combineReducers } from 'redux';


export function error(state = {}, action) {
  switch (action.type) {
    case 'USER_UPDATE_PASSWORD_ERROR':
      return action.error;

    default:
      return state;
  }
}

export function request(state = {}, action) {
  switch (action.type) {
    case 'USER_UPDATE_PASSWORD_REQUEST':
      return { updatingPassword: true };

    default:
      return state;
  }
}

export function loading(state = false, action) {
  switch (action.type) {
    case 'USER_UPDATE_PASSWORD_LOADING':
      return action.loading;

    default:
      return state;
  }
}

export function retrieved(state = null, action) {
  switch (action.type) {
    case 'USER_UPDATE_PASSWORD_RETRIEVE_SUCCESS':
    case 'USER_UPDATE_PASSWORD_MERCURE_MESSAGE':
      return action.retrieved;

    case 'USER_UPDATE_PASSWORD_RESET':
      return null;

    default:
      return state;
  }
}

export function updatePassword(state = {}, action) {
  switch (action.type) {
    case 'USER_UPDATE_PASSWORD_SUCCESS':
        return {};

    default:
      return state;
  }
}

export function eventSource(state = null, action) {
  switch (action.type) {
    case 'USER_UPDATE_PASSWORD_MERCURE_OPEN':
      return action.eventSource;

    case 'USER_UPDATE_PASSWORD_RESET':
      return null;

    default:
      return state;
  }
}

export default combineReducers({ error, loading, request, updatePassword, retrieved });
