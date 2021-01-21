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

const styles = theme => ({
  root: {},
  breadcrumbs:{
    display: 'flex',
    flexDirection: 'row'
  }
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
            <Breadcrumbs separator={'>>'} aria-label={'breadcrumb'}>
              <Link
                to={'../../shopping_cart'}
                component={ButtonLink}
              >
                <FormattedMessage
                  id={'app.page.shopping_cart.shopping_cart_validation'}
                  defaultMessage={"Validation du panier de commande"}
                />
              </Link>
              <Link
                to={'../../delivery_address'}
                component={ButtonLink}
              >
                <FormattedMessage
                  id={"app.address.item.location_name.delivery_address"}
                  defaultMessage={"Adresse de livraison"}
                />
              </Link>
              <Link
                to={'../../shipment_rate'}
                component={ButtonLink}
              >
                <FormattedMessage
                  id={"app.shipping"}
                  defaultMessage={"Transport"}
                />
              </Link>
              <Link
                to={'../../validate_order'}
                component={ButtonLink}
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

          </Grid>
        </Grid>
      </Fragment>
    );
  }
}

export default connect(null, null)(withRouter(withStyles(styles)(ShipmentRate)));
