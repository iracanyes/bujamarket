import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { injectIntl, FormattedMessage } from "react-intl";
import PropTypes from 'prop-types';
import { retrieveBySupplier, reset } from '../../actions/supplierproduct/listBySupplier';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container, Button } from "reactstrap";
import {toastError, toastSuccess} from "../../layout/component/ToastMessage";
import {SpinnerLoading} from "../../layout/component/Spinner";
import { del } from "../../actions/supplierproduct/delete";
import PublicationRules from "./PublicationRules";

class SupplierList extends Component {
  static propTypes = {
    retrieved: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    deleted: PropTypes.bool,
    deleteError: PropTypes.string,
    deleteLoading: PropTypes.bool,
    error: PropTypes.string,
    eventSource: PropTypes.instanceOf(EventSource),
    retrieveBySupplier: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.retrieveBySupplier(
      this.props.match.params.page &&
        decodeURIComponent(this.props.match.params.page),
      this.props.history,
      this.props.location
    );
  }

  componentDidUpdate(nextProps) {
    if (this.props.match.params.page !== nextProps.match.params.page)
      nextProps.retrieveBySupplier(
        nextProps.match.params.page &&
          decodeURIComponent(nextProps.match.params.page),
        this.props.history,
        this.props.location
      );
  }

  componentWillUnmount() {
    this.props.reset(this.props.eventSource);
  }

  render() {
    const { error, deleted, deleteError, intl } = this.props;

    const user = localStorage.getItem('token')  ? JSON.parse(atob(localStorage.getItem('token').split('.')[1])) : null;

    if(user == null || !user.roles.includes('ROLE_PUBLISHER'))
      return (<PublicationRules />);

    //Affichage des erreurs
    error && toastError(error);
    deleteError && toastError(deleteError);

    deleted && toastSuccess(intl.formatMessage({
      id: "app.supplier_product.deleted",
      defaultMessage: "Le produit a été supprimé",
      description: "Supplier product - Deleted"
    }));


    return (
      <div>
        <Container id={'supplier-product-list'}>
          <div className={'container-title'}>
            <h1>
              <FormattedMessage
                id={"app.your_products"}
                defaultMessage={"Vos produits"}
                description={"Supplier product - your products"}
              />
            </h1>
            <Button id={'add-product'}>
              <FormattedMessage
                id={"app.button.add_product"}
                defaultMessage={"Ajouter un produit"}
              />
            </Button>
          </div>

          {this.props.loading && (
            <SpinnerLoading message={"Chargement de vos produits"} />
          )}

          <table id={'supplier-product-list-tab'} className="table table-responsive table-striped table-hover">
            <thead>
            <tr>
              <th>#</th>
              <th className={'product-name'}>
                <FormattedMessage
                  id={"app.product.item.title"}
                  defaultMessage={"Nom du produit"}
                />
              </th>
              <th>
                <FormattedMessage
                  id={"app.supplier_product.item.initial_price"}
                  defaultMessage={"Prix initial"}
                />
              </th>
              <th>
                <FormattedMessage
                  id={"app.supplier_product.item.additional_fee"}
                  defaultMessage={"Taxes additionnelles (en %)"}
                />
              </th>
              <th>
                <FormattedMessage
                  id={"app.supplier_product.item.is_available"}
                  defaultMessage={"Disponible"}
                />
              </th>
              <th>
                <FormattedMessage
                  id={"app.supplier_product.item.is_limited"}
                  defaultMessage={"Limité"}
                />
              </th>
              <th>
                <FormattedMessage
                  id={"app.form.quantity"}
                  defaultMessage={"Quantité"}
                />
              </th>
              <th>
                <FormattedMessage
                  id={"app.supplier_product.item.sell_price"}
                  defaultMessage={"Prix de vente"}
                />
              </th>
              <th>
                <FormattedMessage
                  id={"app.supplier_product.item.nb_comments"}
                  defaultMessage={"Nombre de commentaires"}
                />
              </th>
              <th>
                <FormattedMessage
                  id={"app.supplier_product.item.nb_likes"}
                  defaultMessage={"Nombre de likes"}
                />
              </th>
              <th>
                <FormattedMessage
                  id={"app.supplier_product.item.nb_orders"}
                  defaultMessage={"Nombre de commandes"}
                />
              </th>
              <th>
                <FormattedMessage id={"app.actions"} defaultMessage={"Actions"}/>
              </th>
            </tr>
            </thead>
            <tbody>
            {this.props.retrieved &&
            this.props.retrieved['hydra:member'].map(item => (
              <tr key={item['@id']}>
                <th scope="row">
                  <Link to={`show/${encodeURIComponent(item['@id'])}`}>
                    {item['id']}
                  </Link>
                </th>
                <td className={'product-name'}>
                  { item['product']['title']}
                </td>
                <td>
                  {item['initialPrice']}
                  &nbsp;
                  {}
                </td>
                <td>
                  {item['additionalFee']}
                </td>
                <td className={'text-center'}>
                  {
                    item['isAvailable']
                      ? <FontAwesomeIcon icon={"check-circle"} className={'text-success'}/>
                      : <FontAwesomeIcon icon={"times-circle"} className={'text-danger'} />
                  }
                </td>
                <td className={'text-center'}>
                  {
                    item['isLimited']
                      ? <FontAwesomeIcon icon={"check-circle"} className={'text-success'}/>
                      : <FontAwesomeIcon icon={"times-circle"} className={'text-danger'} />
                  }
                </td>
                <td>{item['quantity']}</td>
                <td>{ item['finalPrice'] }</td>
                <td>{item['nbComments']}</td>
                <td>{item['nbLikes']}</td>
                <td>{item['nbOrders']}</td>
                <td className={'btn-actions'}>
                  <div>
                    <Link className={'btn btn-outline-primary'} to={`supplier_product/show/${item['id']}`}>
                      <FontAwesomeIcon icon={'search'} className={'mr-2'} />
                      <span>
                        <FormattedMessage
                          id={"app.button.show"}
                          defaultMessage={"Voir"}
                        />
                      </span>
                    </Link>
                    <Link className={'btn btn-outline-success'} to={`supplier_product/edit/${encodeURIComponent(item['id'])}`}>
                      <FontAwesomeIcon icon={"edit"} className={'mr-2'} />
                      <span>
                        <FormattedMessage
                          id={"app.button.edit"}
                          defaultMessage={"Modifier"}
                        />
                      </span>
                    </Link>
                    <Button
                      className={'btn-outline-danger'}
                      onClick={() => this.props.delete(item, this.props.history, this.props.location)}
                    >
                      <FontAwesomeIcon icon={'times-circle'} className={'mr-2'} />
                      <FormattedMessage
                        id={"app.button.delete"}
                        defaultMessage={"Supprimer"}
                      />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            </tbody>
          </table>

          {this.pagination()}
        </Container>
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

}

const mapStateToProps = state => {
  const {
    retrieved,
    loading,
    error,
    eventSource
  } = state.supplierproduct.listBySupplier;
  const { deleted, error: deleteError, loading: deleteLoading } = state.supplierproduct.del;

  return { retrieved, loading, error, eventSource, deleted, deleteError, deleteLoading };
};

const mapDispatchToProps = dispatch => ({
  retrieveBySupplier: (page, history, location) => dispatch(retrieveBySupplier(page, history, location)),
  reset: eventSource => dispatch(reset(eventSource)),
  delete: (item, history, location) => dispatch(del(item, history, location))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(injectIntl(SupplierList)));
