import React, { Component, Fragment} from "react";
import { connect } from "react-redux";
import {
  Breadcrumbs,
  Button,
  Paper,
  Card,
  Grid,
  withStyles
} from "@material-ui/core";
import { theme } from "../../config/theme";
import {Link, withRouter} from "react-router-dom";
import { ButtonLink } from "../../layout/component/ButtonLink";
import {FormattedMessage} from "react-intl";
import {orange} from "@material-ui/core/colors";

const styles = theme => ({
  root: {
    paddingTop: theme.spacing(5)
  },
  breadcrumbs:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: theme.palette.primary.main,
    "& nav": {
      fontFamily: 'Carter One !important',
      color: 'white'
    }

  },
  buttonLink: {
    fontFamily: 'Montserrat !important',
    color: 'white !important',
    fontWeight: 700,
    "&:hover": {
      color: orange[500] + '!important'
    }
  },
  contentWrapper:{
    marginTop: theme.spacing(4)
  },
  content: {},
  resume: {}
});

class ShipmentRate extends Component
{
  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <Grid
          container
          spacing={2}
          className={classes.root}
        >
          <Grid
            item
            xs={12}
            className={classes.breadcrumbs}
          >
            <Breadcrumbs separator={'>>'} aria-label={'breadcrumbs'}>
              <Link
                to={'../../shopping_cart'}
                component={ButtonLink}
                className={classes.buttonLink}
              >
                <FormattedMessage
                  id={'app.page.shopping_cart.shopping_cart_validation'}
                  defaultMessage={"Validation du panier de commande"}
                />
              </Link>
              <Link
                to={'../../delivery_address'}
                component={ButtonLink}
                className={classes.buttonLink}
              >
                <FormattedMessage
                  id={"app.address.item.location_name.delivery_address"}
                  defaultMessage={"Adresse de livraison"}
                />
              </Link>
              <Link
                to={'../../shipment_rate'}
                component={ButtonLink}
                className={classes.buttonLink}
              >
                <FormattedMessage
                  id={"app.shipping"}
                  defaultMessage={"Transport"}
                />
              </Link>
              <Link
                to={'../../validate_order'}
                component={ButtonLink}
                className={classes.buttonLink}
                disabled={true}
              >
                <FormattedMessage
                  id={"app.button.payments"}
                  defaultMessage={"Paiement"}
                />
              </Link>
              <Link
                to={'../../delivery_address'}
                component={ButtonLink}
                disabled={true}
                className={classes.buttonLink}
              >
                <FormattedMessage
                  id={"app.bill"}
                  defaultMessage={"Facture"}
                />
              </Link>
            </Breadcrumbs>
          </Grid>
          <Grid
            xs={12}
            className={classes.contentWrapper}
          >
            <Grid
              item
              xs={12}
              md={8}
              className={classes.content}
            >
              <Paper
                elevation={3}
                className={classes.contentPaper}
              >
                <Card>

                </Card>
              </Paper>
            </Grid>
            <Grid
              item
              xs={12}
              md={4}
              className={classes.resume}
            >
              <Paper elevation={3} className={classes.resumePaper}>
                <Card>

                </Card>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Fragment>
    );
  }
}

export default connect(null, null)(withRouter(withStyles(styles)(ShipmentRate)));
