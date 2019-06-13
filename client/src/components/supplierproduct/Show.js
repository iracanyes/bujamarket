import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { retrieve, reset } from '../../actions/supplierproduct/show';
import { del } from '../../actions/supplierproduct/delete';

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
                <th scope="row">initialPrice</th>
                <td>{item['initialPrice']}</td>
              </tr>
              <tr>
                <th scope="row">quantity</th>
                <td>{item['quantity']}</td>
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
                <th scope="row">isAvailable</th>
                <td>{item['isAvailable']}</td>
              </tr>
              <tr>
                <th scope="row">isLimited</th>
                <td>{item['isLimited']}</td>
              </tr>
              <tr>
                <th scope="row">supplier</th>
                <td>{this.renderLinks('suppliers', item['supplier'])}</td>
              </tr>
              <tr>
                <th scope="row">product</th>
                <td>{this.renderLinks('products', item['product'])}</td>
              </tr>
              <tr>
                <th scope="row">comments</th>
                <td>{this.renderLinks('comments', item['comments'])}</td>
              </tr>
              <tr>
                <th scope="row">favorites</th>
                <td>{this.renderLinks('favorites', item['favorites'])}</td>
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
          <Link to={`/supplier_products/edit/${encodeURIComponent(item['@id'])}`}>
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
  retrieved: state.supplierproduct.show.retrieved,
  error: state.supplierproduct.show.error,
  loading: state.supplierproduct.show.loading,
  eventSource: state.supplierproduct.show.eventSource,
  deleteError: state.supplierproduct.del.error,
  deleteLoading: state.supplierproduct.del.loading,
  deleted: state.supplierproduct.del.deleted
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
