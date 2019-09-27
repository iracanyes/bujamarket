/**
 * Author: iracanyes
 * Date: 9/21/19
 * Description: Button - Add to shopping card
 */
/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Form, FormGroup } from 'reactstrap';
import { FormattedMessage } from "react-intl";

class ButtonAddShoppingCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      quantity: 1
    };

    this.toggle = this.toggle.bind(this);
    this.cancel = this.cancel.bind(this);
    this.changeQuantity = this.changeQuantity.bind(this);
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));

    /* Ajout au  panier de commande dans LocalStorage  */
    let shopping_card = localStorage.getItem("shopping_card") !== null ? JSON.parse(localStorage.getItem("shopping_card")) : [];

    console.log("shopping_card", shopping_card);
    console.log("product", this.props.product);

    /* Si le panier de commande existe */
    if( shopping_card.length > 0 )
    {
      /* mise à jour de la quantité pour le produit */
      let index  = shopping_card.findIndex( value => value.productId === this.props.product.id);
      /* Si le produit exite, on met à jour la quantité */
      if( index !== -1 )
      {
        shopping_card[index].quantity = this.state.quantity;
      }else{
        /* Sinon, on ajoute un nouveau produit au panier de commande */
        shopping_card.push({
          'productId': this.props.product.id,
          'title': this.props.product.product.title,
          'description': this.props.product.product.resume,
          'price': this.props.product.initialPrice,
          'quantity': this.state.quantity
        });

      }
    }else{
      /* Si le panier est vide, on ajoute un nouveau produit */
      shopping_card.push({
        'productId': this.props.product.id,
        'title': this.props.product.product.title,
        'description': this.props.product.product.resume,
        'price': this.props.product.initialPrice,
        'quantity': this.state.quantity
      });

    }

    /* Enregistrement du panier de commande */
    localStorage.removeItem('shopping_card');
    localStorage.setItem('shopping_card', JSON.stringify(shopping_card));

  }

  cancel(){
    this.setState(prevState => ({
      modal: !prevState.modal
    }));

    /* Annuler l'ajout au  panier de commande dans LocalStorage  */
    let shopping_card = localStorage.getItem("shopping_card") !== null ? JSON.parse(localStorage.getItem("shopping_card")) : [];

    /* Index du dernier produit ajouté */
    let index  = shopping_card.findIndex( value => value.productId === this.props.product.id);

    /* Suppression de l'élément */
    shopping_card.splice(index, 1);

    /* Mise à jour du panier de commande dans LocalStorage */
    localStorage.removeItem('shopping_card');
    localStorage.setItem('shopping_card', JSON.stringify(shopping_card));

  }

  changeQuantity(e) {
    let value = e.target.value;
    this.setState({ quantity: value });
  }

  render() {
    let shopping_card = localStorage.getItem("shopping_card") ? JSON.parse(localStorage.getItem("shopping_card")) : [];

    let sum = 0;
    shopping_card.forEach( item => sum += parseFloat(item.price) * item.quantity );

    return (
      <div>
        <Form inline onSubmit={(e) => e.preventDefault()}>
          <FormGroup className={'w-100'}>
            <Label for="quantity" className={"mr-2"}>
              <FormattedMessage  id={"app.form.quantity"}
                                 defaultMessage="Quantité"
                                 description=" Shopping card - quantity"
              />
            </Label>{' '}
            <Input type="number" min={1} name="quantity" id="quantity" className={"w-100"} onChange={this.changeQuantity} value={this.state.quantity} />

          </FormGroup>
          {' '}
          <Button outline color="success" className={"w-100 my-2"} onClick={this.toggle}>{this.props.buttonLabel}</Button>
        </Form>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} >
          <ModalHeader toggle={this.toggle}>Panier de commande</ModalHeader>
          <ModalBody>
            <h4 className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted">Vos choix</span>
              <span className="badge badge-secondary badge-pill">
                {shopping_card.length}
              </span>
            </h4>
            <ul className="list-group mb-3">
              {shopping_card.map( (item, index) => (
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
            <Button color="primary" onClick={this.toggle}>Commander</Button>{' '}
            <Button color="secondary" onClick={this.cancel}>Annuler</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default ButtonAddShoppingCard;
