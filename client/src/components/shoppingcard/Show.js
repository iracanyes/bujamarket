/**
 * Author: iracanyes
 * Date: 9/22/19
 * Description: Shopping card of the customer
 */
import React from 'react';
import { connect } from 'react-redux';
import {
  Button,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import { create } from '../../actions/shoppingcard/create';

class Show extends React.Component {
  constructor(props)
  {
    super(props);

    this.deleteProduct = this.deleteProduct.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
    if(localStorage.getItem('token'))
    {
      ;
    }else{
      this.props.history.push('login');
    }
  }

  deleteProduct(id)
  {
    let shopping_card = localStorage.getItem("shopping_card") ? JSON.parse(localStorage.getItem("shopping_card")) : [];

    let index = shopping_card.findIndex(value => value.id === id);
    // Suppression du produit dans le panier de commande
    shopping_card.splice(index, 1);
    // Mise à jour du panier de commade
    localStorage.removeItem('shopping_card');
    localStorage.setItem('shopping_card', JSON.stringify(shopping_card));
    this.props.history.push('shopping_card');

  }

  onSubmit()
  {
    this.props.create(JSON.parse(localStorage.getItem('shopping_card')), this.props.history);

  }

  render() {
    let shopping_card = localStorage.getItem("shopping_card") ? JSON.parse(localStorage.getItem("shopping_card")) : [];

    let sum = 0;
    shopping_card.forEach( item => sum += parseFloat(item.price) * item.quantity );

    return (
      <div className={"col-6 mx-auto"}>
        <div>

          <div className="col-12 px-0">

            <nav className="navbar navbar-expand-md navbar-dark bg-primary mb-5 no-content w-100">
              {/* Breadcrumb */}
              <div className="col-12 mr-auto">
                <nav aria-label="breadcrumb" className={"w-100 bg-primary text-white"}>
                  <ol className="breadcrumb clearfix d-none d-md-inline-flex p-0 w-100 mb-0 bg-primary">
                    <li className="">
                        <b>
                          <FormattedMessage  id={"app.page.shopping_card.shopping_card_validation"}
                                             defaultMessage="Validation du panier de commande"
                                             description="App - Delivery address"
                          />

                        </b>
                      <FontAwesomeIcon icon={'angle-double-right'} className={'mx-2 text-white'} aria-hidden={'true'}/>

                    </li>
                    <li className="">
                      <span className="text-white">
                        <FormattedMessage  id={"app.delivery_address"}
                                           defaultMessage="Adresse de livraison"
                                           description="App - Delivery address"
                        />

                      </span>
                      <FontAwesomeIcon icon={'angle-double-right'} className={'mx-2 text-white'} aria-hidden={'true'}/>

                    </li>
                    <li className="">
                      <span className="text-white" >
                        <FormattedMessage  id={"app.payment"}
                                           defaultMessage="Paiement"
                                           description="App - Payment"
                        />

                      </span>
                      <FontAwesomeIcon icon={'angle-double-right'} className={'mx-2 text-white'} aria-hidden={'true'}/>

                    </li>
                    <li className="breadcrumb-item">
                      <span>
                        <FormattedMessage  id={"app.bill"}
                                           defaultMessage="Facture"
                                           description="App - bill"
                        />
                      </span>
                    </li>
                  </ol>
                </nav>
              </div>

            </nav>

          </div>

        </div>
        <div className={"order-md-4 my-4"}>
          <h4 className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-muted">Vos choix</span>
            <span className="badge badge-secondary badge-pill">{shopping_card.length}</span>
          </h4>
          <ListGroup>
            {shopping_card.map((item, index) => (
              <ListGroupItem className={'d-flex'} key={index}>
                <div className="col-9">
                  <ListGroupItemHeading>{item.title}</ListGroupItemHeading>
                  <ListGroupItemText>
                    {item.description}
                  </ListGroupItemText>
                </div>
                <div>
                  <p>
                    <span className="text-muted">{ parseFloat(item.price).toFixed(2)  + ' €'}</span>
                  </p>
                  <p>
                    <FormattedMessage  id={"app.form.quantity"}
                                       defaultMessage="Quantité"
                                       description="Form - quantity"
                    />
                    &nbsp;:&nbsp;
                    {item.quantity}
                  </p>
                  <Button outline color={'danger'} onClick={() => this.deleteProduct(item.id)}>
                    <FormattedMessage  id={"app.button.delete"}
                                       defaultMessage="Supprimer"
                                       description="Button - delete"
                    />
                  </Button>
                </div>
              </ListGroupItem>
            ))}
          </ListGroup>
          <div className="col-4 d-flex mx-auto mt-3">
            {shopping_card.length > 0 && (
              <Button outline color={"success"} className={'mr-3'} onClick={this.onSubmit}>
                <FormattedMessage  id={"app.button.validate"}
                                   defaultMessage="Valider"
                                   description="Button - validate"
                />
              </Button>
            )}

            <Button outline color={"danger"} onClick={() => this.props.history.push('..')}>
              <FormattedMessage  id={"app.button.cancel"}
                                 defaultMessage="Annuler"
                                 description="Button - cancel"
              />
            </Button>
          </div>

        </div>
      </div>


    );
  }
}

const mapDispatchToProps = dispatch => ({
  create: (values, history) => dispatch( create(values, history))
});

export default connect(null, mapDispatchToProps)(Show);
