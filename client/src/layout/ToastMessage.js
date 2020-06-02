import React from "react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function ToastError(props){
  return <div><FontAwesomeIcon icon={"exclamation-triangle"} className={"toast-error"} />{props.message}</div>;
}

function ToastSuccess(props) {
  return <div><FontAwesomeIcon icon={"thumbs-up"} className={"toast-success"} />{props.message}</div>;
}

function ToastWelcome(props) {
  return <div><FontAwesomeIcon icon={"grin-wink"} className={"toast-welcome"} />{props.message}</div>
}

export { ToastSuccess, ToastError, ToastWelcome };
