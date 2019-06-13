import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { retrieve, reset } from '../../actions/orderglobal/show';
import { del } from '../../actions/orderglobal/delete';

class Show extends Component {
  static propTypes = {
    retrieved: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    eventSource: PropTypes.instanceOf(EventSource),
    retrieve: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    deleteError: PropTypes.string,
    deleteLoading: PropTypes.bool.isRequired,
    deleted: PropTypes.object,
    del: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.retrieve(decodeURIComponent(this.props.match.params.id));
  }

  componentWillUnmount() {
    this.props.reset(this.props.eventSource);
  }

  del = () => {
    if (window.confirm('Are you sure you want to delete this item?'))
      this.props.del(this.props.retrieved);
  };

  render() {
    if (this.props.deleted) return <Redirect to=".." />;

    const item = this.props.retrieved;

    return (
      <div>
        <h1>Show {item && item['@id']}</h1>

        {this.props.loading && (
          <div className="alert alert-info" role="status">
            Loading...
          </div>
        )}
        {this.props.error && (
          <div className="alert alert-danger" role="alert">
            <span className="fa fa-exclamation-triangle" aria-hidden="true" />{' '}
            {this.props.error}
          </div>
        )}
        {this.props.deleteError && (
          <div className="alert alert-danger" role="alert">
            <span className="fa fa-exclamation-triangle" aria-hidden="true" />{' '}
            {this.props.deleteError}
          </div>
        )}

        {item && (
          <table className="table table-responsive table-striped table-hover">
            <thead>
              <tr>
                <th>Field</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">dateCreated</th>
                <td>{item['dateCreated']}</td>
              </tr>
              <tr>
                <th scope="row">totalWeight</th>
                <td>{item['totalWeight']}</td>
              </tr>
              <tr>
                <th scope="row">nbPackage</th>
                <td>{item['nbPackage']}</td>
              </tr>
              <tr>
                <th scope="row">totalCost</th>
                <td>{item['totalCost']}</td>
              </tr>
              <tr>
                <th scope="row">customer</th>
                <td>{this.renderLinks('users', item['customer'])}</td>
              </tr>
              <tr>
                <th scope="row">billCustomer</th>
                <td>{this.renderLinks('bills', item['billCustomer'])}</td>
              </tr>
              <tr>
                <th scope="row">deliveryGlobal</th>
                <td>{this.renderLinks('delivery_globals', item['deliveryGlobal'])}</td>
              </tr>
              <tr>
                <th scope="row">orderDetails</th>
                <td>{this.renderLinks('order_details', item['orderDetails'])}</td>
              </tr>
            </tbody>
          </table>
        )}
        <Link to=".." className="btn btn-primary">
          Back to list
        </Link>
        {item && (
          <Link to={`/order_globals/edit/${encodeURIComponent(item['@id'])}`}>
            <button className="btn btn-warning">Edit</button>
          </Link>
        )}
        <button onClick={this.del} className="btn btn-danger">
          Delete
        </button>
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
  retrieved: state.orderglobal.show.retrieved,
  error: state.orderglobal.show.error,
  loading: state.orderglobal.show.loading,
  eventSource: state.orderglobal.show.eventSource,
  deleteError: state.orderglobal.del.error,
  deleteLoading: state.orderglobal.del.loading,
  deleted: state.orderglobal.del.deleted
});

const mapDispatchToProps = dispatch => ({
  retrieve: id => dispatch(retrieve(id)),
  del: item => dispatch(del(item)),
  reset: eventSource => dispatch(reset(eventSource))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Show);
