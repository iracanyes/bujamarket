import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import SupplierProductForm from './SupplierProductForm';
import { create, reset } from '../../actions/supplierproduct/create';

class Create extends Component {
  static propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    created: PropTypes.object,
    create: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired
  };

  componentWillUnmount() {
    this.props.reset();
  }

  render() {
    if (this.props.created)
      return (
        <Redirect
          to={`edit/${encodeURIComponent(this.props.created['@id'])}`}
        />
      );

    const user = localStorage.getItem('token') && JSON.parse(localStorage.getItem('token'));
    console.log('user', user);

    return (
      <div>
        <h1>Proposer un produit à la vente</h1>

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

        <SupplierProductForm values={this.props.item} />

      </div>
    );
  }
}

const mapStateToProps = state => {
  const { created, error, loading } = state.supplierproduct.create;
  return { created, error, loading };
};

const mapDispatchToProps = dispatch => ({
  create: values => dispatch(create(values)),
  reset: () => dispatch(reset())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Create);
