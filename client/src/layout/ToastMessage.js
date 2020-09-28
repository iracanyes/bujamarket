import React from "react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function ToastError(props){
  return <div><FontAwesomeIcon icon={"exclamation-triangle"} className={"toast-error text-danger"} />{props.message}</div>;
}

const toastError = (message) => {
  toast(<div><FontAwesomeIcon icon={"exclamation-triangle"} className={"toast-error text-danger"} />{message}</div>);
};

function ToastSuccess(props) {
  return <div><FontAwesomeIcon icon={"thumbs-up"} className={"toast-success text-success"} />{props.message}</div>;
}

const toastSuccess = (message) => {
  toast(<div><FontAwesomeIcon icon={"thumbs-up"} className={"toast-success text-success"} />{message}</div>);
};

function ToastWelcome(props) {
  return <div><FontAwesomeIcon icon={"grin-wink"} className={"toast-welcome"} />{props.message}</div>
}

const toastWelcome = (message) => {
  toast(<div><FontAwesomeIcon icon={"grin-wink"} className={"toast-welcome-icon"} />{message}</div>);
};

function ToastInfo(props) {
  return <div><FontAwesomeIcon icon={"info-circle"} className={"toast-info text-info"} />{props.message}</div>;
}

const toastInfo = (message, options = null) => {
  toast(<div><FontAwesomeIcon icon={"info-circle"} className={"toast-info text-info"} />{message}</div>, options !== null ? options : undefined);
};

const toastStripePaymentInfo = (message, options) => {
  toast(
    <ToastInfo message={(<p>En cliquant sur "Effectuer le paiement", vous serez redirigé vers la plateforme de paiement en ligne sécurisé <a
      href="https://stripe.com/fr-be/customers">Stripe</a>.<br/>À la fin du processus de paiement, vous serez redirigé vers la page suivante : Facture.</p> )} />,
    {
      autoClose: false,
    }
  );
};

export { toastError, toastSuccess, toastWelcome, toastInfo, ToastSuccess, ToastError, ToastWelcome, ToastInfo, toastStripePaymentInfo };
