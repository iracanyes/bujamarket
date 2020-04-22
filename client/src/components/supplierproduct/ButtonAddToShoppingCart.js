/**
 * Author: iracanyes
 * Date: 9/21/19
 * Description: Button - Add to shopping cart
 */
/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from 'react';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Form, FormGroup } from 'reactstrap';
import { FormattedMessage } from "react-intl";
import { Link, withRouter } from 'react-router-dom';

class ButtonAddToShoppingCart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      quantity: 1,
      update: false
    };

    this.addToShoppingCart = this.addToShoppingCart.bind(this);
    this.toggle = this.toggle.bind(this);
    this.cancel = this.cancel.bind(this);
    this.changeQuantity = this.changeQuantity.bind(this);
    this.orderNow = this.orderNow.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
  }

  componentDidMount() {
    const { modal, quantity} = this.state;

    this.setState({
      modal: modal,
      quantity: quantity,
      update: false
    });
  }

  orderNow()
  {

    // Redirection vers le panier de commande pour validation
    this.props.history.push('/shopping_cart');
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));

    this.addToShoppingCart();

  }

  addToShoppingCart()
  {
    /* Ajout au  panier de commande dans LocalStorage  */
    let shopping_cart = localStorage.getItem("shopping_cart") !== null ? JSON.parse(localStorage.getItem("shopping_cart")) : [];


    /* Si le panier de commande existe */
    if( shopping_cart.length > 0 )
    {
      /* mise à jour de la quantité pour le produit */
      let index  = shopping_cart.findIndex( value => value.productId === this.props.product.id);
      /* Si le produit exite, on met à jour la quantité */
      if( index !== -1 )
      {
        shopping_cart[index].quantity = this.state.quantity;
      }else{
        /* Sinon, on ajoute un nouveau produit au panier de commande */
        shopping_cart.push({
          'productId': this.props.product.id,
          'title': this.props.product.product.title,
          'description': this.props.product.product.resume,
          'price': this.props.product.finalPrice,
          'quantity': this.state.quantity
        });

      }
    }else{
      /* Si le panier est vide, on ajoute un nouveau produit */
      shopping_cart.push({
        'productId': this.props.product.id,
        'title': this.props.product.product.title,
        'description': this.props.product.product.resume,
        'price': this.props.product.finalPrice,
        'quantity': this.state.quantity
      });

    }

    /* Enregistrement du panier de commande */
    localStorage.removeItem('shopping_cart');
    localStorage.setItem('shopping_cart', JSON.stringify(shopping_cart));
  }

  deleteProduct(id)
  {
    let shopping_cart = localStorage.getItem("shopping_cart") ? JSON.parse(localStorage.getItem("shopping_cart")) : [];

    let index = shopping_cart.findIndex(value => value.id === id);
    // Suppression du produit dans le panier de commande
    shopping_cart.splice(index, 1);
    // Mise à jour du panier de commade
    if(shopping_cart.length > 0)
    {
      localStorage.removeItem('shopping_cart');
      localStorage.setItem('shopping_cart', JSON.stringify(shopping_cart));
      this.setState({update: true});
    }else{
      this.toggle();
    }



  }


  cancel(){


    /* Annuler l'ajout au  panier de commande dans LocalStorage  */
    let shopping_cart = localStorage.getItem("shopping_cart") !== null ? JSON.parse(localStorage.getItem("shopping_cart")) : [];

    /* Index du dernier produit ajouté */
    let index  = shopping_cart.findIndex( value => value.productId === this.props.product.id);

    /* Suppression de l'élément */
    shopping_cart.splice(index, 1);

    /* Mise à jour du panier de commande dans LocalStorage */
    localStorage.removeItem('shopping_cart');
    localStorage.setItem('shopping_cart', JSON.stringify(shopping_cart));


    this.setState(prevState => ({
      modal: !prevState.modal
    }));

  }

  changeQuantity(e) {
    let value = e.target.value;
    this.setState({ quantity: value });
  }

  render() {
    let shopping_cart = localStorage.getItem("shopping_cart") ? JSON.parse(localStorage.getItem("shopping_cart")) : [];

    let sum = 0;
    shopping_cart.forEach( item => sum += parseFloat(item.price) * item.quantity );

    return (
      <div>
        <Form inline id={"add-shopping-cart"} onSubmit={(e) => e.preventDefault()}>
          <FormGroup className={'w-100'}>
            <Label for="quantity" className={"mr-2"}>
              <FormattedMessage  id={"app.form.quantity"}
                                 defaultMessage="Quantité"
                                 description=" Shopping cart - quantity"
              />
            </Label>{' '}
            <Input type="number" min={1} name="quantity" id="quantity" className={"w-100"} onChange={this.changeQuantity} value={this.state.quantity} />

          </FormGroup>
          {' '}
          <Button outline color="success" className={"w-100 my-2"} onClick={this.toggle}>
            <FormattedMessage  id={"app.button.add_shopping_cart"}
                               defaultMessage="Ajouter au panier"
                               description=" Button - Order now"
            />
          </Button>
          <Link to={'/shopping_cart'} className={"btn btn-outline-danger w-100"} onClick={this.addToShoppingCart}>
            <FormattedMessage  id={"app.button.order_now"}
                               defaultMessage="Commande immédiate"
                               description=" Button - Order now"
            />
          </Link>
        </Form>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} >
          <ModalHeader toggle={this.toggle}>Panier de commande</ModalHeader>
          <ModalBody>
            <h4 className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted">Vos choix</span>
              <span className="badge badge-secondary badge-pill">
                {shopping_cart.length}
              </span>
            </h4>
            <ul className="list-group mb-3">
              {shopping_cart.map( (item, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between lh-condensed">
                  <div className={'col-9'}>
                    <h6 className="my-0">{item.title}</h6>
                    <small className="text-muted">{item.description}</small>
                  </div>
                  <div>
                    <p>
                      <span className="text-muted">
                        { parseFloat(item.price).toFixed(2) + ' €'}
                      </span>
                    </p>
                    <p>
                      {'Quantité: '+ item.quantity}
                    </p>
                    <Button outline color={'danger'} onClick={() => this.deleteProduct(item.id)}>
                      <FormattedMessage  id={"app.button.delete"}
                                         defaultMessage="Supprimer"
                                         description="Button - delete"
                      />
                    </Button>
                  </div>

                </li>
              ))}

              <li className="list-group-item d-flex justify-content-between">
                <span>Total HT (EUR)</span>
                <strong>{parseFloat(sum).toFixed(2) + ' €'}</strong>
              </li>
            </ul>


          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.orderNow}>Commander</Button>{' '}
            <Button color="secondary" onClick={this.cancel}>Annuler</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default withRouter(ButtonAddToShoppingCart);

