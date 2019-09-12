import { combineReducers } from 'redux';


export function error(state = {}, action) {
  switch (action.type) {
    case 'USER_SUBSCRIBE_ERROR':
      return action.error;

    default:
      return state;
  }
}

export function request(state = {}, action) {
  switch (action.type) {
    case 'USER_SUBSCRIBE_REQUEST':
      return { subscribing: true };

    default:
      return state;
  }
}

export function loading(state = false, action) {
  switch (action.type) {
    case 'USER_SUBSCRIBE_LOADING':
      return action.loading;

    default:
      return state;
  }
}

export function retrieved(state = null, action) {
  switch (action.type) {
    case 'USER_SUBSCRIBE_RETRIEVE_SUCCESS':
    case 'USER_SUBSCRIBE_MERCURE_MESSAGE':
      return action.retrieved;

    case 'USER_SUBSCRIBE_RESET':
      return null;

    default:
      return state;
  }
}

export function subscribe(state = {}, action) {
  switch (action.type) {
    case 'USER_SUBSCRIBE_SUCCESS':
        return {};

    default:
      return state;
  }
}

export function eventSource(state = null, action) {
  switch (action.type) {
    case 'USER_SUBSCRIBE_MERCURE_OPEN':
      return action.eventSource;

    case 'USER_SUBSCRIBE_RESET':
      return null;

    default:
      return state;
  }
}

export default combineReducers({ error, loading, request, subscribe, retrieved });
