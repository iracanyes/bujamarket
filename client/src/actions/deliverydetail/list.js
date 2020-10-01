import {
  fetch,
  normalize,
  extractHubURL,
  mercureSubscribe as subscribe
} from '../../utils/dataAccess';
import { success as deleteSuccess } from './delete';

export function error(error) {
  return { type: 'DELIVERYDETAIL_LIST_ERROR', error };
}

export function loading(loading) {
  return { type: 'DELIVERYDETAIL_LIST_LOADING', loading };
}

export function success(retrieved) {
  return { type: 'DELIVERYDETAIL_LIST_SUCCESS', retrieved };
}

export function list(page = 'delivery_details') {
  return dispatch => {
    dispatch(loading(true));
    dispatch(error(''));

    fetch(page)
      .then(response =>
        response
          .json()
          .then(retrieved => ({ retrieved, hubURL: extractHubURL(response) }))
      )
      .then(({ retrieved, hubURL }) => {
        retrieved = normalize(retrieved);

        dispatch(loading(false));
        dispatch(success(retrieved));

        if (hubURL && retrieved['hydra:member'].length)
          dispatch(
            mercureSubscribe(
              hubURL,
              retrieved['hydra:member'].map(i => i['@id'])
            )
          );
      })
      .catch(e => {
        dispatch(loading(false));
        switch (true){
          case e.message.length > 0:
            dispatch(error(e.message));
            break;
          case e['hydra:description'].length > 0:
            dispatch(error(e['hydra:description']));
            break;
        }
      });
  };
}

export function reset(eventSource) {
  return dispatch => {
    if (eventSource) eventSource.close();

    dispatch({ type: 'DELIVERYDETAIL_LIST_RESET' });
    dispatch(deleteSuccess(null));
  };
}

export function mercureSubscribe(hubURL, topics) {
  return dispatch => {
    const eventSource = subscribe(hubURL, topics);
    dispatch(mercureOpen(eventSource));
    eventSource.addEventListener('message', event =>
      dispatch(mercureMessage(normalize(JSON.parse(event.data))))
    );
  };
}

export function mercureOpen(eventSource) {
  return { type: 'DELIVERYDETAIL_LIST_MERCURE_OPEN', eventSource };
}

export function mercureMessage(retrieved) {
  return dispatch => {
    if (1 === Object.keys(retrieved).length) {
      dispatch({ type: 'DELIVERYDETAIL_LIST_MERCURE_DELETED', retrieved });
      return;
    }

    dispatch({ type: 'DELIVERYDETAIL_LIST_MERCURE_MESSAGE', retrieved });
  };
}
