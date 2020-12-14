/**
 * Author: Iracanye S.
 * Date: 31/07/2019
 * Description: Redux Action : Category - list
 */
import {
  fetch,
  normalize,
  extractHubURL,
  mercureSubscribe as subscribe
} from '../../utils/dataAccess';
import { success as deleteSuccess } from './delete';

export function error(error) {
  return { type: 'CATEGORY_NAMES_WITH_IMAGE_LIST_ERROR', error };
}

export function loading(loading) {
  return { type: 'CATEGORY_NAMES_WITH_IMAGE_LIST_LOADING', loading };
}

export function success(retrieved) {
  return { type: 'CATEGORY_NAMES_WITH_IMAGE_LIST_SUCCESS', retrieved };
}


export function getNamesWithImage(page = 'category_names_with_image') {
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
          case typeof e.message === "string":
            dispatch(error(e.message));
            break;
          case typeof e['hydra:description'] === "string":
            dispatch(error(e['hydra:description']));
            break;
          default:
            dispatch(error(e));
            break;
        }
      });
  };
}

export function reset(eventSource) {
  return dispatch => {
    if (eventSource) eventSource.close();

    dispatch({ type: 'CATEGORY_NAMES_WITH_IMAGE_LIST_RESET' });
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
  return { type: 'CATEGORY_NAMES_WITH_IMAGE_LIST_MERCURE_OPEN', eventSource };
}

export function mercureMessage(retrieved) {
  return dispatch => {
    if (1 === Object.keys(retrieved).length) {
      dispatch({ type: 'CATEGORY_NAMES_WITH_IMAGE_LIST_MERCURE_DELETED', retrieved });
      return;
    }

    dispatch({ type: 'CATEGORY_NAMES_WITH_IMAGE_LIST_MERCURE_MESSAGE', retrieved });
  };
}
