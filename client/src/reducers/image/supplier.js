import { combineReducers } from 'redux';

export function error(state = null, action) {
  switch (action.type) {
    case 'IMAGE_SUPPLIER_ERROR':
      return action.error;

    case 'IMAGE_SUPPLIER_MERCURE_DELETED':
      return `${action.retrieved['@id']} has been deleted by another user.`;

    case 'IMAGE_SUPPLIER_RESET':
      return null;

    default:
      return state;
  }
}

export function loading(state = false, action) {
  switch (action.type) {
    case 'IMAGE_SUPPLIER_LOADING':
      return action.loading;

    case 'IMAGE_SUPPLIER_RESET':
      return false;

    default:
      return state;
  }
}

export function retrieved(state = null, action) {
  switch (action.type) {
    case 'IMAGE_SUPPLIER_SUCCESS':
    case 'IMAGE_SUPPLIER_MERCURE_MESSAGE':
      return action.retrieved;

    case 'IMAGE_SUPPLIER_RESET':
      return null;

    default:
      return state;
  }
}

export function eventSource(state = null, action) {
  switch (action.type) {
    case 'IMAGE_SUPPLIER_MERCURE_OPEN':
      return action.eventSource;

    case 'IMAGE_SUPPLIER_RESET':
      return null;

    default:
      return state;
  }
}

export default combineReducers({ error, loading, retrieved, eventSource });
