import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { list, reset } from '../../actions/product/list';
import {
  Col,
  Row,
  Card,
  CardTitle,
  CardText,
} from "reactstrap";
import { FormattedMessage } from "react-intl";

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

  _isMounted = false;

  constructor(props)
  {
    super(props);

    this.showProducts = this.showProducts.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;

    // Récupération des paramètres d'URL
    const params = new URLSearchParams(this.props.location.search);


    // Récupération des produits
    if(this.props.retrieved === null)
    {
      this.props.list(
        {
          'page': params.get('page') &&  params.get('page') !== null && decodeURIComponent(params.get('page')),
          'itemsPerPage': params.get('itemsPerPage') &&  params.get('itemsPerPage') !== null && decodeURIComponent(params.get('itemsPerPage')),
          'category': params.get('category') &&  params.get('category') !== null && decodeURIComponent(params.get('category')),
        }
      );
    }

  }

  componentDidUpdate(nextProps) {
    if (this.props.match.params.page !== nextProps.match.params.page || this.props.match.params.itemsPerPage !== nextProps.match.params.itemsPerPage || this.props.match.params.category !== nextProps.match.params.category)
      nextProps.list(
        {
          'page': nextProps.match.params.get('page') &&  nextProps.match.params.get('page') !== null && decodeURIComponent(nextProps.match.params.get('page')),
          'itemsPerPage': nextProps.match.params.get('itemsPerPage') &&  nextProps.match.params.get('itemsPerPage') !== null && decodeURIComponent(nextProps.match.params.get('itemsPerPage')),
          'category': nextProps.match.params.get('category') &&  nextProps.match.params.get('category') !== null && decodeURIComponent(nextProps.match.params.get('category')),
        }
      );
  }

  componentWillUnmount() {
    this._isMounted = false;

    this.props.reset(this.props.eventSource);
  }

  showProducts()
  {
    let items = [];

    const products = this.props.retrieved && this.props.retrieved.products;

    let rows = [];

    for(let i = 0; i < Math.ceil(products.length / 12); i++)
    {

      let resultsPer4 = [];

      for(let j = 0; j < 12; j++)
      {


        if(products[i * 12 + j])
        {

          resultsPer4.push(
            <Col key={"products" + (i * 12 + j)} xs={"12"} sm="6" md="4" lg="3">
              <Card body>
                <div className="card-img-custom">
                  <img
                    src={products[i * 12 + j]['url'] !== null ? products[i * 12 + j]['img-src'] : 'https://dummyimage.com/600x400/000/ff2b00&text=indisponible'}
                    alt={products[i * 12 + j]["alt"]}
                    className="image img-fluid"
                    style={{ width:"100%"}} />
                    <div className="middle">

                      <Link
                        to={`products/show/${encodeURIComponent(products[i * 12 + j]['id'])}`}
                        className="btn btn-outline-info"
                      >
                          <FormattedMessage  id={"app.page.customer.list.button.see_more"}
                                             defaultMessage="Voir le détail"
                                             description="Customers list - button see more"
                          />
                      </Link>
                    </div>
                </div>
                <CardTitle>{products[i * 12 + j]["title"]}</CardTitle>
                <CardText>
                  <FormattedMessage  id={"app.product.item.price_from"}
                                     defaultMessage="À partir de"
                                     description="Products item - price from"
                  /> &nbsp;: &nbsp;
                  {products[i * 12 + j]["minimumPrice"].toFixed(2)} &euro;
                </CardText>

              </Card>
            </Col>
          );
        }

      }

      rows.push(
        <Row
          key={"rows" + (i * 10)}
        >
          {resultsPer4}
        </Row>
      );


    }

    let index = 0;
    items.push(
      <div id="list-products" key={index++}>
        {rows}
      </div>
    );

    return items;


  }

  render() {

    return (
      <div className={"col-lg-9 mx-auto"}>
        <h1>
          Nos produits
        </h1>

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


        <div className="list-card-by-4 ">
          {this.props.retrieved && this.showProducts() }
          {this.pagination()}
        </div>

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
            !previous || previous === first ? '.' : '/'+previous
          }
          className={`btn btn-primary${previous ? '' : ' disabled'}`}
        >
          <span aria-hidden="true">&larr;</span> Previous
        </Link>
        <Link
          to={next ? next : '#'}
          className={`btn btn-primary${next ? '' : ' disabled'}`}
        >
          Next <span aria-hidden="true">&rarr;</span>
        </Link>
        <Link
          to={last ? "/"+last : '#'}
          className={`btn btn-primary${next ? '' : ' disabled'}`}
        >
          Last <span aria-hidden="true">&rArr;</span>
        </Link>
      </nav>
    );
  }

  renderLinks = (type, items) => {

    if(items === undefined) return;

    if (Array.isArray(items)) {
      return items.map((item, i) => (
        <div key={i}>{this.renderLinks(type, item)}</div>
      ));
    }



    return (
      <Link to={`../${type}/show/${encodeURIComponent(items['id'])}`}>{items["@id"]}</Link>
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
  } = state.product.list;
  return { retrieved, loading, error, eventSource, deletedItem };
};

const mapDispatchToProps = dispatch => ({
  list: page => dispatch(list(page)),
  reset: eventSource => dispatch(reset(eventSource))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(List);
