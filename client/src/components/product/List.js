import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { list, reset } from '../../actions/product/list';
import {
  Col,
  Row,
  Card,
  CardGroup,
  CardImg,
  CardBody,
  CardTitle,
  CardText,
  CardFooter
} from "reactstrap";

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

    /*
    console.log(this.props.match.params.page &&
      decodeURIComponent(this.props.match.params.page));

    console.log("Products component did mount - retrieved",this.props.retrieved);
    console.log("Products - retrieved typeof", typeof this.props.retrieved);
    */

    if(this.props.retrieved === null)
    {
      this.props.list(
        this.props.match.params.page &&
        decodeURIComponent(this.props.match.params.page)
      );
    }

  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.page !== nextProps.match.params.page)
      nextProps.list(
        nextProps.match.params.page &&
          decodeURIComponent(nextProps.match.params.page)
      );
  }

  componentWillUnmount() {
    this._isMounted = false;

    this.props.reset(this.props.eventSource);
  }

  showProducts()
  {
    let items = [];

    const products = this.props.retrieved && this.props.retrieved["hydra:member"];


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
            <Col key={"products" + (i * 10 + j)} xs={"12"} sm="6" md="4" lg="3">
              <Card body>
                <div className="card-img-custom">
                  <img src="https://picsum.photos/2000/3000" alt={products[i * 10 + j]["images"][0]["alt"]} className="image img-fluid" style={{ width:"100%"}} />
                    <div className="middle">
                      <div className="btn btn-outline-info text">
                        Commander
                      </div>
                    </div>
                </div>
                {/*
                <CardImg top className={"img-thumbnail"} width="100%" src="https://picsum.photos/2000/3000" alt={products[i * 10 + j].images[0].alt} />
                */}
                <CardTitle>{products[i * 10 + j]["title"]}</CardTitle>
                <CardText>{products[i * 10 + j]["resume"]}</CardText>
                <Link
                  to={`show/${encodeURIComponent(products[i * 10 + j]['@id'])}`}
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
    console.log("renderLinks - items",items);
    console.log("renderLinks - type" + type);
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
