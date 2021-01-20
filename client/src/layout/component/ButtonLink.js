import React from "react";
import {Button} from "@material-ui/core";

export const ButtonLink = React.forwardRef((props, ref) => (
  <Button ref={ref} {...props}>{props.children}</Button>
));
