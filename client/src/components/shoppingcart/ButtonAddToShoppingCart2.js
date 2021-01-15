/**
 * Author: iracanyes
 * Date: 21/02/2020
 * Description: Button - Add to shopping cart
 */
import React, { Component } from 'react';
import PropTypes from "prop-types";
import {
  Button,
  Modal,
  Paper,
  Card,
  CardMedia,
  CardContent,
  Typography,
  withStyles
} from "@material-ui/core";
import ButtonAddToShoppingCart from "../supplierproduct/ButtonAddToShoppingCart";
import {MdAddShoppingCart, TiShoppingCart} from "react-icons/all";
import {FormattedMessage} from "react-intl";

const styles = theme => ({
  modal: {
    position: 'relative',
    backgroundColor: "rgba(255, 255, 255, 0.30)",
  },
  paper: {
    width: '40%',
    position: 'absolute',
    left: '25%',
    bottom: '25%',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3 )
  },
  title: {
    fontFamily: 'Montserrat',
    fontWeight: 700,
    textAlign: 'center'
  },
  cardItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  cardMedia: {
    height: '56px',
    width: '56px',
    margin: theme.spacing(2),
    borderRadius: '10%',
    boxShadow: theme.shadows[4]
  },
  cardItemTitle: {
    fontFamily: 'Raleway'
  }
});

class ButtonAddToShoppingCart2 extends Component{
  static propTypes = {
    classes: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);

    this.state  = { show: false };
    this.toggle = this.toggle.bind(this);
  }

  toggle()
  {
    this.setState({show: !this.state.show });
  }

  render()
  {
    const { classes, product } = this.props;

    return (
      <div id={'shopping-cart-actions'}>
        <Button
          color={'primary'}
          variant={'contained'}
          startIcon={<TiShoppingCart/>}
          className={'border-primary'}
          onClick={this.toggle}
        >
          <FormattedMessage
            id={'app.button.add_shopping_cart'}
            defaultMessage={'Ajouter au panier'}
            description={'App - Add to shopping cart'}
          />
        </Button>
        <Modal
          open={this.state.show}
          onClose={this.toggle}
          className={classes.modal}
        >
          <Paper elevation={3} className={classes.paper}>
            <Card  className={'mx-2'}>
              <Typography variant={'h5'} className={classes.title}>
                <FormattedMessage
                  id={"app.button.shopping_cart"}
                  defaultMessage={"Panier de commande"}
                  description={"App - Shopping Cart"}
                />
              </Typography>
              <CardContent>
                <div className={classes.cardItem}>
                  <CardMedia
                    title={product.product.title}
                    image={product.images[0].url}
                    className={classes.cardMedia}
                  />
                  <div className={classes.cardItemText}>
                    <Typography variant={'h6'} className={classes.cardItemTitle}>
                      {product.product.title}
                    </Typography>
                  </div>
                </div>
                <ButtonAddToShoppingCart toggle={() => this.toggle()} product={this.props.product}/>
              </CardContent>
            </Card>
          </Paper>
        </Modal>
      </div>
    );
  }

}

export default withStyles(styles)(ButtonAddToShoppingCart2);
