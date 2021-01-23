import React from "react";
import {Button} from "@material-ui/core";

export const ButtonLink = React.forwardRef((props, ref) => {
  const {navigate, ...rest} = props;
  return <Button ref={ref} {...rest}>{props.children}</Button>;
});
