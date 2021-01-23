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
  CardTitle
} from "reactstrap";
import {
  Grid,
  Paper,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Typography, CardActions
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import {SpinnerLoading} from "../../layout/component/Spinner";
import {toastError, toastSuccess} from "../../layout/component/ToastMessage";
import AwesomeSlider from "react-awesome-slider";
import AwesomeSliderStyles from "react-awesome-slider/src/styled/scale-out-animation/scale-out-animation.scss";
import {grey, orange} from "@material-ui/core/colors";
import _ from "lodash";
import BackgroundImageItem from "../../assets/img/parallax-gris.jpg";

const styles = theme => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    paddingLeft: '7.5rem',
    paddingRight: '7.5rem'
  },
  cardLink: {
    "&:hover": {
      textDecoration: 'unset'
    }
  },
  cardHeader: {
    "& .MuiCardHeader-title": {
      fontSize: '0.8rem',
      fontFamily: 'Montserrat',
      color: grey[700],
    }
  },
  cardContent: {
    paddingBottom: 0
  },
  cardMedia: {
    height: '7.5rem'
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
      toggle: false
    };
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
    const { retrieved, classes } = this.props;
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
                    <Link
                      to={`/product/show/${encodeURIComponent(productSuppliers[i * 12 + j]['id'])}`}
                      className={classes.cardLink}
                    >
                      <CardHeader
                        title={_.truncate(productSuppliers[i * 12 + j]['product']["title"], 24)}
                        subheader={`Offre de : ${productSuppliers[i * 12 + j].supplier.brandName}`}
                        className={classes.cardHeader}
                      />
                      <CardMedia
                        image={productSuppliers[i * 12 + j]["images"][0]["url"]}
                        title={_.truncate(productSuppliers[i * 12 + j]["title"], 24)}
                        className={classes.cardMedia}
                      />
                    </Link>
                    <CardContent className={classes.cardContent}>
                      <Row>
                        <Col>
                          <Rating rating={productSuppliers[i * 12 + j]["rating"]} />
                        </Col>
                        <Col className={'text-right'}>
                          {
                            localStorage.getItem('token')
                              ? <ButtonAddToFavorite supplierProductId={productSuppliers[i * 12 + j].id}/>
                              : ""
                          }
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <p>
                            <span className="font-weight-bold">Offre de : </span><Link to={'../../suppliers/show/' + productSuppliers[i * 12 + j].supplier.id }><strong>{productSuppliers[i * 12 + j].supplier.brandName }</strong></Link>
                          </p>
                          <p className={'text-right'}>
                            {productSuppliers[i * 12 + j]["finalPrice"].toFixed(2)} &euro;
                          </p>

                        </Col>
                      </Row>
                    </CardContent>
                    <CardActions>
                      <ButtonAddToShoppingCart buttonLabel={"Ajouter au panier"} product={productSuppliers[i * 12 + j]} toggle={this.toggle}/>
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


  render() {
    const { retrieved, loading, error, deletedItem } = this.props;

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
                >
                  {this.props.retrieved && items}
                </AwesomeSlider>
              )
              : (
                <Alert severity={'error'}>
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
