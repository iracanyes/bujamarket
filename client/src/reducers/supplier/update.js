import { combineReducers } from 'redux';

export function retrieveError(state = null, action) {
  switch (action.type) {
    case 'SUPPLIER_UPDATE_RETRIEVE_ERROR':
      return action.retrieveError;

    case 'SUPPLIER_UPDATE_MERCURE_DELETED':
      return `${action.retrieved['@id']} has been deleted by another user.`;

    case 'SUPPLIER_UPDATE_RESET':
      return null;

    default:
      return state;
  }
}

export function retrieveLoading(state = false, action) {
  switch (action.type) {
    case 'SUPPLIER_UPDATE_RETRIEVE_LOADING':
      return action.retrieveLoading;

    case 'SUPPLIER_UPDATE_RESET':
      return false;

    default:
      return state;
  }
}

export function retrieved(state = null, action) {
  switch (action.type) {
    case 'SUPPLIER_UPDATE_RETRIEVE_SUCCESS':
    case 'SUPPLIER_UPDATE_MERCURE_MESSAGE':
      return action.retrieved;

    case 'SUPPLIER_UPDATE_RESET':
      return null;

    default:
      return state;
  }
}

export function updateError(state = null, action) {
  switch (action.type) {
    case 'SUPPLIER_UPDATE_UPDATE_ERROR':
      return action.updateError;

    case 'SUPPLIER_UPDATE_RESET':
      return null;

    default:
      return state;
  }
}

export function updateLoading(state = false, action) {
  switch (action.type) {
    case 'SUPPLIER_UPDATE_UPDATE_LOADING':
      return action.updateLoading;

    case 'SUPPLIER_UPDATE_RESET':
      return false;

    default:
      return state;
  }
}

export function updated(state = null, action) {
  switch (action.type) {
    case 'SUPPLIER_UPDATE_UPDATE_SUCCESS':
      return action.updated;

    case 'SUPPLIER_UPDATE_RESET':
      return null;

    default:
      return state;
  }
}

export function eventSource(state = null, action) {
  switch (action.type) {
    case 'SUPPLIER_UPDATE_MERCURE_OPEN':
      return action.eventSource;

    case 'SUPPLIER_UPDATE_RESET':
      return null;

    default:
      return state;
  }
}

export default combineReducers({
  retrieveError,
  retrieveLoading,
  retrieved,
  updateError,
  updateLoading,
  updated,
  eventSource
});
