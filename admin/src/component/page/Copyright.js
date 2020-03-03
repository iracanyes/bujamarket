

/**
 * Author: iracanyes
 * Date: 11/11/19
 * Description:
 */
import React from "react";
import Typography from "@material-ui/core/Typography";

export default function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <a href="https://material-ui.com/">
        Buja Market
      </a>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}
