import { combineReducers } from 'redux';

export function error(state = null, action) {
  switch (action.type) {
    case 'USER_UNSUBSCRIBE_ERROR':
      return action.error;

    default:
      return state;
  }
}

export function loading(state = false, action) {
  switch (action.type) {
    case 'USER_UNSUBSCRIBE_LOADING':
      return action.loading;

    default:
      return state;
  }
}

export function unsubscribed(state = null, action) {
  switch (action.type) {
    case 'USER_UNSUBSCRIBE_SUCCESS':
      return action.unsubscribed;

    default:
      return state;
  }
}

export default combineReducers({ error, loading, unsubscribed });
