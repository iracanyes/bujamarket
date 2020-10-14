/**
 * Author: iracanyes
 * Date: 10/9/19
 * Description: Page - Processus de paiement achevé
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { retrieve as retrievePayment, reset as resetPayment } from '../../actions/payment/show';
import { retrieve as retrieveOrderSet, reset as resetOrderSet } from '../../actions/orderset/show';
import { download } from "../../actions/billcustomer/download";
import {
  Button,
  Spinner
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import { SpinnerLoading } from "../../layout/Spinner";
import {toastError, toastInfo} from "../../layout/ToastMessage";

class PaymentSuccess extends Component {
  static propTypes = {
    retrievedOrderSet: PropTypes.object,
    loadingOrderSet: PropTypes.bool.isRequired,
    errorOrderSet: PropTypes.string,
    eventSourceOrderSet: PropTypes.instanceOf(EventSource),
    retrieveOrderSet: PropTypes.func.isRequired,
    resetOrderSet: PropTypes.func.isRequired,
    retrievedPayment: PropTypes.object,
    loadingPayment: PropTypes.bool.isRequired,
    errorPayment: PropTypes.string,
    eventSourcePayment: PropTypes.instanceOf(EventSource),
    retrievePayment: PropTypes.func.isRequired,
    resetPayment: PropTypes.func.isRequired,
  };

  constructor(props)
  {
    super(props);

    this.state= {
      loadingFile: false,
      errorFile: null,
      downloadSuccessed: false
    };

    this.download = this.download.bind(this);
  }

  componentDidMount() {
    // Suppression du panier de commande
    localStorage.removeItem('shopping_cart');

    // Message d'information
    toastInfo('Ceci est un prorata de facture. Visitez la section "facturation" pour consulter/télécharger la facture de cet achat.', { autoClose: false });

    // Vérification authentification
    if(localStorage.getItem('token') === null)
    {
      this.props.history.push({
        pathname:'../login',
        state: {
          from: this.props.location.pathname,
          params: {
            sessionId: this.props.match.params.sessionId
          }
        }

      });
    }else{
      /* Si la requête contient l'ID de la session Checkout, on récupère la commande et le paiement enregistré en DB */
      if(this.props.match.params.sessionId)
      {
        this.props.retrieveOrderSet(this.props.match.params.sessionId, this.props.history, this.props.location);
        this.props.retrievePayment(this.props.match.params.sessionId, this.props.history, this.props.location);
      }else{
        toastError('Wrong route!');
        this.props.history.push({
          pathname:'login',
        });
      }

    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { errorDownload, retrievedPayment } = this.props;
    if(typeof errorDownload === 'string'){
      toastError(errorDownload);
    }

    if(!retrievedPayment)
    {
      setTimeout(
        () => this.props.retrievePayment(this.props.match.params.sessionId, this.props.history, this.props.location),
        10000
      );
    }
  }


  componentWillUnmount() {
    this.props.resetOrderSet(this.props.eventSourceOrderSet);
    this.props.resetPayment(this.props.eventSourcePayment);
  }

  download(event)
  {
    event.preventDefault();
    this.setState({loadingFile: true});
    this.props.retrievedPayment && this.props.download(this.props.retrievedPayment.bill.url, this.props.history);
  }


  render() {

    const {retrievedOrderSet: orderSet, retrievedPayment: payment, loadingPayment, loadingDownload } = this.props;

    return (
      <div className={"col-9 mx-auto"}>
        <div>
          <div className="col-12 px-0">
            <nav className="navbar navbar-expand-md navbar-dark bg-primary mb-5 no-content w-100">
              {/* Breadcrumb */}
              <div className="col-12 mr-auto">
                <nav aria-label="breadcrumb" className={"w-100 bg-primary text-white"}>
                  <ol className="breadcrumb clearfix d-none d-md-inline-flex p-0 w-100 mb-0 bg-primary">
                    <li>
                      <FormattedMessage  id={"app.page.shopping_card.shopping_card_validation"}
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
                        <FormattedMessage  id={"app.payment"}
                                           defaultMessage="Paiement"
                                           description="App - Payment"
                        />
                      </span>
                      <FontAwesomeIcon icon={'angle-double-right'} className={'mx-2 text-white'} aria-hidden={'true'}/>

                    </li>
                    <li className="breadcrumb-item">
                      <span>
                        <b>
                          <FormattedMessage  id={"app.bill"}
                                             defaultMessage="Facture"
                                             description="App - bill"
                          />
                        </b>
                      </span>
                    </li>
                  </ol>
                </nav>
              </div>
            </nav>
          </div>

        </div>
        { this.props.loadingOrderSet && (<SpinnerLoading message={'Chargement en cours'}/>)}
        { orderSet && (
          <div>
            { payment && (
              <div id={'download-button'}>
                { loadingPayment
                  ? (
                     <Spinner type={'grow'} color={'info'}/>
                  )
                  : (
                    <Button variant={'contained'}
                            color={"primary"}
                            type={'button'}
                            style={{verticalAlign: "top"}}
                            disabled={loadingDownload}
                            onClick={this.download}
                    >
                      <FormattedMessage
                        id={'app.button.download'}
                        defaultMessage={'Télécharger'}
                        description={'Button - Download'}
                      />
                    </Button>
                  )
                }

                {loadingDownload && (<Spinner type={'grow'} color="info" className={'ml-2'}/>)}
                <Link to={'/'} type={'button'} className={'btn btn-outline-secondary border-secondary float-right'}>Retour page d'accueil</Link>
              </div>
            )}

            <div className="col-12 mb-lg-2">
              <h2 className="text-center">Facture client</h2>
            </div>

            <div>
              <section className={'mb-lg-2'}>
                <div className="row">
                  <div className="col">
                    <a target="_blank" href={process.env.REACT_APP_HOST_URL}  rel="noopener noreferrer">
                      <img src={"/assets/img/logo.png"} className="img-thumbnail rounded" data-holder-rendered="true" alt={"Buja Market"} />
                    </a>
                  </div>
                  <div className="col-sm text-right">
                    <h6 className="name">
                      <a target="_blank" href={process.env.REACT_APP_HOST_URL}  rel="noopener noreferrer">
                        Buja market
                      </a>
                    </h6>
                    <div>{ process.env.REACT_APP_OWNER_ADDRESS }</div>
                    <div>{ process.env.REACT_APP_OWNER_PHONE_NUMBER }</div>
                    <div>{ process.env.REACT_APP_OWNER_CONTACT_EMAIL }</div>
                  </div>
                </div>
              </section>
              <section className="d-block my-3 p-0">
                <div className="row p-0">
                  <div className="col text-left">
                    <div className="text-gray-light">
                      <strong>
                        <FormattedMessage  id={"app.bill.invoice_to"}
                                           defaultMessage="Destinataire"
                                           description=" Invoice - invoice to"
                        />
                      </strong>
                    </div>
                    <strong className="to">
                      {payment && (payment.bill.customer.firstname + ' ' + payment.bill.customer.firstname)}
                    </strong>
                    <div className="">
                      {orderSet && orderSet.address.street + ' ' + orderSet.address.number + ","}<br/>
                      {orderSet && (orderSet.address.town + " " + orderSet.address.zipCode)}<br/>
                      {orderSet && orderSet.address.state + ", " + orderSet.address.country }
                    </div>
                    <div className=""><a href="mailto:john@example.com">{payment && payment.bill.customer.email}</a></div>
                  </div>
                  <div className="col mb-0 text-right">
                    <div className="text-gray-light">
                      <strong>Référence :</strong>
                    </div>
                    <strong className="">{ payment && payment.bill.reference }</strong>
                    <div className="">Date de facturation : { payment && new Date(payment.dateCreated).toLocaleString('fr-FR') }</div>

                    <div className="">Date d'échéance : { payment &&  new Date(new Date(payment.dateCreated).getTime() + 864000000).toLocaleString('fr-FR') }</div>
                  </div>
                </div>
                <table className={"table table-light my-2 p-0"} style={{fontSize: "0.8rem"}}>
                  <thead>
                  <tr>
                    <th>#</th>
                    <th scope="col" className="text-left">Description</th>
                    <th scope="col" className="text-center">Prix</th>
                    <th scope="col" className="text-center">Quantité</th>
                    <th scope="col" className="text-center">Total</th>
                  </tr>
                  </thead>
                  <tbody>
                  {orderSet && orderSet.orderDetails.map((item, index) => (
                    <tr key={index}>
                      <td className="no">{index + 1}</td>
                      <td className="text-left">
                        <strong>
                          <span>
                            {item.supplierProduct.product.title}
                          </span>
                        </strong>
                      </td>
                      <td className="text-right">{parseFloat(item.unitCost).toFixed(2) + " €"}</td>
                      <td className="text-right">{item.quantity}</td>
                      <td className="text-right">{parseFloat(item.totalCost).toFixed(2) + " €"}</td>
                    </tr>
                  ))}



                  </tbody>

                  {payment && (
                    <tfoot>
                    <tr>
                      <td colSpan="2"></td>
                      <td colSpan="2" className="text-left">Total HTVA</td>
                      <td className="text-right">{parseFloat(payment.bill.totalExclTax).toFixed(2) + " €"}</td>
                    </tr>
                    <tr>
                      <td colSpan="2"></td>
                      <td colSpan="2" className="text-left">TVA { payment.bill.vatRateUsed }%</td>
                      <td className="text-right">{ parseFloat(payment.bill.totalExclTax * payment.bill.vatRateUsed ).toFixed(2) + " €"}</td>
                    </tr>
                    <tr>
                      <td colSpan="2"></td>
                      <td colSpan="2" className="text-left">Total TVAC</td>
                      <td className="text-right">{ parseFloat( payment.bill.totalInclTax).toFixed(2) + " €" }</td>
                    </tr>
                    </tfoot>
                  )}

                </table>
                <div className="my-lg-2">Au plaisir!</div>
                <div className="mt-lg-3">
                  <h6>Notice:</h6>
                  <p>
                    <a href={ process.env.APP_HOST_URL + "/conditions_generales"}>Les conditions générales</a> comportent principalement des dispositions relatives au délai de livraison ou d’exécution, au délai de payement, aux sanctions en cas de retard ou de défaut de payement à l’échéance, au droit applicable et à la juridiction compétente en cas de litige.
                  </p>
                </div>
              </section>
            </div>
          </div>
        )}


      </div>

    );
  }

  renderLinks = (type, items) => {
    if (Array.isArray(items)) {
      return items.map((item, i) => (
        <div key={i}>{this.renderLinks(type, item)}</div>
      ));
    }

    return (
      <Link to={`../../${type}/show/${encodeURIComponent(items)}`}>
        {items}
      </Link>
    );
  };
}

const mapStateToProps = state => ({
  retrievedOrderSet: state.orderset.show.retrieved,
  errorOrderSet: state.orderset.show.error,
  loadingOrderSet: state.orderset.show.loading,
  eventSourceOrderSet: state.orderset.show.eventSource,
  retrievedPayment: state.payment.show.retrieved,
  errorPayment: state.payment.show.error,
  loadingPayment: state.payment.show.loading,
  eventSourcePayment: state.orderset.show.eventSource,
  loadingDownload: state.billcustomer.download.loading,
  errorDownload: state.billcustomer.download.error,
});

const mapDispatchToProps = dispatch => ({
  retrieveOrderSet: (id, history, location) => dispatch(retrieveOrderSet(id, history, location)),
  retrievePayment: (id, history, location) => dispatch(retrievePayment(id, history, location)),
  resetOrderSet: eventSourceOrderSet => dispatch(resetOrderSet(eventSourceOrderSet)),
  resetPayment: eventSourcePayment => dispatch(resetPayment(eventSourcePayment)),
  download: (values, history) => dispatch(download(values, history))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaymentSuccess);
