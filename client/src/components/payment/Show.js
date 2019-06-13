import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { retrieve, reset } from '../../actions/payment/show';
import { del } from '../../actions/payment/delete';

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
                <th scope="row">reference</th>
                <td>{item['reference']}</td>
              </tr>
              <tr>
                <th scope="row">dateCreated</th>
                <td>{item['dateCreated']}</td>
              </tr>
              <tr>
                <th scope="row">currency</th>
                <td>{item['currency']}</td>
              </tr>
              <tr>
                <th scope="row">description</th>
                <td>{item['description']}</td>
              </tr>
              <tr>
                <th scope="row">status</th>
                <td>{item['status']}</td>
              </tr>
              <tr>
                <th scope="row">amount</th>
                <td>{item['amount']}</td>
              </tr>
              <tr>
                <th scope="row">amountRefund</th>
                <td>{item['amountRefund']}</td>
              </tr>
              <tr>
                <th scope="row">balanceTransaction</th>
                <td>{item['balanceTransaction']}</td>
              </tr>
              <tr>
                <th scope="row">emailReceipt</th>
                <td>{item['emailReceipt']}</td>
              </tr>
              <tr>
                <th scope="row">source</th>
                <td>{item['source']}</td>
              </tr>
              <tr>
                <th scope="row">bill</th>
                <td>{this.renderLinks('bills', item['bill'])}</td>
              </tr>
            </tbody>
          </table>
        )}
        <Link to=".." className="btn btn-primary">
          Back to list
        </Link>
        {item && (
          <Link to={`/payments/edit/${encodeURIComponent(item['@id'])}`}>
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
  retrieved: state.payment.show.retrieved,
  error: state.payment.show.error,
  loading: state.payment.show.loading,
  eventSource: state.payment.show.eventSource,
  deleteError: state.payment.del.error,
  deleteLoading: state.payment.del.loading,
  deleted: state.payment.del.deleted
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
