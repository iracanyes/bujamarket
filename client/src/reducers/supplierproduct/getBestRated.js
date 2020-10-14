import { combineReducers } from 'redux';

export function error(state = null, action) {
  switch (action.type) {
    case 'SUPPLIERPRODUCT_BEST_RATED_ERROR':
      return action.error;

    case 'SUPPLIERPRODUCT_BEST_RATED_MERCURE_DELETED':
      return `${action.retrieved['@id']} has been deleted by another user.`;

    case 'SUPPLIERPRODUCT_BEST_RATED_RESET':
      return null;

    default:
      return state;
  }
}

export function loading(state = false, action) {
  switch (action.type) {
    case 'SUPPLIERPRODUCT_BEST_RATED_LOADING':
      return action.loading;

    case 'SUPPLIERPRODUCT_BEST_RATED_RESET':
      return false;

    default:
      return state;
  }
}

export function retrieved(state = null, action) {
  switch (action.type) {
    case 'SUPPLIERPRODUCT_BEST_RATED_SUCCESS':
      return action.retrieved;

    case 'SUPPLIERPRODUCT_BEST_RATED_RESET':
      return null;

    case 'SUPPLIERPRODUCT_BEST_RATED_MERCURE_MESSAGE':
      return {
        ...state,
        'hydra:member': state['hydra:member'].map(item =>
          item['@id'] === action.retrieved['@id'] ? action.retrieved : item
        )
      };

    case 'SUPPLIERPRODUCT_BEST_RATED_MERCURE_DELETED':
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
    case 'SUPPLIERPRODUCT_BEST_RATED_MERCURE_OPEN':
      return action.eventSource;

    case 'SUPPLIERPRODUCT_BEST_RATED_RESET':
      return null;

    default:
      return state;
  }
}

export default combineReducers({ error, loading, retrieved, eventSource });
