import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { list, reset } from '../../actions/product/list';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { injectIntl } from "react-intl";
import 'bootstrap/dist/css/bootstrap.css';
/* Carousel */
import {
  Col,
  Row,
  Card,
  CardFooter,
  CardTitle,
} from "reactstrap";
import AwesomeSlider from "react-awesome-slider";
import AwesomeSliderStyles from "react-awesome-slider/src/styled/cube-animation";
import {SpinnerLoading} from "../../layout/component/Spinner";
import { toastError, toastInfo } from "../../layout/component/ToastMessage";

class CarouselCategoryProducts extends Component {
  static propTypes = {
    products: PropTypes.array,
  };

  constructor(props)
  {
    super(props);
    this.state = { activeIndex: 0 };
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.goToIndex = this.goToIndex.bind(this);
    this.onExiting = this.onExiting.bind(this);
    this.onExited = this.onExited.bind(this);
    this.showProducts = this.showProducts.bind(this);

  }

  componentDidMount() {

    this.props.id && this.props.list({'category': this.props.id});
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

    const nextIndex = this.state.activeIndex === (Math.ceil(this.props.retrieved.length / 12) - 1) ? 0 : this.state.activeIndex + 1;
    this.setState({activeIndex: nextIndex});

  }

  previous()
  {
    if(this.animating) return;

    const nextIndex = this.state.activeIndex === 0 ? (Math.ceil(this.props.retrieved.length / 12) - 1) : this.state.activeIndex -1;
    this.setState({activeIndex: nextIndex});
  }

  goToIndex(nexIndex)
  {
    if(this.animating) return;
    this.setState({ activeIndex: nexIndex });
  }


  showProducts()
  {

    //const { intl } = this.props;

    const products = this.props.retrieved && this.props.retrieved.products;

    let rows = [];

    if(products.length > 1)
    {
      for(let i = 0; i < Math.ceil(products.length / 12 ); i++)
      {
        let resultsPer12 = [];

        for(let j = 0; j < 12 && products[j]; j++)
        {

          if(j >= 0 && products[i * 12 + j])
          {
            resultsPer12.push(
              <Col key={"products" + (i * 12 + j)} xs={"12"} sm="6" md="3" className={'slider-item'}>
                <Card className={"slider-card"}>
                  <Link
                    to={`/products/show/${encodeURIComponent(products[i * 12 + j]['id'])}`}
                  >
                    <div className="card-img-custom">
                      <img src={products[i * 12 + j]['img-src']} alt={products[i * 12 + j]["alt"]} className="image img-fluid" style={{ width:"100%"}} />

                      <CardTitle>
                        <span className="font-weight-bold">
                          {products[i * 12 + j]["title"]}
                        </span>
                      </CardTitle>
                    </div>
                  </Link>

                  <CardFooter>
                    <p>
                      À partir de : {products[i*12+j]["minimumPrice"].toFixed(2)} &euro;
                    </p>
                  </CardFooter>
                </Card>
              </Col>
            );
          }

        }

        rows.push(
          <div
            className={'col-10 slider-page'}
            key={i}
          >
            <Row
              key={"rows" + (i)}
            >
              {resultsPer12}
            </Row>
          </div>
        );
      }
    }else{
      /* Cas table contenant 1 seul élément */
      rows.push(
        <div
          key={0}
          className={'slider-page'}
        >
          <Row
            key={"rows0"}
          >
            <Col key={"products0"} sm="6" md="3" className={'slider-item'}>
              <Card className={"slider-card"}>
                <Link
                  to={`/products/show/${encodeURIComponent(products[0]['id'])}`}
                >
                  <div className="card-img-custom">
                    <img src={products[0]['img-src']} alt={products[0]["alt"]} className="image img-fluid" style={{ width:"100%"}} />
                    <CardTitle>
                        <span className="font-weight-bold">
                          {/* Permet d'injecter la traduction d'une valeur reçu par une entité
                            intl.formatMessage({
                              id: "app.category.item"+products[0]["id"]+".name",
                              description: "category item - name for item "+products[0]["id"],
                              defaultMessage: products[0]["name"]
                            })
                          */}
                          {products[0]["title"].replace(/(([^\s]+\s\s*){8})(.*)/,"$1…")}
                        </span>
                    </CardTitle>
                  </div>
                </Link>
                <CardFooter>
                  <p>
                    À partir de : {products[0]["minimumPrice"].toFixed(2)} &euro;
                  </p>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </div>
      );
    }


    return rows;

  }


  render() {
    const items = this.props.retrieved  !== null ? this.showProducts() : {};


    this.props.deletedItem && toastInfo(`Element : ${this.props.deletedItem['@id']} supprimé!`);
    this.props.error && toastError(this.props.error);

    return <Fragment>
        <div className={"slider-container my-3 py-2"}>
          {this.props.loading && <SpinnerLoading message={'Chargement des produits de la catégorie'} />}

          {this.props.retrieved &&
            <AwesomeSlider
                animation={'cube-animation'}
                cssModule={AwesomeSliderStyles}
            >
                {this.props.retrieved && items}
            </AwesomeSlider>
          }
    </div>
    </Fragment>;
  }

  pagination() {
    const view = this.props.retrieved['hydra:view'];
    if (!view) return;

    const {'hydra:first': first, 'hydra:previous': previous,'hydra:next': next, 'hydra:last': last} = view;

    return <nav aria-label="Page navigation">
        <Link to='.' className={`btn btn-primary${previous ? '' : ' disabled'}`}><span aria-hidden="true">&lArr;</span> First</Link>
        <Link to={!previous || previous === first ? '.' : encodeURIComponent(previous)} className={`btn btn-primary${previous ? '' : ' disabled'}`}><span aria-hidden="true">&larr;</span> Previous</Link>
        <Link to={next ? encodeURIComponent(next) : '#'} className={`btn btn-primary${next ? '' : ' disabled'}`}>Next <span aria-hidden="true">&rarr;</span></Link>
        <Link to={last ? encodeURIComponent(last) : '#'} className={`btn btn-primary${next ? '' : ' disabled'}`}>Last <span aria-hidden="true">&rArr;</span></Link>
    </nav>;
  }
}


const mapStateToProps = state => ({
  retrieved : state.product.list.retrieved,
  error : state.product.list.error,
  loading : state.product.list.loading,
  eventSource : state.product.list.eventSource,
});

const mapDispatchToProps = dispatch => ({
  list: options => dispatch(list(options)),
  reset: eventSource => dispatch(reset(eventSource))
});


export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(CarouselCategoryProducts));
