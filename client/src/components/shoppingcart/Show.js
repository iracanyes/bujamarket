/**
 * Author: iracanyes
 * Date: 9/22/19
 * Description: Shopping cart of the customer
 */
import React from 'react';
import { connect } from 'react-redux';
import {
  Button,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
  Spinner
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import { create } from '../../actions/shoppingcart/create';
import {toastError} from "../../layout/component/ToastMessage";

class Show extends React.Component {
  constructor(props)
  {
    super(props);

    this.state = {
      update: false
    };

    this.deleteProduct = this.deleteProduct.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.setState({update: false});
    if(localStorage.getItem('token') !== null)
    {
      ;
    }else{
      this.props.history.push({ pathname: 'login', state: { from: this.props.location.pathname } });
    }
  }

  deleteProduct(id)
  {
    let shopping_cart = localStorage.getItem("shopping_cart") ? JSON.parse(localStorage.getItem("shopping_cart")) : [];

    let index = shopping_cart.findIndex(value => value.id === id);
    // Suppression du produit dans le panier de commande
    shopping_cart.splice(index, 1);
    // Mise à jour du panier de commade
    localStorage.removeItem('shopping_cart');
    localStorage.setItem('shopping_cart', JSON.stringify(shopping_cart));
    this.props.history.push('shopping_cart');

  }

  onSubmit()
  {
    let locationState = { from : this.props.location.pathname};
    this.props.create(JSON.parse(localStorage.getItem('shopping_cart')), this.props.history, locationState);

  }

  render() {
    const { errorCreate, loadingCreate } = this.props;
    let shopping_cart = localStorage.getItem("shopping_cart") ? JSON.parse(localStorage.getItem("shopping_cart")) : [];

    let sum = 0;
    shopping_cart.forEach( item => sum += parseFloat(item.price) * item.quantity );

    // Affichage des erreurs
    typeof errorCreate === "string" && toastError(errorCreate);

    return (
      <div className={"col-9 mx-auto"}>
        <div>
          <div className="col-12 px-0">
            <nav className="navbar navbar-expand-md navbar-dark bg-primary mb-5 no-content w-100">
              {/* Breadcrumb */}
              <div className="col-12 mr-auto">
                <nav aria-label="breadcrumb" className={"w-100 bg-primary text-white"}>
                  <ol className="breadcrumb clearfix d-none d-md-inline-flex p-0 w-100 mb-0 bg-primary">
                    <li className="">
                        <b>
                          <FormattedMessage  id={"app.page.shopping_cart.shopping_cart_validation"}
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
          <h4 className="d-flex justify-content-between align-items-center mb-3 pl-1">
            <span className="text-muted">Vos choix</span>
            <span className="badge badge-secondary badge-pill">{shopping_cart.length}</span>
          </h4>
          <ListGroup>
            {shopping_cart.map((item, index) => (
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
            {shopping_cart.length > 0 && (
              <Button color={"success"} className={'mr-3 border-success'} onClick={this.onSubmit}>
                {loadingCreate && <Spinner color={'info'} className={'spinner mr-2'}/>}
                <FormattedMessage  id={"app.button.validate"}
                                   defaultMessage="Valider"
                                   description="Button - validate"
                />
              </Button>
            )}

            <Button outline color={"danger border-danger"} onClick={() => this.props.history.goBack()}>
              <FormattedMessage  id={"app.button.return"}
                                 defaultMessage="Retour"
                                 description="Button - return"
              />
            </Button>
          </div>

        </div>
      </div>


    );
  }
}

const mapStateToProps = state => {
  const { error: errorCreate, loading: loadingCreate } = state.shoppingcart.create;

  return { errorCreate, loadingCreate };
};

const mapDispatchToProps = dispatch => ({
  create: (values, history, currentRoute) => dispatch( create(values, history, currentRoute))
});

export default connect(mapStateToProps, mapDispatchToProps)(Show);
