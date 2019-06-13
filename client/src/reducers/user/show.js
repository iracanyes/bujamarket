import { combineReducers } from 'redux';

export function error(state = null, action) {
  switch (action.type) {
    case 'USER_SHOW_ERROR':
      return action.error;

    case 'USER_SHOW_MERCURE_DELETED':
      return `${action.retrieved['@id']} has been deleted by another user.`;

    case 'USER_SHOW_RESET':
      return null;

    default:
      return state;
  }
}

export function loading(state = false, action) {
  switch (action.type) {
    case 'USER_SHOW_LOADING':
      return action.loading;

    case 'USER_SHOW_RESET':
      return false;

    default:
      return state;
  }
}

export function retrieved(state = null, action) {
  switch (action.type) {
    case 'USER_SHOW_SUCCESS':
    case 'USER_SHOW_MERCURE_MESSAGE':
      return action.retrieved;

    case 'USER_SHOW_RESET':
      return null;

    default:
      return state;
  }
}

export function eventSource(state = null, action) {
  switch (action.type) {
    case 'USER_SHOW_MERCURE_OPEN':
      return action.eventSource;

    case 'USER_SHOW_RESET':
      return null;

    default:
      return state;
  }
}

export default combineReducers({ error, loading, retrieved, eventSource });
