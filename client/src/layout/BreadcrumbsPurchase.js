import React, { Component, Fragment } from "react";
import {Link} from "react-router-dom";
import {ButtonLink} from "./component/ButtonLink";
import {FormattedMessage} from "react-intl";
import {
  Breadcrumbs,
  withStyles,
  withTheme
} from "@material-ui/core";
import {orange} from "@material-ui/core/colors";

const styles = theme => ({
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
});

class BreadcrumbsPurchase extends Component
{
  render(){
    const { classes, etape } = this.props;

    return (
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
          disabled={etape < 2}
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
          disabled={etape < 3}
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
          disabled={etape < 4}
        >
          <FormattedMessage
            id={"app.button.payments"}
            defaultMessage={"Paiement"}
          />
        </Link>
        <Link
          to={'../../payment_'}
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
    );
  }
}

export default withStyles(styles)(BreadcrumbsPurchase);
