import { combineReducers } from 'redux';

export function error(state = null, action) {
  switch (action.type) {
    case 'IMAGE_PROFILE_ERROR':
      return action.error;

    case 'IMAGE_PROFILE_MERCURE_DELETED':
      return `${action.retrieved['@id']} has been deleted by another user.`;

    case 'IMAGE_PROFILE_RESET':
      return null;

    default:
      return state;
  }
}

export function loading(state = false, action) {
  switch (action.type) {
    case 'IMAGE_PROFILE_LOADING':
      return action.loading;

    case 'IMAGE_PROFILE_RESET':
      return false;

    default:
      return state;
  }
}

export function retrieved(state = null, action) {
  switch (action.type) {
    case 'IMAGE_PROFILE_SUCCESS':
    case 'IMAGE_PROFILE_MERCURE_MESSAGE':
      return action.retrieved;

    case 'IMAGE_PROFILE_RESET':
      return null;

    default:
      return state;
  }
}

export function eventSource(state = null, action) {
  switch (action.type) {
    case 'IMAGE_PROFILE_MERCURE_OPEN':
      return action.eventSource;

    case 'IMAGE_PROFILE_RESET':
      return null;

    default:
      return state;
  }
}

export default combineReducers({ error, loading, retrieved, eventSource });
