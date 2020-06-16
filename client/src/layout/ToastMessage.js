import React from "react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function ToastError(props){
  return <div><FontAwesomeIcon icon={"exclamation-triangle"} className={"toast-error"} />{props.message}</div>;
}

const toastError = (message) => {
  toast(<div><FontAwesomeIcon icon={"exclamation-triangle"} className={"toast-error"} />{message}</div>);
};

function ToastSuccess(props) {
  return <div><FontAwesomeIcon icon={"thumbs-up"} className={"toast-success"} />{props.message}</div>;
}

const toastSuccess = (message) => {
  toast(<div><FontAwesomeIcon icon={"thumbs-up"} className={"toast-success"} />{message}</div>);
};

function ToastWelcome(props) {
  return <div><FontAwesomeIcon icon={"grin-wink"} className={"toast-welcome"} />{props.message}</div>
}

const toastWelcome = (message) => {
  toast(<div><FontAwesomeIcon icon={"grin-wink"} className={"toast-welcome"} />{message}</div>);
};

function ToastInfo(props) {
  return <div><FontAwesomeIcon icon={"info-circle"} className={"toast-info"} />{props.message}</div>;
}

const toastInfo = (message) => {
  toast(<div><FontAwesomeIcon icon={"info-circle"} className={"toast-info"} />{message}</div>);
};

export { toastError, toastSuccess, toastWelcome, toastInfo, ToastSuccess, ToastError, ToastWelcome, ToastInfo };
