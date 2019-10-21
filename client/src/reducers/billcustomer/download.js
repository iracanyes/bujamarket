/**
 * Author: iracanyes
 * Date: 10/20/19
 * Description:
 */
import { combineReducers } from 'redux';

export function error(state = null, action) {
  switch (action.type) {
    case 'BILL_CUSTOMER_DOWNLOAD_ERROR':
      return action.error;

    case 'BILL_CUSTOMER_DOWNLOAD_MERCURE_DELETED':
      return `${action.retrieved['@id']} has been deleted by another user.`;

    case 'BILL_CUSTOMER_DOWNLOAD_RESET':
      return null;

    default:
      return state;
  }
}

export function loading(state = false, action) {
  switch (action.type) {
    case 'BILL_CUSTOMER_DOWNLOAD_LOADING':
      return action.loading;

    case 'BILL_CUSTOMER_DOWNLOAD_RESET':
      return false;

    default:
      return state;
  }
}

export function retrieved(state = null, action) {
  switch (action.type) {
    case 'BILL_CUSTOMER_DOWNLOAD_SUCCESS':
    case 'BILL_CUSTOMER_DOWNLOAD_MERCURE_MESSAGE':
      return action.retrieved;

    case 'BILL_CUSTOMER_DOWNLOAD_RESET':
      return null;

    default:
      return state;
  }
}

export function eventSource(state = null, action) {
  switch (action.type) {
    case 'BILL_CUSTOMER_DOWNLOAD_MERCURE_OPEN':
      return action.eventSource;

    case 'BILL_CUSTOMER_DOWNLOAD_RESET':
      return null;

    default:
      return state;
  }
}

export default combineReducers({ error, loading, retrieved, eventSource });
