import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import SupplierProductForm from './SupplierProductForm';
import { reset, retrieve } from '../../actions/supplierproduct/update';
import { injectIntl, FormattedMessage } from "react-intl";
import {toastError} from "../../layout/component/ToastMessage";
import {SpinnerLoading} from "../../layout/component/Spinner";
import PublicationRules from "./PublicationRules";


class Update extends Component {
  static propTypes = {
    retrieved: PropTypes.object,
    retrieveError: PropTypes.string,
    retrieveLoading: PropTypes.bool.isRequired,
    reset: PropTypes.func.isRequired,
    eventSource: PropTypes.instanceOf(EventSource),
  };

  componentDidMount() {
    !this.props.supplierProduct && this.props.retrieve(this.props.match.params.id);
  }

  componentWillUnmount() {
    this.props.reset(this.props.eventSource);
  }

  render() {
    const { retrieveError } = this.props;

    // Affichage des erreurs
    retrieveError && toastError(retrieveError);

    const user = localStorage.getItem('token')  ? JSON.parse(atob(localStorage.getItem('token').split('.')[1])) : null;

    if(user == null || !user.roles.includes('ROLE_PUBLISHER'))
      return (<PublicationRules />);

    return (
      <div>
        <h1>
          <FormattedMessage
            id={"app.supplier_product.update"}
            defaultMessage={"Mise à jour du produit"}
            description={"Supplier product form - Update title"}
          />
        </h1>

        {this.props.retrieveLoading && (
          <SpinnerLoading message={'Chargement du formulaire de mise à jour du produit'} />
        )}

        {this.props.retrieved && (<SupplierProductForm product={this.props.retrieved} />)}

      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { eventSource, retrieved, retrieveError, retrieveLoading } = state.supplierproduct.update;

  return { retrieved, retrieveError, retrieveLoading, eventSource };
};

const mapDispatchToProps = dispatch => ({
  retrieve: (id) => dispatch(retrieve(id)),
  reset: eventSource => dispatch(reset(eventSource)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)( withRouter(injectIntl(Update)));
