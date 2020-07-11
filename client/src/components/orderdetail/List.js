import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { FormattedMessage, injectIntl } from "react-intl";
import PropTypes from 'prop-types';
import { list, reset } from '../../actions/orderdetail/list';
import { toastError, toastSuccess } from "../../layout/ToastMessage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Container,
  Table,
} from "reactstrap";
import { SpinnerLoading } from "../../layout/Spinner";

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
          {this.props.error && (
            <div className="alert alert-danger">{this.props.error}</div>
          )}
          <table className="table table-responsive table-striped table-hover">
            <thead>
            <tr>
              <th>#</th>
              <th>status</th>
              <th>quantity</th>
              <th>unitCost</th>
              <th>totalCost</th>
              <th>orderReturned</th>
              <th>withdrawal</th>
              <th>supplierBill</th>
              <th>deliveryDetail</th>
              <th>supplierProduct</th>
              <th colSpan={2} > Actions </th>
            </tr>
            </thead>
            <tbody>
            {this.props.retrieved &&
            this.props.retrieved['hydra:member'].map(item => (
              <tr key={item['@id']}>
                <th scope="row">
                  <Link to={`show/${encodeURIComponent(item['@id'])}`}>
                    {item['@id']}
                  </Link>
                </th>
                <td>{item['status']}</td>
                <td>{item['quantity']}</td>
                <td>{item['unitCost']}</td>
                <td>{item['totalCost']}</td>
                <td>{this.renderLinks('order_returned', item['orderReturned'])}</td>
                <td>{this.renderLinks('withdrawals', item['withdrawal'])}</td>
                <td>{this.renderLinks('bills', item['supplierBill'])}</td>
                <td>{this.renderLinks('delivery_details', item['deliveryDetail'])}</td>
                <td>{this.renderLinks('supplier_products', item['supplierProduct'])}</td>
                <td>
                  <Link to={`show/${encodeURIComponent(item['@id'])}`}>
                    <span className="fa fa-search" aria-hidden="true" />
                    <span className="sr-only">Show</span>
                  </Link>
                </td>
                <td>
                  <Link to={`edit/${encodeURIComponent(item['@id'])}`}>
                    <span className="fa fa-pencil" aria-hidden="true" />
                    <span className="sr-only">Edit</span>
                  </Link>
                </td>
              </tr>
            ))}
            </tbody>
          </table>

          {this.pagination()}
        </Container>

      </div>
    );
  }

  pagination() {
    const view = this.props.retrieved && this.props.retrieved['hydra:view'];
    if (!view) return;

    const {
      'hydra:first': first,
      'hydra:previous': previous,
      'hydra:next': next,
      'hydra:last': last
    } = view;

    return (
      <nav aria-label="Page navigation">
        <Link
          to="."
          className={`btn btn-primary${previous ? '' : ' disabled'}`}
        >
          <span aria-hidden="true">&lArr;</span> First
        </Link>
        <Link
          to={
            !previous || previous === first ? '.' : encodeURIComponent(previous)
          }
          className={`btn btn-primary${previous ? '' : ' disabled'}`}
        >
          <span aria-hidden="true">&larr;</span> Previous
        </Link>
        <Link
          to={next ? encodeURIComponent(next) : '#'}
          className={`btn btn-primary${next ? '' : ' disabled'}`}
        >
          Next <span aria-hidden="true">&rarr;</span>
        </Link>
        <Link
          to={last ? encodeURIComponent(last) : '#'}
          className={`btn btn-primary${next ? '' : ' disabled'}`}
        >
          Last <span aria-hidden="true">&rArr;</span>
        </Link>
      </nav>
    );
  }

  renderLinks = (type, items) => {
    if (Array.isArray(items)) {
      return items.map((item, i) => (
        <div key={i}>{this.renderLinks(type, item)}</div>
      ));
    }

    return (
      <Link to={`../${type}/show/${encodeURIComponent(items)}`}>{items}</Link>
    );
  };
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
