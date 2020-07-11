/**
 * Author: iracanyes
 * Date: 28/06/2020
 * Description: Authorization header bearer
 * Ajouter l'en-tête Authorization : Bearer $token
 */
import React from 'react';
import { withRouter } from "react-router-dom";
import {toastError} from "../layout/ToastMessage";

function authHeader(history, location) {
  const token = localStorage.getItem('token') !== null ? JSON.parse(localStorage.getItem("token")) : null;

  if(token === null)
  {
    history.push({pathname:'../../login', state: { from: location.pathname }});
    toastError('Authentification nécessaire');
  }


  const headers = new Headers({ 'Content-Type': 'application/ld+json'});
  token && headers.set('Authorization','Bearer '+ token.token)

  return headers;

}

export default  authHeader;
