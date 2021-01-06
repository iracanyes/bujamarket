/**
 * Description: Composant d'affichage des résultats de recherche
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { injectIntl } from "react-intl";
import { CardImg, CardText, CardTitle, Col, Row } from "reactstrap";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import {
  Spinner
} from 'reactstrap';
import {
  Button,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Paper
} from "@material-ui/core";
import {
  MdMoreVert,
  MdClose
} from "react-icons/md";
import _ from "lodash";
import SuppliersImage from "../image/SuppliersImage";
import AwesomeSlider from "react-awesome-slider";
import AwesomeSliderStyles from "react-awesome-slider/src/styled/scale-out-animation/scale-out-animation.scss";
import BackgroundImageItem from '../../assets/img/parallax-gris.jpg';

class SearchResults extends  Component{
  static propTypes = {
    retrievedProducts : PropTypes.object,
    loadingProducts: PropTypes.bool.isRequired,
    errorProducts: PropTypes.string,
    eventSourceProducts: PropTypes.instanceOf(EventSource),
    retrievedSuppliers : PropTypes.object,
    loadingSuppliers: PropTypes.bool.isRequired,
    errorSuppliers: PropTypes.string,
    eventSourceSuppliers: PropTypes.instanceOf(EventSource)
  };

  constructor(props)
  {
    super(props);
    this.state = {
      results: this.props.results,
      isOpen: true
    };
    this.showResultsProducts = this.showResultsProducts.bind(this);
    this.showResultsSuppliers = this.showResultsSuppliers.bind(this);
    this.showResults = this.showResults.bind(this);
    this.close = this.close.bind(this);
  }

  componentDidMount() {
    this.setState(state => ({
      ...state,
      products: this.props.retrievedProducts,
      suppliers: this.props.retrievedSuppliers
    }));
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if((this.props.retrievedProducts && prevProps.retrievedProducts !== this.props.retrievedProducts) || (this.props.retrievedSuppliers && prevProps.retrievedSuppliers !== this.props.retrievedSuppliers)){
      this.setState(state => ({
        ...state,
        isOpen: true
      }));
    }
  }

  showResultsProducts()
  {
    const { intl, retrievedProducts } = this.props;
    let items = [];
    let rows = [];

    // Récupération des données
    const products = retrievedProducts && retrievedProducts.products;

    // key index pour les items
    let index = 0;

    if(!products || products.length === 0)
    {

      let resultsPer8 = [];
      resultsPer8.push(
        <Col key={"products0"} xs={"12"} sm="6" md="4" lg="3">
          <Card>
            <CardHeader
              avatar={
                <Avatar aria-label={'recipe'}>
                  S
                </Avatar>
              }
              action={
                <IconButton aria-label="settings">
                  <MdMoreVert />
                </IconButton>
              }
              title={intl.formatMessage({
                id: "app.search.product_notfound",
                defaultMessage: "Aucun produit trouvé"
              })}
            />
            <CardMedia
              //className={classes.media}
              image="https://picsum.photos/2000/3000"
              title="Aucun produit trouvé"
            />
            <CardContent>
              <Typography variant={'body'} color={'textSecondary'} component={'p'}>
                <FormattedMessage  id={"app.search.product_notfound"}
                                   defaultMessage="Aucun produit trouvé"
                                   description="Products item - product not found"
                /> &nbsp;: &nbsp;
                0.00 &euro;
              </Typography>

            </CardContent>
            <CardActions disableSpacing>
              <Link
                to={`../../products}`}
                className={"MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary"}
              >
                Voir la liste des produits
              </Link>
            </CardActions>
          </Card>
        </Col>
      );

      rows.push(
        <div id="search-results-items"
             //className={"col-12"}
             key={index++}
             data-src={BackgroundImageItem}
        >
          <Row>
            {resultsPer8}
          </Row>
        </div>

      );


    }else{


      for(let i = 0; i < Math.ceil(products.length / 8 ); i++)
      {

        let resultsPer8 = [];
        for(let j = 0; j < 8; j++)
        {
          if(products[i * 8 + j])
          {
            resultsPer8.push(
              <Col key={"products" + (i * 8 + j)} xs={"12"} sm="6" md="4" lg="3" className={'mb-3'}>
                <Card>
                  <CardHeader
                    avatar={
                      <Avatar aria-label={'recipe'}>
                        S
                      </Avatar>
                    }
                    action={
                      <IconButton aria-label="settings">
                        <MdMoreVert />
                      </IconButton>
                    }
                    title={_.truncate(products[i * 8 + j]["title"], {length: 40, omission: '...'})}
                  />
                  <CardMedia
                    //className={classes.media}
                    image={products[i * 8 + j]['img-src']}
                    title={products[i * 8 + j]["title"]}
                  />
                  <CardContent>
                    <Typography variant={'body2'} color={'textSecondary'} component={'p'}>
                      <FormattedMessage  id={"app.product.item.price_from"}
                                         defaultMessage="À partir de"
                                         description="Products item - price from"
                      /> &nbsp;: &nbsp;
                      {products[i * 8 + j]["minimumPrice"].toFixed(2)} &euro;
                    </Typography>
                  </CardContent>
                  <CardActions disableSpacing>
                    <Link
                      to={`../../supplier_product/show/${encodeURIComponent(products[i * 8 + j]['id'])}`}
                      className={"MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary"}
                    >
                      <FormattedMessage
                        id={'app.page.customer.list.button.see_more'}
                        defaultMessage={'Voir le détail'}
                      />
                    </Link>
                  </CardActions>
                </Card>
              </Col>
            );
          }

          if(i * 8 + j === products.length - 1){
            for(let k=0; k < products.length % 8; k++){
              resultsPer8.push(
                <Col key={"products" + (i * 8 + j + k)} xs={"12"} sm="6" md="4" lg="3">
                  <Card>
                    <CardHeader
                      avatar={
                        <Avatar aria-label={'recipe'}>
                          S
                        </Avatar>
                      }
                      action={
                        <IconButton aria-label="settings">
                          <MdMoreVert />
                        </IconButton>
                      }
                      title={intl.formatMessage({
                        id: "app.search.product_notfound",
                        defaultMessage: "Aucun produit trouvé"
                      })}
                    />
                    <CardMedia
                      //className={classes.media}
                      image="https://picsum.photos/2000/3000"
                      title="Aucun produit trouvé"
                    />
                    <CardContent>
                      <Typography variant={'body2'} color={'textSecondary'} component={'p'}>
                        <FormattedMessage  id={"app.search.product_notfound"}
                                           defaultMessage="Aucun produit trouvé"
                                           description="Products item - product not found"
                        /> &nbsp;: &nbsp;
                        0.00 &euro;
                      </Typography>

                    </CardContent>
                    <CardActions disableSpacing>
                      <Link
                        to={`../../products}`}
                        className={"MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary"}
                      >
                        Voir la liste des produits
                      </Link>
                    </CardActions>
                  </Card>
                </Col>
              );
            }
          }

        }

        console.log("showResultsProducts - resultsPer8"+ (i), resultsPer8 );



        rows.push(
          <div key={index} data-src={BackgroundImageItem}>
            <Row key={"rows" + (index++)}>
              {resultsPer8}
            </Row>
          </div>

        );
      }
    }

    console.log("showResultsProducts - rows"+ (index), rows );
    return rows;


  }


  showResultsSuppliers()
  {
    const { intl, retrievedSuppliers } = this.props;
    let rows = [];
    let index = 0;

    const suppliers = retrievedSuppliers && retrievedSuppliers['hydra:member'];

    console.log("showResultsSuppliers - suppliers.length", suppliers.length);
    if(!suppliers || suppliers.length === 0)
    {

      let resultsPer8 = [];
      resultsPer8.push(
        <Col key={"products0"} xs={"12"} sm="6" md="4" lg="3">
          <Card>
            <CardHeader
              avatar={
                <Avatar aria-label={'recipe'}>
                  S
                </Avatar>
              }
              action={
                <IconButton aria-label="settings">
                  <MdMoreVert />
                </IconButton>
              }
              title={intl.formatMessage({
                id: "app.search.supplier_notfound",
                defaultMessage: "Aucun fournisseur trouvé"
              })}
            />
            <CardMedia
              //className={classes.media}
              image="https://picsum.photos/2000/3000"
              title="Aucun produit trouvé"
            />
            <CardContent>
              <Typography variant={'body2'} color={'textSecondary'} component={'p'}>
                <FormattedMessage  id={"app.search.supplier_notfound"}
                                   defaultMessage="Aucun fournisseur trouvé"
                                   description="Products item - product not found"
                />
              </Typography>

            </CardContent>
            <CardActions disableSpacing>
              <Link
                to={`../../suppliers}`}
                className={"MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary"}
              >
                Voir la liste des produits
              </Link>
            </CardActions>
          </Card>
        </Col>
      );

      rows.push(
        <div key={index++} data-src={BackgroundImageItem}>
          <Row key={"rows0"}>
            {resultsPer8}
          </Row>
        </div>

      );
    }else{
      for(let i = 0; i < Math.ceil(suppliers.length / 8 ); i++)
      {
        let resultsPer8 = [];
        for(let j = 0; j < 8; j++)
        {

          if(suppliers[i * 8 + j])
          {
            resultsPer8.push(
              <Col key={"supplier" + (i * 8 + j)} xs={"12"} sm="6" md="4" lg="3">
                <Card>
                  <CardHeader
                    avatar={
                      <Avatar aria-label={'recipe'}>
                        S
                      </Avatar>
                    }
                    action={
                      <IconButton aria-label="settings">
                        <MdMoreVert />
                      </IconButton>
                    }
                    title={_.truncate(suppliers[i * 8 + j]["brandName"], {length: 40, omission: '...'})}
                    subheader={_.truncate(suppliers[i * 8 + j]["socialReason"], {length: 40, omission: '...'})}
                  />
                  <SuppliersImage index={i * 8 + j} supplier={suppliers[i * 8 + j]}/>
                  <CardContent>
                    <Typography variant={'body2'} color={'textSecondary'} component={'p'}>
                      <FormattedMessage  id={"app.supplier.item.contact_phone_number"}
                                         defaultMessage="Numéro de téléphone"
                                         description="Products item - price from"
                      /> &nbsp;: &nbsp;
                      {suppliers[i * 8 + j]["contactPhoneNumber"]}
                    </Typography>
                    <Typography variant={'body2'} color={'textSecondary'} component={'p'}>
                      <FormattedMessage  id={"app.supplier.item.contact_phone_number"}
                                         defaultMessage="Website"
                                         description="Products item - price from"
                      /> &nbsp;: &nbsp;

                      {suppliers[i * 8 + j]["website"]}
                    </Typography>
                  </CardContent>
                  <CardActions disableSpacing>
                    <Link
                      to={`../../suppliers/show/${encodeURIComponent(suppliers[i * 8 + j]['id'])}`}
                      className={"MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary"}
                    >
                      <FormattedMessage
                        id={'app.page.customer.list.button.see_more'}
                        defaultMessage={'Voir le détail'}
                      />
                    </Link>
                  </CardActions>
                </Card>
              </Col>
            );
          }

        }

        rows.push(
          <div key={index++} data-src={BackgroundImageItem}>
            <Row key={"rows" + i}>
              {resultsPer8}
            </Row>
          </div>

        );
      }
    }

    return rows;


  }

  showResults(){
    const { results,retrievedProducts,retrievedSuppliers } = this.props;
    let slides = [];
    if(results.searchType ==="products" && retrievedProducts){
      slides = this.showResultsProducts()
    }
    if(results.searchType === "suppliers" && retrievedSuppliers){
      slides = this.showResultsSuppliers()
    }
    return slides;
  }


  close()
  {
    this.setState(state => ({
      ...state,
      isOpen: false
    }));
  }

  render()
  {
    const { intl, results, retrievedProducts, retrievedSuppliers } = this.props;
    const { isOpen } = this.state;

    console.log("SearchResults render - results.searchType", results.searchType);
    console.log("SearchResults render - retrievedSuppliers", retrievedSuppliers);
    console.log("SearchResults render - showResultsSuppliers", (results.searchType === "suppliers" && retrievedSuppliers) && this.showResultsSuppliers());


    return (<Fragment>
      {isOpen && (
        <Paper elevation={3} className={'p-3'}>
          <div id="search-results-header">
            <Button variant={'contained'} color={'secondary'} className={'float-right mr-3'} onClick={this.close}>
              <MdClose className={'mr-2'}/>
              <FormattedMessage
                id={"app.close"}
                defaultMessage={"Fermer"}
                description={"App - close"}
              />
            </Button>
            <h4>Recherche avancée</h4>
          </div>
          <div id="search-results">
            {((results.searchType ==="products" && retrievedProducts) || (results.searchType === "suppliers" && retrievedSuppliers)) && (
              <AwesomeSlider
                animation={'scaleOutAnimation'}
                cssModule={AwesomeSliderStyles}
              >
                {this.showResults()}
              </AwesomeSlider>
            )}


            <div className={'d-flex flex-column'}>
              {/*this.pagination()*/}
              <Button variant={'contained'} color={'secondary'} className={'mx-auto'} onClick={this.close}>
                <MdClose className={'mr-2'}/>
                <FormattedMessage
                  id={"app.close"}
                  defaultMessage={"Fermer"}
                  description={"App - close"}
                />
              </Button>
            </div>

          </div>
        </Paper>
      )}


    </Fragment>);
  }
}

const mapStateToProps = state => {
  const {
    retrieved: retrievedProducts,
    loading: loadingProducts,
    error: errorProducts,
    eventSource: eventSourceProducts
  } = state.product.search;

  const {
    retrieved: retrievedSuppliers,
    loading: loadingSuppliers,
    error: errorSuppliers,
    eventSource: eventSourceSuppliers
  } = state.supplier.search;

  return {
    retrievedProducts,
    loadingProducts,
    errorProducts,
    eventSourceProducts,
    retrievedSuppliers,
    loadingSuppliers,
    errorSuppliers,
    eventSourceSuppliers
  };
};



export default connect(mapStateToProps)(injectIntl(SearchResults));
