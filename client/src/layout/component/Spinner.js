import React from "react";
import { Spinner } from "reactstrap";

function SpinnerLoading(props)
{
  return (
    <div className={"spinner-loading " + (props.className || '')}>
      <div className={"spinner-loading-content"}>
        <Spinner color={props.color}/>
      </div>
      <p className={'spinner-loading-message'}>
        <strong>{props.message}</strong>
      </p>
    </div>
  );
}

export { SpinnerLoading };
