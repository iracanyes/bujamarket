import { combineReducers } from 'redux';

export function error(state = null, action) {
  switch (action.type) {
    case 'PRODUCT_GET_NAMES_ERROR':
      return action.error;

    case 'PRODUCT_GET_NAMES_MERCURE_DELETED':
      return `${action.retrieved['@id']} has been deleted by another user.`;

    case 'PRODUCT_GET_NAMES_RESET':
      return null;

    default:
      return state;
  }
}

export function loading(state = false, action) {
  switch (action.type) {
    case 'PRODUCT_GET_NAMES_LOADING':
      return action.loading;

    case 'PRODUCT_GET_NAMES_RESET':
      return false;

    default:
      return state;
  }
}

export function retrieved(state = null, action) {
  switch (action.type) {
    case 'PRODUCT_GET_NAMES_SUCCESS':
      return action.retrieved;

    case 'PRODUCT_LIST_RESET':
      return null;

    case 'PRODUCT_GET_NAMES_MERCURE_MESSAGE':
      return {
        ...state,
        'hydra:member': state['hydra:member'].map(item =>
          item['@id'] === action.retrieved['@id'] ? action.retrieved : item
        )
      };

    case 'PRODUCT_GET_NAMES_MERCURE_DELETED':
      return {
        ...state,
        'hydra:member': state['hydra:member'].filter(
          item => item['@id'] !== action.retrieved['@id']
        )
      };

    default:
      return state;
  }
}

export function eventSource(state = null, action) {
  switch (action.type) {
    case 'PRODUCT_GET_NAMES_MERCURE_OPEN':
      return action.eventSource;

    case 'PRODUCT_GET_NAMES_RESET':
      return null;

    default:
      return state;
  }
}

export default combineReducers({ error, loading, retrieved, eventSource });
