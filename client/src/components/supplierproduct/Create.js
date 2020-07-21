import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import SupplierProductForm from './SupplierProductForm';
import { reset } from '../../actions/supplierproduct/create';
import {SpinnerLoading} from "../../layout/Spinner";
import { injectIntl, FormattedMessage} from "react-intl";
import PublicationRules from "./PublicationRules";

class Create extends Component {
  static propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    created: PropTypes.object,
    eventSource: PropTypes.instanceOf(EventSource),
    reset: PropTypes.func.isRequired
  };

  componentWillUnmount() {
    this.props.reset(this.props.eventSource);
  }

  render() {
    const { error, loading, created } = this.props;

    const user = localStorage.getItem('token')  ? JSON.parse(atob(localStorage.getItem('token').split('.')[1])) : null;

    if(user == null || !user.roles.includes('ROLE_PUBLISHER'))
      return (<PublicationRules />);

    return (
      <div>
        <h1>Proposer un produit à la vente</h1>

        {this.props.loading && (
          <SpinnerLoading message={"Création du produit en cours!"} />
        )}
        <SupplierProductForm />

      </div>
    );
  }
}

const mapStateToProps = state => {
  const { created, error, loading } = state.supplierproduct.create;
  return { created, error, loading };
};

const mapDispatchToProps = dispatch => ({
  reset: eventSource => dispatch(reset(eventSource))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(injectIntl(Create)));
