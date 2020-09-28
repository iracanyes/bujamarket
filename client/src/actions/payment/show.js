import {
  fetch,
  extractHubURL,
  normalize,
  mercureSubscribe as subscribe
} from '../../utils/dataAccess';
import authHeader from "../../utils/authHeader";

export function error(error) {
  return { type: 'PAYMENT_SHOW_ERROR', error };
}

export function loading(loading) {
  return { type: 'PAYMENT_SHOW_LOADING', loading };
}

export function success(retrieved) {
  return { type: 'PAYMENT_SHOW_SUCCESS', retrieved };
}

export function retrieve(id, history, location) {
  return dispatch => {
    dispatch(loading(true));

    let headers = authHeader(history, location);

    return fetch('payment_success', { method: 'POST', headers: headers, body: JSON.stringify({sessionId: id}) })
      .then(response =>
        response
          .json()
          .then(retrieved => ({ retrieved, hubURL: extractHubURL(response) }))
      )
      .then(({ retrieved, hubURL }) => {
        retrieved = normalize(retrieved);

        dispatch(loading(false));
        dispatch(success(retrieved));

        if (hubURL) dispatch(mercureSubscribe(hubURL, retrieved['@id']));


      })
      .catch(e => {
        dispatch(loading(false));

        switch (true){
          case e.code === 401:
            dispatch(error('Authentification nécessaire!'));
            history.push({pathname: '../../login', state: { from: location.pathname, params: { sessionId : id}  }});
            break;
          case typeof e['hydra:description'] === "string":
          case typeof e.message === "string":
            console.log("erreur : ", e);
            dispatch(error("Une erreur est survenue durant la confirmation du paiement! Visitez vos commandes pour voir le statut de cette achat."));
            break;
        }

      });
  };
}

export function reset(eventSource) {
  return dispatch => {
    if (eventSource) eventSource.close();

    dispatch({ type: 'PAYMENT_SHOW_RESET' });
    dispatch(error(null));
    dispatch(loading(false));
  };
}

export function mercureSubscribe(hubURL, topic) {
  return dispatch => {
    const eventSource = subscribe(hubURL, [topic]);
    dispatch(mercureOpen(eventSource));
    eventSource.addEventListener('message', event =>
      dispatch(mercureMessage(normalize(JSON.parse(event.data))))
    );
  };
}

export function mercureOpen(eventSource) {
  return { type: 'PAYMENT_SHOW_MERCURE_OPEN', eventSource };
}

export function mercureMessage(retrieved) {
  return dispatch => {
    if (1 === Object.keys(retrieved).length) {
      dispatch({ type: 'PAYMENT_SHOW_MERCURE_DELETED', retrieved });
      return;
    }

    dispatch({ type: 'PAYMENT_SHOW_MERCURE_MESSAGE', retrieved });
  };
}
