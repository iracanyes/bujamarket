import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { list, reset } from '../../actions/favorite/list';
import { del } from "../../actions/favorite/delete";
import {
  Button,
  ButtonGroup,
  Spinner
} from "reactstrap";
import {FormattedMessage} from "react-intl";
import ButtonAddToShoppingCart2 from "../shoppingcart/ButtonAddToShoppingCart2";

class List extends Component {
  static propTypes = {
    retrieved: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    eventSource: PropTypes.instanceOf(EventSource),
    deletedItem: PropTypes.object,
    list: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      updated: false
    };


    this.addToShoppingCart = this.addToShoppingCart.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
    this.buyNow = this.buyNow.bind(this);


  }

  componentDidMount() {
    this.props.list(
      "my_favorites",
      this.props.history
    );
  }

  componentDidUpdate(nextProps) {
    if (this.props.match.params.page !== nextProps.match.params.page)
      nextProps.list(
        nextProps.match.params.page &&
          decodeURIComponent(nextProps.match.params.page)
      );
  }

  componentWillUnmount() {
    this.props.reset(this.props.eventSource);
  }

  addToShoppingCart(item = {})
  {
    /* Ajout au  panier de commande dans LocalStorage  */
    let shopping_cart = localStorage.getItem("shopping_cart") !== null ? JSON.parse(localStorage.getItem("shopping_cart")) : [];


    /* Si le panier de commande existe */
    if( shopping_cart.length > 0 )
    {
      console.log("addToShoppingCart item", item);
      /* mise à jour de la quantité pour le produit */
      let index  = shopping_cart.findIndex( value => value.productId === item.supplierProduct.id);
      /* Si le produit exite, on met à jour la quantité */
      if( index !== -1 )
      {
        shopping_cart[index].quantity = this.state.quantity;
      }else{
        /* Sinon, on ajoute un nouveau produit au panier de commande */
        shopping_cart.push({
          'productId': item.supplierProduct.id,
          'title': item.supplierProduct.product.title,
          'description': item.supplierProduct.product.resume,
          'price': item.supplierProduct.finalPrice,
          'quantity': 1
        });

      }
    }else{
      /* Si le panier est vide, on ajoute un nouveau produit */
      shopping_cart.push({
        'productId': item.supplierProduct.id,
        'title': item.supplierProduct.product.title,
        'description': item.supplierProduct.product.resume,
        'price': item.supplierProduct.finalPrice,
        'quantity': 1
      });

    }

    /* Enregistrement du panier de commande */
    localStorage.removeItem('shopping_cart');
    localStorage.setItem('shopping_cart', JSON.stringify(shopping_cart));
    window.location.reload();

  }

  deleteProduct(id)
  {
    this.props.delete(id, this.props.history);
    this.setState(prevState => ({updated: !prevState.updated }));

  }

  buyNow(item={})
  {
    this.addToShoppingCart(item);
    this.props.history.push({pathname: "/shopping_cart"});
  }

  render() {
    const { retrieved, error, loading } = this.props;

    
    const favorites = retrieved && retrieved['hydra:member'];

    return (
      <div>
        <h1>Vos favoris</h1>

        {loading && (
          <div className="alert alert-light col-lg-3 mx-auto" role="status">
            <Spinner type={'grow'} color={'info'} className={'mx-auto'}/>
            <strong className={'mx-2 align-baseline'} style={{fontSize: '1.75rem'}}>
              <FormattedMessage id={'app.loading'}
                                defaultMessage={'Chargement en cours'}
                                description={'App - Loading'}
              />
            </strong>
          </div>
        )}
        {this.props.deletedItem && (
          <div className="alert alert-success">
            {this.props.deletedItem['@id']} deleted.
          </div>
        )}
        {this.props.error && (
          <div className="alert alert-danger">{this.props.error}</div>
        )}

        <table className="table table-dark table-responsive table-striped table-hover col-lg-8 mx-auto">
          <thead>
            <tr>
              <th>Image</th>
              <th>Titre</th>
              <th>Description</th>
              <th>Prix</th>
              <th colSpan={2} >Actions</th>
              <th/>
            </tr>
          </thead>
          <tbody>
            {retrieved && retrieved['hydra:member'] && retrieved['hydra:member'] !== null && retrieved['hydra:member'].length > 0 &&
              retrieved['hydra:member'].map(item => (
                <tr key={item['id']}>
                  {console.log("item", item)}
                  <th scope="row" className={"col-lg-2"}>
                    <img className={"img-thumbnail rounded"} src={item.supplierProduct.images[0].url} alt={item.supplierProduct.images[0].alt}/>
                  </th>
                  <td>{item.supplierProduct.product.title}</td>
                  <td>
                    <p>
                      {item.supplierProduct.product.resume}
                    </p>
                  </td>
                  <td>
                    <p>
                      {item.supplierProduct.finalPrice.toFixed(2)}&nbsp;&euro;
                    </p>
                  </td>
                  <td>
                    <ButtonGroup vertical id={"my-favorites-buttons"}>
                      <ButtonAddToShoppingCart2 product={item.supplierProduct}/>
                      <Button outline color={"success"} onClick={() => this.buyNow(item, this.props.history)}>Commande immédiat</Button>
                      <Button outline color={"danger"} onClick={() => this.deleteProduct(item.id)}>Supprimer</Button>

                    </ButtonGroup>
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
      <Link to={`../${type}/show/${encodeURIComponent(items["id"])}`}>{items["id"]}</Link>
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
  } = state.favorite.list;
  return { retrieved, loading, error, eventSource, deletedItem };
};

const mapDispatchToProps = dispatch => ({
  list: (page, history) => dispatch(list(page, history)),
  delete: (item, history) => dispatch(del(item, history)),
  reset: eventSource => dispatch(reset(eventSource))
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(List));
