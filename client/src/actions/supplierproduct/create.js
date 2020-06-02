import React from "react";
import { toast } from "react-toastify";
import { ToastSuccess, ToastError } from "../../layout/ToastMessage";
import { SubmissionError } from 'redux-form';
import { fetch } from '../../utils/dataAccess';

export function error(error) {
  return { type: 'SUPPLIERPRODUCT_CREATE_ERROR', error };
}

export function loading(loading) {
  return { type: 'SUPPLIERPRODUCT_CREATE_LOADING', loading };
}

export function success(created) {
  return { type: 'SUPPLIERPRODUCT_CREATE_SUCCESS', created };
}

export function create(values, history) {
  return dispatch => {
    dispatch(loading(true));

    /* Récupération de la clé JWT et ajout au header de la requête */
    const userToken = JSON.parse(localStorage.getItem('token'));
    let headers = new Headers();
    if(userToken === null)
    {
      history.push({pathname: '../../login', state: { from : window.location.pathname }});
    }else{
      /* Création du header de la requête */

      headers.set('Authorization', 'Bearer ' + userToken.token);

    }

    //headers.set('Content-Type', "multipart/form-data; charset=utf-8;");


    return fetch('supplier_product/create', { method: 'POST', headers: headers, body: values })
      .then(response => {
        dispatch(loading(false));

        return response.json();
      })
      .then(retrieved => {
        dispatch(success(retrieved));

        toast(
          <ToastSuccess message={"Nouveau produit crée!"} />,
          {type: "default"}
        );

        history.push({pathname: '../show/'+ retrieved.id });
      })
      .catch(e => {
        dispatch(loading(false));

        if (e instanceof SubmissionError) {
          dispatch(error(e.errors._error));
          throw e;
        }


        if(/Access Denied/.test(e.message))
        {
          toast(
            <ToastError message={"Accès refusé!"} />,
            { type: "default" }
          );
          history.push({pathname: '../../', state: {from : window.location.pathname}});
        }

        if(/Unauthorized/.test(e.message))
        {
          toast(
            <ToastError message={"Identification nécessaire avant l'ajout de produit!"} />,
            { type: "default" }
          );
          history.push({ pathname: '../../login', state: { from: window.location.pathname }})
        }

        dispatch(error(e.message));
      });
  };
}

export function reset() {
  return dispatch => {
    dispatch(loading(false));
    dispatch(error(null));
  };
}
