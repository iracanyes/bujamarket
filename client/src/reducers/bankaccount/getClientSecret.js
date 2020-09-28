import { combineReducers } from 'redux';

export function error(state = null, action) {
  switch (action.type) {
    case 'BANKACCOUNT_CREATE_CLIENT_SECRET_ERROR':
      return action.error;

    default:
      return state;
  }
}

export function loading(state = false, action) {
  switch (action.type) {
    case 'BANKACCOUNT_CREATE_CLIENT_SECRET_LOADING':
      return action.loading;

    default:
      return state;
  }
}

export function retrieved(state = null, action) {
  switch (action.type) {
    case 'BANKACCOUNT_CREATE_CLIENT_SECRET_SUCCESS':
      return action.retrieved;

    default:
      return state;
  }
}

export default combineReducers({ error, loading, retrieved });
