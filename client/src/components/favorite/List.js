import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { list, reset } from '../../actions/favorite/list';
import { del } from "../../actions/favorite/delete";
import {
  Button,
  ButtonGroup,
  Spinner,
  Form,
  Label,
  Input
} from "reactstrap";
import {
  Avatar,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow
} from "@material-ui/core";
import {FormattedMessage} from "react-intl";
import ButtonAddToShoppingCart2 from "../shoppingcart/ButtonAddToShoppingCart2";
import {SpinnerLoading} from "../../layout/Spinner";
import {toastError, toastInfo} from "../../layout/ToastMessage";
import { GiBuyCard, RiDeleteBin5Line } from "react-icons/all";
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
      table: {
        page: 0,
        rowsPerPage: 10
      },
      quantity: 1,
      updated: false
    };

    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    this.addToShoppingCart = this.addToShoppingCart.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
    this.buyNow = this.buyNow.bind(this);

  }

  componentDidMount() {
    this.props.list(
      null,
      this.props.history,
      this.props.location
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

  handleChangePage(event, newPage){
    this.setState(state => ({
      ...state,
      table: {
        rowsPerPage: state.rowsPerPage,
        page: newPage
      }
    }));
  }

  handleChangeRowsPerPage(event){
    this.setState(state => ({
      ...state,
      table: {
        rowsPerPage: +event.target.value,
        page: 0
      }
    }));
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
      /* Si le produit existe, on met à jour la quantité */
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


  }

  deleteProduct(id)
  {
    this.props.delete(id, this.props.history);
    this.setState(prevState => ({updated: !prevState.updated }));

  }

  buyNow(item={})
  {
    this.addToShoppingCart(item);
    this.props.history.push({pathname: "/shopping_cart", state: { from: this.props.location.pathname}});
  }

  render() {
    const { retrieved, error, loading } = this.props;
    const { page, rowsPerPage } = this.state.table;

    const favorites = retrieved && retrieved['hydra:member'];

    typeof error === "string" && toastError(error);

    return (
      <div>
        <h1>Vos favoris</h1>

        {loading && <SpinnerLoading message={"Chargement de vos favoris..."} />}
        {this.props.deletedItem && (toastInfo(`${this.props.deletedItem['@id']} deleted.`))}
        {retrieved && retrieved['hydra:member'] && (
          <Paper>
            <TableContainer>
              <Table stickyHeader aria-label={'sticky table'} className={'favorite-list'}>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <span>Image</span>
                    </TableCell>
                    <TableCell>
                      <span>Nom</span>
                    </TableCell>
                    <TableCell>
                      <span>Description</span>
                    </TableCell>
                    <TableCell>
                      <span>Prix</span>
                    </TableCell>
                    <TableCell>
                      <span>Actions</span>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  { retrieved && retrieved['hydra:member'] && retrieved['hydra:member'].slice( page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Avatar
                          variant={'rounded'}
                          src={item.supplierProduct.images[0].url}
                          alt={item.supplierProduct.images[0].alt}
                        />
                      </TableCell>
                      <TableCell>
                        <p>
                          {item.supplierProduct.product.title}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p>
                          {item.supplierProduct.product.resume}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p>
                          {item.supplierProduct.finalPrice.toFixed(2)}&nbsp;&euro;
                        </p>
                      </TableCell>
                      <TableCell>
                        <ButtonGroup vertical id={"my-favorites-buttons"}>
                          <ButtonAddToShoppingCart2 product={item.supplierProduct}/>
                          <Button
                            outline
                            color={"success"}
                            onClick={() => this.buyNow(item)}
                            className={'d-inline-block'}
                          >
                            <GiBuyCard/>
                            <span className={'ml-2'}>Commander</span>
                          </Button>
                          <Button
                            outline
                            color={"danger"}
                            onClick={() => this.deleteProduct(item.id)}
                            className={'d-inline-block'}
                          >
                            <RiDeleteBin5Line/>
                            <span className={'ml-2'}>Supprimer</span>

                          </Button>

                        </ButtonGroup>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10,25,50]}
              component={'div'}
              count={retrieved['hydra:member'].length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
          </Paper>
        )}



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
  list: (page, history, location) => dispatch(list(page, history, location)),
  delete: (item, history) => dispatch(del(item, history)),
  reset: eventSource => dispatch(reset(eventSource))
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(List));
