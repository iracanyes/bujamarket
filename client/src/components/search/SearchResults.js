/**
 * Author: Iracanye S.
 * Date: 31/07/2019
 * Description: Composant d'affichage des résultats de recherche
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Card, CardImg, CardText, CardTitle, Col, Row } from "reactstrap";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import {
  Button,
  Spinner
} from 'reactstrap';

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
    this.state = { results: this.props.results };

    this.showResultsProducts = this.showResultsProducts.bind(this);
    this.showResultsSuppliers = this.showResultsSuppliers.bind(this);
  }

  componentDidMount() {

    this.setState({products: this.state.retrievedProducts, suppliers: this.state.retrievedSuppliers});
  }



  showResultsProducts()
  {

    let items = [];
    let rows = [];
    let resultsPer4 = [];

    // Récupération des données
    const products = this.props.retrievedProducts && this.props.retrievedProducts.products;

    // key index pour les items
    let index = 0;

    if(this.props.loadingProducts)
    {
      items.push(<Spinner id={'search-spinner-loading'} type={"grow"} color={'primary'} className={'mx-auto m-5'} key={index++}></Spinner>);
    }else{


      if(!products || products.length === 0)
      {
        resultsPer4.push(
          <Col key={"products0"} xs={"12"} sm="6" md="4" lg="3">
            <Card body>

              <CardImg top width="100%" src="https://picsum.photos/2000/3000" alt={"Aucun produit trouvé"} />
              <CardTitle>Aucun produit trouvé</CardTitle>
              <CardText>
                <FormattedMessage  id={"app.search.product_notfound"}
                                   defaultMessage="Aucun produit trouvé"
                                   description="Products item - product not found"
                /> &nbsp;: &nbsp;
                0.00 &euro;
              </CardText>
              <Link
                to={`../../products}`}
                className={"btn btn-outline-primary"}
              >
                Voir la liste des produits
              </Link>
            </Card>
          </Col>
        );

        rows.push(
          <Row key={"row0"}>
            {resultsPer4}
          </Row>
        );

        console.log('rows', rows);

        items.push(
          <div id="search-results-items"
               className={"list-card-by-4"}
               key={index++}
          >
            {rows}
          </div>
        );


      }else{


        for(let i = 0; i < Math.ceil(products.length / 12 ); i++)
        {

          for(let j = 0; j < 12; j++)
          {

            if(products[i * 12 + j])
            {

              resultsPer4.push(
                <Col key={"products" + (i * 12 + j)} xs={"12"} sm="6" md="4" lg="3">
                  <Card body>

                    <CardImg top width="100%" src={products[i * 12 + j].url} alt={products[i * 12 + j].alt} />
                    <CardTitle>{products[i * 12 + j]["title"]}</CardTitle>
                    <CardText>
                      <FormattedMessage  id={"app.product.item.price_from"}
                                         defaultMessage="À partir de"
                                         description="Products item - price from"
                      /> &nbsp;: &nbsp;
                      {products[i * 10 + j]["minimumPrice"].toFixed(2)} &euro;
                    </CardText>
                    <Link
                      to={`../../products/show/${encodeURIComponent(products[i * 12 + j]['id'])}`}
                      className={"btn btn-outline-primary"}
                    >
                      Voir le détail
                    </Link>
                  </Card>
                </Col>
              );
            }

          }

          rows.push(
            <Row key={"rows" + (i)}>
              {resultsPer4}
            </Row>
          );
        }

        items.push(
          <div id="search-results-items" className={"list-card-by-4"} key={index++}>
            {rows}
          </div>
        );
      }

    }


    return items;


  }


  showResultsSuppliers()
  {
    let items = [];
    let rows = [];
    let index = 0;

    const suppliers = this.props.retrievedSuppliers && this.props.retrievedSuppliers['hydra:member'];

    if(this.props.loadingSuppliers)
    {
      items.push(<Spinner id={'search-spinner-loading'} type={"grow"} color={'primary'} className={'mx-auto m-5'} key={index++}></Spinner>);
    }else{
      if(!suppliers || suppliers.length === 0)
      {
        items.push(
          <div id="search-results-items"
               className={"list-card-by-4"}
          >
            <Row key={"row0"}>
              <Col key={"products0"} xs={"12"} sm="6" md="4" lg="3">
                <Card body>

                  <CardImg top width="100%" src="https://picsum.photos/2000/3000" alt={"Aucun fournisseur trouvé"} />
                  <CardTitle>Aucun fournisseur trouvé</CardTitle>
                  <CardText>
                    <FormattedMessage  id={"app.search.supplier_notfound"}
                                       defaultMessage="Aucun fournisseur trouvé"
                                       description="Supplier search - suppliers not found"
                    /> &nbsp;: &nbsp;
                    0.00 &euro;
                  </CardText>
                  <Link
                    to={`../../products}`}
                    className={"btn btn-outline-primary"}
                  >
                    Voir la liste des fournisseurs
                  </Link>
                </Card>
              </Col>
            </Row>
          </div>
        );
      }else{
        for(let i = 0; i < Math.ceil(suppliers.length / 12 ); i++)
        {

          let resultsPer4 = [];

          for(let j = 0; j < 12; j++)
          {


            if(suppliers[i * 12 + j])
            {

              resultsPer4.push(
                <Col key={"products" + (i * 10 + j)} xs={"12"} sm="6" md="4" lg="3">
                  <Card body>
                    <CardImg top width="100%" src={suppliers[i * 12 + j].url} alt={suppliers[i * 12 + j].image.alt} />
                    <CardTitle>{suppliers[i * 12 + j]["socialReason"]}</CardTitle>
                    <CardText>{suppliers[i * 12 + j]["contactPhoneNumber"]}</CardText>
                    <Link to={`../../suppliers/show/${encodeURIComponent(suppliers[i * 12 + j]['id'])}`}>
                      Voir le détail
                    </Link>
                  </Card>
                </Col>
              );
            }

          }

          rows.push(
            <Row key={"rows" + (i * 10)}>
              {resultsPer4}
            </Row>
          );
        }

        items.push(
          <div id="search-results-items" key={index++}>
            {rows}
          </div>
        );
      }
    }

    return items;


  }


  pagination() {
    const view = this.props.results && this.props.results;
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

  close(e)
  {
    let element = document.getElementById("search-results-component");
    element.style.display = 'none';
  }

  render()
  {
    const { results, retrievedProducts } = this.props;

    console.log("HOC results",results);
    console.log("State retrieved product", retrievedProducts);

    return (<Fragment>
      <div id="search-results-header">
        <Button outline color={'secondary'} className={'float-right mr-3'} onClick={this.close}>Fermer</Button>
        <h4>Recherche avancée</h4>
      </div>


      <div id="search-results">

        {results.searchType ==="products" && this.props.retrievedProducts ? this.showResultsProducts() : ""}

        {results.searchType === "suppliers" && this.props.retrievedSuppliers ? this.showResultsSuppliers() : ""}


        {this.pagination()}
      </div>

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



export default connect(mapStateToProps)(SearchResults);
