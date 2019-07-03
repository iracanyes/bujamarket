import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { search, reset } from '../../actions/supplier/search';

class Search extends Component {
  static propTypes = {
    page: PropTypes.number,
    retrieved: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    eventSource: PropTypes.instanceOf(EventSource),
    deletedItem: PropTypes.object,
    search: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired
  };

  componentDidMount() {
    let headers = new Headers({
      "Content-Type": "application/ld+json",
      "Accept": "application/ld+json"
    });

    let options = {
      method: "GET",
      headers: headers
    };

    let route = decodeURIComponent(window.location.search);

    this.props.search(
      "suppliers" + route,
      options
    );
  }

  componentWillReceiveProps(nextProps) {
    let options = {method: "GET"};

    if(this.props.page !== nextProps.page)
      nextProps.search(
        "suppliers" + decodeURIComponent(window.location.search) + "page=" + nextProps.page,
        options

      )
  }

  componentWillUnmount() {
    this.props.reset(this.props.eventSource);
  }

  render() {
    return (
      <div>
        <h1>Recherche : Fournisseur</h1>

        {this.props.loading && (
          <div className="alert alert-info">Loading...</div>
        )}
        {this.props.deletedItem && (
          <div className="alert alert-success">
            {this.props.deletedItem['@id']} deleted.
          </div>
        )}
        {this.props.error && (
          <div className="alert alert-danger">{this.props.error}</div>
        )}

        <p>
          <Link to="create" className="btn btn-primary">
            Create
          </Link>
        </p>

        <table className="table table-responsive table-striped table-hover">
          <thead>
            <tr>
              <th>id</th>
              <th>userType</th>
              <th>socialReason</th>
              <th>tradeRegisterNumber</th>
              <th>vatNumber</th>
              <th>contactFullname</th>
              <th>contactPhoneNumber</th>
              <th>contactEmail</th>
              <th>website</th>
              <th>supplierProducts</th>
              <th>supplierBills</th>
              <th>supplierKey</th>
              <th>email</th>
              <th>username</th>
              <th>roles</th>
              <th>plainPassword</th>
              <th>password</th>
              <th>salt</th>
              <th>firstname</th>
              <th>lastname</th>
              <th>nbErrorConnection</th>
              <th>banned</th>
              <th>signinConfirmed</th>
              <th>dateRegistration</th>
              <th>language</th>
              <th>currency</th>
              <th>image</th>
              <th>addresses</th>
              <th>bankAccounts</th>
              <th>forums</th>
              <th>messages</th>
              <th colSpan={2} />
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
                  <td>{item['userType']}</td>
                  <td>{item['socialReason']}</td>
                  <td>{item['tradeRegisterNumber']}</td>
                  <td>{item['vatNumber']}</td>
                  <td>{item['contactFullname']}</td>
                  <td>{item['contactPhoneNumber']}</td>
                  <td>{item['contactEmail']}</td>
                  <td>{item['website']}</td>
                  <td>{this.renderLinks('supplier_products', item['supplierProducts'])}</td>
                  <td>{this.renderLinks('bills', item['supplierBills'])}</td>
                  <td>{item['supplierKey']}</td>
                  <td>{item['email']}</td>
                  <td>{item['username']}</td>
                  <td>{item['roles']}</td>
                  <td>{item['plainPassword']}</td>
                  <td>{item['password']}</td>
                  <td>{item['salt']}</td>
                  <td>{item['firstname']}</td>
                  <td>{item['lastname']}</td>
                  <td>{item['nbErrorConnection']}</td>
                  <td>{item['banned']}</td>
                  <td>{item['signinConfirmed']}</td>
                  <td>{item['dateRegistration']}</td>
                  <td>{item['language']}</td>
                  <td>{item['currency']}</td>
                  <td>{this.renderLinks('images', item['image'])}</td>
                  <td>{this.renderLinks('addresses', item['addresses'])}</td>
                  <td>{this.renderLinks('bank_accounts', item['bankAccounts'])}</td>
                  <td>{this.renderLinks('forums', item['forums'])}</td>
                  <td>{this.renderLinks('messages', item['messages'])}</td>
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
  } = state.supplier.search;
  return { retrieved, loading, error, eventSource, deletedItem };
};

const mapDispatchToProps = dispatch => ({
  search: (page, options) => dispatch(search(page, options)),
  reset: eventSource => dispatch(reset(eventSource))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);
