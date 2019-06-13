import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { retrieve, reset } from '../../actions/supplier/show';
import { del } from '../../actions/supplier/delete';

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
                <th scope="row">userType</th>
                <td>{item['userType']}</td>
              </tr>
              <tr>
                <th scope="row">socialReason</th>
                <td>{item['socialReason']}</td>
              </tr>
              <tr>
                <th scope="row">tradeRegisterNumber</th>
                <td>{item['tradeRegisterNumber']}</td>
              </tr>
              <tr>
                <th scope="row">vatNumber</th>
                <td>{item['vatNumber']}</td>
              </tr>
              <tr>
                <th scope="row">contactFullname</th>
                <td>{item['contactFullname']}</td>
              </tr>
              <tr>
                <th scope="row">contactPhoneNumber</th>
                <td>{item['contactPhoneNumber']}</td>
              </tr>
              <tr>
                <th scope="row">contactEmail</th>
                <td>{item['contactEmail']}</td>
              </tr>
              <tr>
                <th scope="row">website</th>
                <td>{item['website']}</td>
              </tr>
              <tr>
                <th scope="row">supplierProducts</th>
                <td>{this.renderLinks('supplier_products', item['supplierProducts'])}</td>
              </tr>
              <tr>
                <th scope="row">supplierBills</th>
                <td>{this.renderLinks('bills', item['supplierBills'])}</td>
              </tr>
              <tr>
                <th scope="row">supplierKey</th>
                <td>{item['supplierKey']}</td>
              </tr>
              <tr>
                <th scope="row">email</th>
                <td>{item['email']}</td>
              </tr>
              <tr>
                <th scope="row">username</th>
                <td>{item['username']}</td>
              </tr>
              <tr>
                <th scope="row">roles</th>
                <td>{item['roles']}</td>
              </tr>
              <tr>
                <th scope="row">plainPassword</th>
                <td>{item['plainPassword']}</td>
              </tr>
              <tr>
                <th scope="row">password</th>
                <td>{item['password']}</td>
              </tr>
              <tr>
                <th scope="row">salt</th>
                <td>{item['salt']}</td>
              </tr>
              <tr>
                <th scope="row">firstname</th>
                <td>{item['firstname']}</td>
              </tr>
              <tr>
                <th scope="row">lastname</th>
                <td>{item['lastname']}</td>
              </tr>
              <tr>
                <th scope="row">nbErrorConnection</th>
                <td>{item['nbErrorConnection']}</td>
              </tr>
              <tr>
                <th scope="row">banned</th>
                <td>{item['banned']}</td>
              </tr>
              <tr>
                <th scope="row">signinConfirmed</th>
                <td>{item['signinConfirmed']}</td>
              </tr>
              <tr>
                <th scope="row">dateRegistration</th>
                <td>{item['dateRegistration']}</td>
              </tr>
              <tr>
                <th scope="row">language</th>
                <td>{item['language']}</td>
              </tr>
              <tr>
                <th scope="row">currency</th>
                <td>{item['currency']}</td>
              </tr>
              <tr>
                <th scope="row">image</th>
                <td>{this.renderLinks('images', item['image'])}</td>
              </tr>
              <tr>
                <th scope="row">addresses</th>
                <td>{this.renderLinks('addresses', item['addresses'])}</td>
              </tr>
              <tr>
                <th scope="row">bankAccounts</th>
                <td>{this.renderLinks('bank_accounts', item['bankAccounts'])}</td>
              </tr>
              <tr>
                <th scope="row">forums</th>
                <td>{this.renderLinks('forums', item['forums'])}</td>
              </tr>
              <tr>
                <th scope="row">messages</th>
                <td>{this.renderLinks('messages', item['messages'])}</td>
              </tr>
            </tbody>
          </table>
        )}
        <Link to=".." className="btn btn-primary">
          Back to list
        </Link>
        {item && (
          <Link to={`/suppliers/edit/${encodeURIComponent(item['@id'])}`}>
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
  retrieved: state.supplier.show.retrieved,
  error: state.supplier.show.error,
  loading: state.supplier.show.loading,
  eventSource: state.supplier.show.eventSource,
  deleteError: state.supplier.del.error,
  deleteLoading: state.supplier.del.loading,
  deleted: state.supplier.del.deleted
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
