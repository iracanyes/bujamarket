import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from "react-intl";
import 'bootstrap/dist/css/bootstrap.css';
import Alert from "../../layout/component/Alert";
import ButtonAddToFavorite from '../favorite/ButtonAddToFavorite';
import { retrieveIds } from '../../actions/favorite/list';
import { retrieveByProductId, reset  } from "../../actions/supplierproduct/listByProductId";
import Rating from "../../layout/component/Rating";
import ButtonAddToShoppingCart from "./ButtonAddToShoppingCart";
import {
  Col,
  Row,
  CardBody,
  CardTitle, FormGroup, Label, Input, Form
} from "reactstrap";
import {
  Grid,
  Paper,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Typography, CardActions, IconButton, Tooltip, TextField
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import {SpinnerLoading} from "../../layout/component/Spinner";
import {toastError, toastSuccess} from "../../layout/component/ToastMessage";
import AwesomeSlider from "react-awesome-slider";
import AwesomeSliderStyles from "react-awesome-slider/src/styled/scale-out-animation/scale-out-animation.scss";
import {grey, orange} from "@material-ui/core/colors";
import _ from "lodash";
import BackgroundImageItem from "../../assets/img/parallax-gris.jpg";
import {MdAddShoppingCart, TiShoppingCart} from "react-icons/all";

const styles = theme => ({
  awesomeSlider: {
    height: '70rem'
  },
  root: {
    flexGrow: 1,
    zIndex: 1,
    paddingLeft: '7.5rem',
    paddingRight: '7.5rem'
  },
  cardLink: {
    color: 'black',
    "&:hover": {
      color: orange[500],
      textDecoration: 'unset'
    }
  },
  cardHeader: {
    "& .MuiCardHeader-title": {
      fontSize: '0.85rem',
      fontWeight: 500,
      fontFamily: 'Montserrat',
      color: grey[700],
    },
    "& .MuiCardHeader-action":{
      fontSize: '1.2rem',
      alignSelf: 'center'
    }
  },
  cardHeaderSubheader:{
    fontFamily: 'Montserrat',
    fontSize: '0.8rem'
  },
  cardContent: {
    paddingBottom: 0
  },
  cardMedia: {
    height: '7.5rem'
  },
  cardContentWrapper:{
    justifyContent: 'space-between',
  },
  formQuantity: {
    marginTop: theme.spacing(2)
  },
  inputQuantity: {
    "& .MuiOutlinedLabel-root": {
      fontFamily: 'Montserrat'
    },
    "& .MuiOutlinedInput-input":{
      padding: '12px 14px',
      width: '100%',
      fontFamily: 'Montserrat'
    }
  }
});

class CarouselProductSuppliers extends Component {
  static propTypes = {
    productId: PropTypes.number.isRequired,
    retrieved: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    eventSource: PropTypes.instanceOf(EventSource),
    retrieveByProductId: PropTypes.func.isRequired,
    retrieveIds: PropTypes.func.isRequired,
    retrievedIds: PropTypes.object,
    reset: PropTypes.func.isRequired,
  };

  constructor(props)
  {
    super(props);
    this.state = {
      activeIndex: 0,
      toggle: false,
      quantity: 1
    };

    this.addToShoppingCart = this.addToShoppingCart.bind(this);
    this.buyNow = this.buyNow.bind(this);
    this.showProductSuppliers = this.showProductSuppliers.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {

    this.props.retrieveByProductId(this.props.productId);

    /* Récupération des ID des favoris afin d'indiquer quel produit */
    if(localStorage.getItem('token') !== null)
    {
      this.props.retrieveIds(this.props.history, this.props.location);
    }

  }

  componentWillUnmount() {
    this.props.reset(this.props.eventSource);
  }

  showProductSuppliers()
  {
    const { retrieved, classes, intl } = this.props;
    const productSuppliers = retrieved && retrieved['hydra:member'];

    let rows = [];

    if(productSuppliers && productSuppliers.length > 1)
    {
      for(let i = 0; i < Math.ceil(productSuppliers.length / 12 ); i++)
      {
        let resultsPer12 = [];
        for(let j = 0; j < 12 && productSuppliers[j]; j++)
        {
          if(j > 0 && productSuppliers[i * 12 + j])
          {

            resultsPer12.push(
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                key={"productSuppliers" + (i * 12 + j)}
                className={classes.gridItem}
              >
                <Paper elevation={3}>
                  <Card>
                    <CardHeader
                      title={
                        <Link
                          to={`/product/show/${encodeURIComponent(productSuppliers[i * 12 + j]['id'])}`}
                          className={classes.cardLink}
                        >
                          {_.truncate(productSuppliers[i * 12 + j]['product']["title"], 24)}
                        </Link>
                      }
                      subheader={
                        <span className={classes.cardHeaderSubheader}>Offre de :
                            <Link
                              to={'../../suppliers/show/' + productSuppliers[i * 12 + j].supplier.id }
                              className={classes.cardLink}
                            >
                              <strong>{productSuppliers[i * 12 + j].supplier.brandName }</strong>
                            </Link>
                          </span>
                      }
                      action={
                        localStorage.getItem('token')
                          ? <ButtonAddToFavorite supplierProductId={productSuppliers[i * 12 + j].id}/>
                          : ""
                      }
                      className={classes.cardHeader}
                    />
                    <Link
                      to={`/product/show/${encodeURIComponent(productSuppliers[i * 12 + j]['id'])}`}
                      className={classes.cardLink}
                    >
                      <CardMedia
                        image={productSuppliers[i * 12 + j]["images"][0]["url"]}
                        title={_.truncate(productSuppliers[i * 12 + j]["title"], 24)}
                        className={classes.cardMedia}
                      />
                    </Link>
                    <CardContent className={classes.cardContent}>
                      <Grid
                        container
                        direction={"row"}
                        className={classes.cardContentWrapper}
                      >
                        <Grid>
                          <Rating rating={productSuppliers[i * 12 + j]["rating"]} />
                        </Grid>
                        <Grid className={'text-right'}>
                          {productSuppliers[i * 12 + j]["finalPrice"].toFixed(2)} &euro;
                        </Grid>
                      </Grid>
                      <Form
                        inline
                        id={"add-shopping-cart"}
                        className={classes.formQuantity}
                        onSubmit={(e) => e.preventDefault()}
                      >
                        <TextField
                          id={'quantity'}
                          name={'quantity'}
                          type={'number'}
                          label={intl.formatMessage({
                            id: "app.form.quantity",
                            defaultMessage: "Quantité"
                          })}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          inputProps={{
                            min: 1
                          }}
                          variant={'outlined'}
                          onChange={this.changeQuantity}
                          defaultValue={this.state.quantity}
                          className={classes.inputQuantity}
                        />
                      </Form>
                    </CardContent>
                    <CardActions>
                      <Tooltip
                        title={
                          <FormattedMessage
                            id={"app.button.add_shopping_cart"}
                            defaultMessage={"Ajouter au panier"}
                          />
                        }
                      >
                        <IconButton
                          aria-label={'Add to shopping cart'}
                          className={classes.iconButtonAddShoppingCard}
                          onClick={() => this.addToShoppingCart(productSuppliers[i * 12 + j])}
                        >
                          <MdAddShoppingCart/>
                        </IconButton>
                      </Tooltip>
                      <Tooltip
                        title={
                          <FormattedMessage
                            id={"app.button.order_now"}
                            defaultMessage={"Commande immédiat"}
                          />
                        }
                      >
                        <IconButton
                          aria-label={'Buy now'}
                          className={classes.iconButtonAddShoppingCard}
                          onClick={() => this.buyNow(productSuppliers[i * 12 + j])}
                        >
                          <TiShoppingCart/>
                        </IconButton>
                      </Tooltip>

                      {/*
                        <ButtonAddToShoppingCart buttonLabel={"Ajouter au panier"} product={productSuppliers[i * 12 + j]} toggle={this.toggle}/>
                      */}

                    </CardActions>

                  </Card>
                </Paper>
              </Grid>
            );
          }

        }

        rows.push(
          <div
            data-src={BackgroundImageItem}
            key={i}
            className={classes.root}
          >
            <Grid
              container
              spacing={2}
              key={"rows" + (i)}
              className={classes.gridContainer}
            >
              {resultsPer12}
            </Grid>
          </div>
        );
      }
    }else{

      /* Cas table contenant 1 seul élément */
      rows.push(
        <div
          key={0}
          data-src={BackgroundImageItem}
          className={classes.root}
        >
          <Grid
            container
            spacing={3}
            className={classes.gridContainer}
            key={"rows0"}
          >
            <Grid
              item
              xs={12} sm={6} md={4}
              key={"productSuppliers0"}
              className={classes.gridItem}
            >
              <Paper elevation={3}>
                <Card className={"slider-card"}>
                  <Link
                    to={`/supplier_product/show/${encodeURIComponent(productSuppliers[0]['id'])}`}
                  >
                    <CardHeader
                      title={_.truncate(productSuppliers[0]["product"]["title"], 24)}
                      subheader={` Offre de : ${productSuppliers[0].supplier.brandName }`}
                      className={classes.cardHeader}
                    />
                    <CardMedia
                      image={productSuppliers[0]["images"][0]["url"]}
                      title={_.truncate(productSuppliers[0]["product"]["title"], 24)}
                      className={classes.cardMedia}
                    />
                  </Link>
                  <CardContent className={classes.cardContent}>
                    <Row>
                      <Col>
                        <Rating rating={productSuppliers[0]["rating"]} />
                      </Col>
                      <Col className={'text-right'}>
                        <ButtonAddToFavorite supplierProductId={productSuppliers[0].id}/>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <p className={'text-right'}>
                          {productSuppliers[0]["finalPrice"].toFixed(2)} &euro;
                        </p>
                        <ButtonAddToShoppingCart buttonLabel={"Ajouter au panier"} product={productSuppliers[0]} toggle={this.toggle}/>
                      </Col>
                    </Row>
                  </CardContent>
                </Card>
              </Paper>

            </Grid>
          </Grid>
        </div>
      );
    }


    return rows;

  }

  toggle(){
    this.setState(state => ({
      ...state,
      toggle: !state.toggle
    }));
  }

  addToShoppingCart(supplier_product){
    const {retrieved} = this.props;

    /* Ajout au  panier de commande dans LocalStorage  */
    let shopping_cart = localStorage.getItem("shopping_cart") !== null ? JSON.parse(localStorage.getItem("shopping_cart")) : [];
    /* Si le panier de commande existe */
    if( shopping_cart.length > 0 )
    {
      /* mise à jour de la quantité pour le produit */
      let index  = shopping_cart.findIndex( value => value.id === supplier_product.id);
      console.log('addToShoppingCart - supplier_product.id', supplier_product.id);
      console.log('addToShoppingCart - index', index);
      console.log('addToShoppingCart - retrieved["hydra:member"]', retrieved["hydra:member"]);
      /* Si le produit exite, on met à jour la quantité */
      if( index !== -1 )
      {
        shopping_cart[index].quantity = this.state.quantity;
      }else{
        /* Sinon, on ajoute un nouveau produit au panier de commande */
        shopping_cart.push({
          'productId': supplier_product.id,
          'title': supplier_product.product.title,
          'description': supplier_product.product.resume,
          'price': supplier_product.finalPrice,
          'image': supplier_product.images[0].url,
          'quantity': this.state.quantity
        });

      }
    }else{
      /* Si le panier est vide, on ajoute un nouveau produit */
      shopping_cart.push({
        'productId': supplier_product.id,
        'title': supplier_product.product.title,
        'description': supplier_product.product.resume,
        'price': supplier_product.finalPrice,
        'image': supplier_product.images[0].url,
        'quantity': this.state.quantity
      });

    }

    /* Enregistrement du panier de commande */
    localStorage.removeItem('shopping_cart');
    localStorage.setItem('shopping_cart', JSON.stringify(shopping_cart));

    toastSuccess('Produit ajouté au panier');
  }

  buyNow(supplier_product){
    this.addToShoppingCart(supplier_product);
    this.props.history.push('../../shopping_cart');
  }


  render() {
    const { retrieved, loading, error, deletedItem, classes } = this.props;

    const items = retrieved  !== null && retrieved["hydra:member"].length > 0 ? this.showProductSuppliers() : {};

    (error && error.length > 0 ) && (toastError(error));
    return <Fragment>
        <div id={'slider-product-suppliers'} className={"slider-container my-3 py-2"}>
          <h3 className={'text-center'}>Fournisseurs du produit</h3>

          {loading && <SpinnerLoading message={'Chargement des fournisseurs...'} />}
          {deletedItem && (toastSuccess(this.props.deletedItem['@id'] + "supprimé!"))}

          {!loading && (
            (this.props.retrieved && this.props.retrieved["hydra:member"].length > 0)
              ? (
                <AwesomeSlider
                  id={'slider-product-suppliers'}
                  animation={'scaleOutAnimation'}
                  cssModule={AwesomeSliderStyles}
                  className={classes.awesomeSlider}
                >
                  {this.props.retrieved && items}
                </AwesomeSlider>
              )
              : (
                <Alert severity={'info'}>
                  <FormattedMessage
                    id={'app.supplier_product.not_available'}
                    defaultMessage={"Aucun fournisseur de la plateforme ne propose ce produit pour l'instant"}
                    description={"Supplier product - Not available"}
                  />
                </Alert>
              )

          )}

      </div>
    </Fragment>;
  }

}

const mapStateToProps = state => ({
  retrieved: state.supplierproduct.listByProductId.retrieved,
  error: state.supplierproduct.listByProductId.error,
  loading: state.supplierproduct.listByProductId.loading,
  eventSource: state.supplierproduct.listByProductId.eventSource,
  retrievedIds: state.favorite.list.retrieved
});

const mapDispatchToProps = dispatch => ({
  retrieveByProductId: id => dispatch(retrieveByProductId(id)),
  retrieveIds: (history, location) => dispatch(retrieveIds(history, location)),
  reset: eventSource => dispatch(reset(eventSource))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(withStyles(styles)(CarouselProductSuppliers))));
