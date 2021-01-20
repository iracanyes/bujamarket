import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FormattedMessage, injectIntl } from "react-intl";
import PropTypes from 'prop-types';
import { list, reset } from '../../actions/orderdetail/list';
import { toastError } from "../../layout/component/ToastMessage";
import Alert from "../../layout/component/Alert";
import {
  Container,
} from "reactstrap";
import { SpinnerLoading } from "../../layout/component/Spinner";
import TableSupplierOrders from "./TableSupplierOrders";

class List extends Component {
  static propTypes = {
    retrieved: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    eventSource: PropTypes.instanceOf(EventSource),
    deletedItem: PropTypes.object,
    list: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.list(
      this.props.match.params.page &&
        decodeURIComponent(this.props.match.params.page),
      this.props.history,
      this.props.location
    );
  }

  componentDidUpdate(nextProps) {
    if (this.props.match.params.page !== nextProps.match.params.page)
      nextProps.list(
        nextProps.match.params.page &&
          decodeURIComponent(nextProps.match.params.page),
        this.props.history,
        this.props.location
      );
  }

  componentWillUnmount() {
    this.props.reset(this.props.eventSource);
  }

  render() {
    const {loading, retrieved, error, intl } = this.props;

    error && toastError(error);

    return (
      <div>
        <Container>
          <h1>
            <FormattedMessage
              id={'app.order_detail.history'}
              defaultMessage={"Historique des commandes clients"}
              descriptionm={"Order detail - orders' history"}
            />
          </h1>

          {this.props.loading && (
            <SpinnerLoading
              message={intl.formatMessage({
                id: 'app.order_detail.customer_orders_history_loading',
                defaultMessage: "Chargement de l'historique des commandes clients",
                description: "Loading - Customer orders history"
              })}
            />
          )}
          {!loading && (
            (retrieved && retrieved['hydra:member'].length > 0)
              ? (
                <TableSupplierOrders my_orders={retrieved['hydra:member']}/>
              )
              : (
                <Alert severity={'info'}>
                  <FormattedMessage
                    id={'app.message.supplier_orders.not_found'}
                    defaultMessage={"Aucune commande client pour vos produits n'a été effectué"}
                    description={"Message - Supplier product's orders not found"}
                  />
                </Alert>
              )
          )}
        </Container>
      </div>
    );
  }

}

const mapStateToProps = state => {
  const {
    retrieved,
    loading,
    error,
    eventSource,
    deletedItem
  } = state.orderdetail.list;
  return { retrieved, loading, error, eventSource, deletedItem };
};

const mapDispatchToProps = dispatch => ({
  list: (page, history, location) => dispatch(list(page, history, location)),
  reset: eventSource => dispatch(reset(eventSource))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(injectIntl(List)));
