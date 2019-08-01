/**
 * Author: dashouney
 * Date: 31/07/2019
 * Description:
 */
import React, { Component, Fragment } from "react";
import { Card, CardImg, CardText, CardTitle, Col, Row } from "reactstrap";
import { Link } from "react-router-dom";

class SearchResults extends  Component{
  constructor(props)
  {
    super(props);
    this.state = { results: this.props.results };

    this.showResultsProducts = this.showResultsProducts.bind(this);
    this.showResultsSuppliers = this.showResultsSuppliers.bind(this);
  }

  componentDidMount() {
    this.setState({results: this.props.results})
  }

  showResultsProducts()
  {
    let items = [];

    const products = this.props.results && this.props.results.searchResults;


    console.log("Résultats produits", products);

    let rows = [];

    for(let i = 0; i < Math.ceil(products.length / 12 ); i++)
    {

      let resultsPer4 = [];

      for(let j = 0; j < 12; j++)
      {
        console.log("Résultats produits " + j, products[i * 12 + j]);

        if(products[i * 12 + j])
        {

          resultsPer4.push(
            <Col key={"products" + (i * 10 + j)} sm="3">
              <Card body>
                {/*
                <CardImg top width="100%" src={products[i * 10 + j].images[0].url} alt={products[i * 10 + j].images[0].alt} />
                */}
                <CardImg top width="100%" src="https://picsum.photos/2000/3000" alt={products[i * 10 + j].images[0].alt} />
                <CardTitle>{products[i * 10 + j]["title"]}</CardTitle>
                <CardText>{products[i * 10 + j]["resume"]}</CardText>
                <Link to={`show/${encodeURIComponent(products[i * 10 + j]['@id'])}`}>
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

    let index = 0;
    items.push(
      <div id="search-results" key={index++}>
        {rows}
      </div>
    );

    return items;


  }

  showResultsSuppliers()
  {
    let items = [];

    const suppliers = this.props.results.searchResults && this.props.results.searchResults;


    console.log("Résultats produits", suppliers);

    let rows = [];

    for(let i = 0; i < Math.ceil(suppliers.length / 12 ); i++)
    {

      let resultsPer4 = [];

      for(let j = 0; j < 12; j++)
      {
        console.log("Résultats produits " + j, suppliers[i * 12 + j]);

        if(suppliers[i * 12 + j])
        {

          resultsPer4.push(
            <Col key={"products" + (i * 10 + j)} sm="3">
              <Card body>
                {/*
                <CardImg top width="100%" src={products[i * 10 + j].images[0].url} alt={products[i * 10 + j].images[0].alt} />
                */}
                <CardImg top width="100%" src="https://picsum.photos/2000/3000" alt={suppliers[i * 12 + j].image.alt} />
                <CardTitle>{suppliers[i * 12 + j]["socialReason"]}</CardTitle>
                <CardText>{suppliers[i * 12 + j]["contactPhoneNumber"]}</CardText>
                <Link to={`/suppliers/show/${encodeURIComponent(suppliers[i * 12 + j]['id'])}`}>
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

    let index = 0;
    items.push(
      <div id="search-results" key={index++}>
        {rows}
      </div>
    );

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

  render()
  {
    const { results } = this.props;

    return (<Fragment>
      <h1>Resultats de recherche : </h1>
      {this.props.loading && (
        <div className="alert alert-info">Loading...</div>
      )}
      {this.props.deletedItem && (
        <div className="alert alert-success">
          {this.props.deletedItem['@id']} deleted.
        </div>
      )}
      {this.props.error && (
        <div className="alert alert-danger">{this.props.error}</div>
      )}


      {
        results.searchType === "products" ? this.showResultsProducts() : ""
      }
      {
        results.searchType === "suppliers"
          ? this.showResultsSuppliers() : ""
      }

      {this.pagination()}
    </Fragment>);
  }
}

export default SearchResults;
