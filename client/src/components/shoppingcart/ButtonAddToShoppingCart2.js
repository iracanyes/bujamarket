/**
 * Author: iracanyes
 * Date: 21/02/2020
 * Description: Button - Add to shopping cart
 */
import React, { Component } from 'react';
import { Button, Toast, ToastBody, ToastHeader } from 'reactstrap';
import {
  Modal,
  Paper,
  Card,
  CardContent,
  CardActions,
  Typography
} from "@material-ui/core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import ButtonAddToShoppingCart from "../supplierproduct/ButtonAddToShoppingCart";

class ButtonAddToShoppingCart2 extends Component{
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
    return (
      <div id={'shopping-cart-actions'}>
        <Button outline color={'primary'} className={'border-primary'} onClick={this.toggle}>
          <FontAwesomeIcon icon="shopping-cart" className="menu-top-l1" />
          <span data-toggle="Bookmarked" className={'ml-2'}>Ajouter</span>
        </Button>
        <Modal
          open={this.state.show}
          onClose={this.toggle}
          id={"toast-shopping-cart"}
        >
          <Paper elevation={3}>
            <Card  className={'mx-2'}>
              <Typography variant={'h6'}>Panier de commande</Typography>
              <CardContent>
                <ButtonAddToShoppingCart toggle={() => this.toggle()} product={this.props.product}/>
              </CardContent>
            </Card>
          </Paper>
        </Modal>
      </div>
    );
  }

}

export default ButtonAddToShoppingCart2;
