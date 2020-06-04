import { combineReducers } from 'redux';


export function error(state = {}, action) {
  switch (action.type) {
    case 'USER_UNLOCK_ACCOUNT_ERROR':
      return action.error;

    default:
      return state;
  }
}

export function request(state = {}, action) {
  switch (action.type) {
    case 'USER_UNLOCK_ACCOUNT_REQUEST':
      return { unlocking: true };

    default:
      return state;
  }
}

export function loading(state = false, action) {
  switch (action.type) {
    case 'USER_UNLOCK_ACCOUNT_LOADING':
      return action.loading;

    default:
      return state;
  }
}

export function retrieved(state = null, action) {
  switch (action.type) {
    case 'USER_UNLOCK_ACCOUNT_RETRIEVE_SUCCESS':
    case 'USER_UNLOCK_ACCOUNT_MERCURE_MESSAGE':
      return action.retrieved;

    case 'USER_UNLOCK_ACCOUNT_RESET':
      return null;

    default:
      return state;
  }
}

export function unlockAccount(state = {}, action) {
  switch (action.type) {
    case 'USER_UNLOCK_ACCOUNT_SUCCESS':
        return {};

    default:
      return state;
  }
}

export function eventSource(state = null, action) {
  switch (action.type) {
    case 'USER_UNLOCK_ACCOUNT_MERCURE_OPEN':
      return action.eventSource;

    case 'USER_UNLOCK_ACCOUNT_RESET':
      return null;

    default:
      return state;
  }
}

export default combineReducers({ error, loading, request, unlockAccount, retrieved });
