import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { search, reset } from '../../actions/product/search';
import {
  Card,
  CardImg,
  CardTitle,
  CardText,
  Row,
  Col
} from 'reactstrap';

class Search extends Component {
  static propTypes = {
    page: PropTypes.number,
    retrieved: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    eventSource: PropTypes.instanceOf(EventSource),
    search: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired
  };

  constructor(props)
  {
    super(props);

    this.state = {
      activeIndex : 0 ,
      searchValue : new URLSearchParams(window.location.search).get("title")
    };

    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.goToIndex = this.goToIndex.bind(this);
    this.onExiting = this.onExiting.bind(this);
    this.onExited = this.onExited.bind(this);
    this.createCarouselItems = this.createCarouselItems.bind(this);
  }

  componentDidMount() {

    const MIME_TYPE =  "application/ld+json";
    let headers = new Headers({
      "Content-Type": MIME_TYPE,
      "Accept": MIME_TYPE
    }) ;


    let options = {
      method: "GET",
      headers: headers,
    };

    let urlParams = new URLSearchParams(window.location.search);

    //console.log(urlParams.get("title"));
    this.setState({searchValue : urlParams.get("title")});

    urlParams.get("title") &&
      this.props.search(
        "products?title=" + urlParams.get("title"),
        options
      );

  }


  componentWillReceiveProps(nextProps) {

  }

  componentWillUnmount() {
    this.props.reset(this.props.eventSource);
  }

  onExiting()
  {
    this.animating = true;
  }

  onExited()
  {
    this.animating = false;
  }

  next()
  {
    if(this.animating) return;
    console.log(this.props.retrieved['hydra:member'][0].length);
    const nextIndex = this.state.activeIndex === (Math.ceil(this.props.retrieved['hydra:member'][0].length / 6) - 1) ? 0 : this.state.activeIndex + 1;
    this.setState({activeIndex: nextIndex});

  }

  previous()
  {
    if(this.animating) return;

    const nextIndex = this.state.activeIndex === 0 ? (Math.ceil(this.props.retrieved['hydra:member'][1].length / 6) - 1) : this.state.activeIndex -1;
    this.setState({activeIndex: nextIndex});
  }

  goToIndex(nexIndex)
  {
    if(this.animating) return;
    this.setState({ activeIndex: nexIndex });
  }

  createCarouselItems()
  {
    let items = [];

    const products = this.props.retrieved['hydra:member'] && this.props.retrieved['hydra:member'];



    console.log("Résultats produits", products);

    let rows = [];

    for(let i = 0; i < Math.ceil(products.length / 10 ); i++)
    {

      let resultsPer4 = [];

      for(let j = 0; j < 4; j++)
      {
        console.log("Résultats produits " + j, products[i * 10 + j]);

        if(products[i * 10 + j])
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
                <Link to={`../../products/show/${encodeURIComponent(products[i * 10 + j]['id'])}`}>
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

  render() {
    return (
      <Fragment>
        <h1>Recherche - Produits</h1>

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


        {this.props.retrieved &&
          this.createCarouselItems()
        }


        {this.pagination()}
      </Fragment>
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
      <Link to={`../${type}/show/${encodeURIComponent(items)}`}>{items}</Link>
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
  } = state.product.search;
  return { retrieved, loading, error, eventSource, deletedItem };
};

const mapDispatchToProps = dispatch => ({
  search: (page, options) => dispatch(search(page, options)),
  reset: eventSource => dispatch(reset(eventSource))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);
