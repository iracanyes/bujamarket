import { combineReducers } from 'redux';

export function notification(state = null, action)
{
  switch (action.type)
  {
    case 'FAVORITE_DELETE_NOTIFICATION':
      return action.notification;
    default:
      return state;
  }
}
export function error(state = null, action) {
  switch (action.type) {
    case 'FAVORITE_DELETE_ERROR':
      return action.error;

    default:
      return state;
  }
}

export function loading(state = false, action) {
  switch (action.type) {
    case 'FAVORITE_DELETE_LOADING':
      return action.loading;

    default:
      return state;
  }
}

export function deleted(state = null, action) {
  switch (action.type) {
    case 'FAVORITE_DELETE_SUCCESS':
      return action.deleted;

    default:
      return state;
  }
}

export default combineReducers({ error, loading, deleted, notification });
