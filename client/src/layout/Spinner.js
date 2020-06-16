import React from "react";
import { Spinner } from "reactstrap";

function SpinnerLoading(props)
{
  return (
    <div className={"spinner-loading"}>
      <div className={"spinner-loading-content"}>
        <Spinner color={"primary"}/>
      </div>
      <p className={'spinner-loading-message'}>
        <strong>{props.message}</strong>
      </p>
    </div>
  );
}

export { SpinnerLoading };
