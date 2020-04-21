/**
 * Author: iracanyes
 * Date: 21/02/2020
 * Description: Button - Add to shopping card
 */
import React, { Component } from 'react';
import { Button, Toast, ToastBody, ToastHeader } from 'reactstrap';
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
      <div>

        <div  onClick={this.toggle}>
          <FontAwesomeIcon icon="shopping-cart" className="menu-top-l1" />
          <span data-toggle="Bookmarked" className={'ml-1'}>Ajouter au panier</span>
        </div>
        <Toast isOpen={this.state.show} id={"toast-shopping-cart"}>
          <ToastHeader toggle={this.toggle}>Toast title</ToastHeader>
          <ToastBody>
            <ButtonAddToShoppingCart toggle={this.toggle} product={this.props.product}/>
          </ToastBody>
        </Toast>
      </div>
    );
  }

}

export default ButtonAddToShoppingCart2;
