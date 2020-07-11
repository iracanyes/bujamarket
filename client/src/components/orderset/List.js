import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { list, reset } from '../../actions/orderset/list';
import {FormattedMessage, injectIntl } from "react-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Card,
  CardTitle,
  Container,
  Table,
  Modal,
  ModalHeader,
  ModalBody
} from "reactstrap";

class List extends Component {
  static propTypes = {
    retrieved: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    eventSource: PropTypes.instanceOf(EventSource),
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
        nextProps.history,
        nextProps.location
      );
  }

  componentWillUnmount() {
    this.props.reset(this.props.eventSource);
  }

  render() {
    const { loading } = this.props;


    return (
      <div>
        <Container>
          <h1>
            <FormattedMessage
              id={'app.order.history'}
              defaultMessage={"Historique des commandes"}
              description={"Order - History"}
            />
          </h1>
          <table className="table table-responsive table-striped table-hover">
            <thead>
            <tr>
              <th>id</th>
              <th>dateCreated</th>
              <th>totalWeight</th>
              <th>nbPackage</th>
              <th>totalCost</th>
              <th>customer</th>
              <th>billCustomer</th>
              <th>deliveryGlobal</th>
              <th>orderDetails</th>
              <th colSpan={2} >Actions</th>
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
                <td>{item['dateCreated']}</td>
                <td>{item['totalWeight']}</td>
                <td>{item['nbPackage']}</td>
                <td>{item['totalCost']}</td>
                <td>{this.renderLinks('users', item['customer'])}</td>
                <td>{this.renderLinks('bills', item['billCustomer'])}</td>
                <td>{this.renderLinks('delivery_globals', item['deliveryGlobal'])}</td>
                <td>{this.renderLinks('order_details', item['orderDetails'])}</td>
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
        </Container>



        {this.pagination()}
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
  } = state.orderset.list;
  return { retrieved, loading, error, eventSource, deletedItem };
};

const mapDispatchToProps = dispatch => ({
  list: (page, history, location) => dispatch(list(page, history, location)),
  reset: eventSource => dispatch(reset(eventSource))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(List);
