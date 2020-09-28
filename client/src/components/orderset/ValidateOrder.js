import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { retrieve, reset } from '../../actions/orderset/show';
import { create } from '../../actions/payment/create';
import {
  Button,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import EuVat from '../../config/EuVat/rate.json';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StoreCheckoutButton from "../payment/StoreCheckoutButton";

const stripePromise = loadStripe(`${process.env.REACT_APP_STRIPE_PUBLIC_KEY}`);

class ValidateOrder extends Component {
  static propTypes = {
    retrieved: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    eventSource: PropTypes.instanceOf(EventSource),
    retrieve: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
  };

  constructor(props)
  {
    super(props);


  }

  componentDidMount() {
    if(localStorage.getItem('token') === null  )
    {
      if(this.props.location.state){
        this.props.history.push({
          pathname:'../../login',
          state: {
            from: this.props.location.pathname,
            params: {
              orderSet: this.props.location.state.params.orderSet ? this.props.location.state.params.orderSet : null
            }
          }

        });
      }else{
        this.props.history.push({pathname: '../../login'});
      }

    }
  }

  componentWillUnmount() {
    this.props.reset(this.props.eventSource);
  }

  render() {
    let item = {};

    /* Index de la liste de commande */
    let orderSetKey = 1;

    /* Récupération de l'ensemble de commande */
    if(this.props.location.state && this.props.location.state.params !== null){
      item = this.props.location.state.params.orderSet;
      console.log('render - props location state', item);
    }else{
      if(sessionStorage.getItem('my_order'))
      {
        item = JSON.parse(sessionStorage.getItem('my_order'));
        console.log('render - session_storage.my_order_set', item);
      }else{
        this.props.history.push({pathname: 'shopping_cart', state:{from: this.props.location.pathname, params: this.props.location.state.params}});
      }
    }


    return (
      <div className={"col-8 mx-auto"}>
        <div>
          <div className="col-12 px-0">
            <nav className="navbar navbar-expand-md navbar-dark bg-primary mb-5 no-content w-100">
              {/* Breadcrumb */}
              <div className="col-12 mr-auto">
                <nav aria-label="breadcrumb" className={"w-100 bg-primary text-white"}>
                  <ol className="breadcrumb clearfix d-none d-md-inline-flex p-0 w-100 mb-0 bg-primary">
                    <li className="">
                      <FormattedMessage  id={"app.page.shopping_cart.shopping_cart_validation"}
                                         defaultMessage="Validation du panier de commande"
                                         description="App - Delivery address"
                      />
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
                        <b>
                          <FormattedMessage  id={"app.payment"}
                                             defaultMessage="Paiement"
                                             description="App - Payment"
                          />
                        </b>
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

        {item.id && (
          <div className={"order-md-4 my-4"}>
            <h4 className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted">Votre commande</span>
              <span className="badge badge-secondary badge-pill">{item && item.orderDetails.length}</span>
            </h4>
            <ListGroup>
              {item && item.orderDetails.map((item, index) => (
                <ListGroupItem className={'d-flex'} key={orderSetKey++}>
                  <div className="col-9">
                    <ListGroupItemHeading>{item.supplierProduct.product.title}</ListGroupItemHeading>
                    <ListGroupItemText>
                      {item.supplierProduct.product.description}
                    </ListGroupItemText>
                  </div>
                  <div>
                    <p>
                      <span className="text-muted">{ parseFloat(item.unitCost).toFixed(2)  + ' €'}</span>
                    </p>
                    <p>
                      <FormattedMessage  id={"app.form.quantity"}
                                         defaultMessage="Quantité"
                                         description="Form - quantity"
                      />
                      &nbsp;:&nbsp;
                      {item.quantity}
                    </p>
                  </div>
                </ListGroupItem>
              ))}
              <ListGroupItem className={'d-flex'} key={orderSetKey++}>
                <div className="col-9">
                  <ListGroupItemText>
                    {"Total HTVA"}
                  </ListGroupItemText>
                </div>
                <div>
                  <p>
                    <span className="text-muted">{ parseFloat(item.totalCost).toFixed(2)  + ' €'}</span>
                  </p>
                </div>
              </ListGroupItem>
              <ListGroupItem className={'d-flex'} key={orderSetKey++}>
                <div className="col-9">
                  <ListGroupItemText>
                    {"TVA"}
                  </ListGroupItemText>
                </div>
                <div>
                  <p>
                    <span className="text-muted">{ parseFloat(item.totalCost * (0.0)).toFixed(2)  + ' €'}</span>
                  </p>
                </div>
              </ListGroupItem>
              <ListGroupItem className={'d-flex'} key={orderSetKey++}>
                <div className="col-9">

                  <ListGroupItemText>
                    {"Coût de transport"}
                  </ListGroupItemText>
                </div>
                <div>
                  <p>
                    <span className="text-muted">{ parseFloat(item.deliverySet.shippingCost || 0).toFixed(2)  + ' €'}</span>
                  </p>
                </div>
              </ListGroupItem>
              <ListGroupItem className={'d-flex'} key={orderSetKey++}>
                <div className="col-9">
                  <ListGroupItemText>
                    {"Total TVAC"}
                  </ListGroupItemText>
                </div>
                <div>
                  <p>
                    <span className="text-muted">{ parseFloat((item.totalCost * 1.0) + (item.deliverySet.shippingCost || 0)).toFixed(2)  + ' €'}</span>
                  </p>
                </div>
              </ListGroupItem>
            </ListGroup>
            <Elements stripe={stripePromise}>
              <StoreCheckoutButton location={this.props.location} history={this.props.history}/>
            </Elements>

          </div>
        )}

      </div>

    );
  }

}

const mapStateToProps = state => ({
  retrieved: state.orderset.show.retrieved,
  error: state.orderset.show.error,
  loading: state.orderset.show.loading,
  eventSource: state.orderset.show.eventSource,
});

const mapDispatchToProps = dispatch => ({
  retrieve: id => dispatch(retrieve(id)),
  create: (id, history, location, stripe) => dispatch(create(id, history, location, stripe)),
  reset: eventSource => dispatch(reset(eventSource))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ValidateOrder);
