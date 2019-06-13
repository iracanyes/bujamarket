import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { retrieve, reset } from '../../actions/bill/show';
import { del } from '../../actions/bill/delete';

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
                <th scope="row">status</th>
                <td>{item['status']}</td>
              </tr>
              <tr>
                <th scope="row">dateCreated</th>
                <td>{item['dateCreated']}</td>
              </tr>
              <tr>
                <th scope="row">datePayment</th>
                <td>{item['datePayment']}</td>
              </tr>
              <tr>
                <th scope="row">currencyUsed</th>
                <td>{item['currencyUsed']}</td>
              </tr>
              <tr>
                <th scope="row">vatRateUsed</th>
                <td>{item['vatRateUsed']}</td>
              </tr>
              <tr>
                <th scope="row">totalExclTax</th>
                <td>{item['totalExclTax']}</td>
              </tr>
              <tr>
                <th scope="row">totalInclTax</th>
                <td>{item['totalInclTax']}</td>
              </tr>
              <tr>
                <th scope="row">url</th>
                <td>{item['url']}</td>
              </tr>
              <tr>
                <th scope="row">payment</th>
                <td>{this.renderLinks('payments', item['payment'])}</td>
              </tr>
              <tr>
                <th scope="row">reason</th>
                <td>{item['reason']}</td>
              </tr>
              <tr>
                <th scope="row">description</th>
                <td>{item['description']}</td>
              </tr>
              <tr>
                <th scope="row">additionalCost</th>
                <td>{item['additionalCost']}</td>
              </tr>
              <tr>
                <th scope="row">additionalFee</th>
                <td>{item['additionalFee']}</td>
              </tr>
              <tr>
                <th scope="row">additionalInformation</th>
                <td>{item['additionalInformation']}</td>
              </tr>
              <tr>
                <th scope="row">orderReturned</th>
                <td>{this.renderLinks('order_returneds', item['orderReturned'])}</td>
              </tr>
              <tr>
                <th scope="row">withdrawal</th>
                <td>{this.renderLinks('withdrawals', item['withdrawal'])}</td>
              </tr>
              <tr>
                <th scope="row">customer</th>
                <td>{this.renderLinks('users', item['customer'])}</td>
              </tr>
              <tr>
                <th scope="row">validator</th>
                <td>{this.renderLinks('admins', item['validator'])}</td>
              </tr>
            </tbody>
          </table>
        )}
        <Link to=".." className="btn btn-primary">
          Back to list
        </Link>
        {item && (
          <Link to={`/bills/edit/${encodeURIComponent(item['@id'])}`}>
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
  retrieved: state.bill.show.retrieved,
  error: state.bill.show.error,
  loading: state.bill.show.loading,
  eventSource: state.bill.show.eventSource,
  deleteError: state.bill.del.error,
  deleteLoading: state.bill.del.loading,
  deleted: state.bill.del.deleted
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
