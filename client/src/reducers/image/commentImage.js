import { combineReducers } from 'redux';

export function error(state = null, action) {
  switch (action.type) {
    case 'IMAGE_CUSTOMER_COMMENT_ERROR':
      return action.error;

    case 'IMAGE_CUSTOMER_COMMENT_MERCURE_DELETED':
      return `${action.retrieved['@id']} has been deleted by another user.`;

    case 'IMAGE_CUSTOMER_COMMENT_RESET':
      return null;

    default:
      return state;
  }
}

export function loading(state = false, action) {
  switch (action.type) {
    case 'IMAGE_CUSTOMER_COMMENT_LOADING':
      return action.loading;

    case 'IMAGE_CUSTOMER_COMMENT_RESET':
      return false;

    default:
      return state;
  }
}

export function retrieved(state = null, action) {
  switch (action.type) {
    case 'IMAGE_CUSTOMER_COMMENT_SUCCESS':
    case 'IMAGE_CUSTOMER_COMMENT_MERCURE_MESSAGE':
      return action.retrieved;

    case 'IMAGE_CUSTOMER_COMMENT_RESET':
      return null;

    default:
      return state;
  }
}

export function eventSource(state = null, action) {
  switch (action.type) {
    case 'IMAGE_CUSTOMER_COMMENT_MERCURE_OPEN':
      return action.eventSource;

    case 'IMAGE_CUSTOMER_COMMENT_RESET':
      return null;

    default:
      return state;
  }
}

export default combineReducers({ error, loading, retrieved, eventSource });
