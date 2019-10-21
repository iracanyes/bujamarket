import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from "react-intl";
import 'bootstrap/dist/css/bootstrap.css';

/* Carousel */
import {
  Col,
  Row,
  Card,
  CardFooter,
  CardTitle,
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  Spinner
} from "reactstrap";
import { retrieveBySupplierId, reset  } from "../../actions/supplierproduct/listBySupplierId";
import Rating from "../../layout/Rating";
import ButtonAddShoppingCard from "./ButtonAddShoppingCard";

class CarouselProductSuppliers extends Component {
  static propTypes = {
    supplierId: PropTypes.number.isRequired,
    retrieved: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    eventSource: PropTypes.instanceOf(EventSource),
    retrieveBySupplierId: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
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
    this.showProductSuppliers = this.showProductSuppliers.bind(this);

  }

  componentDidMount() {
    this.props.retrieveBySupplierId(this.props.supplierId);
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

    const nextIndex = this.state.activeIndex === (this.props.retrieved.length / 12 - 1) ? 0 : this.state.activeIndex + 1;
    this.setState({activeIndex: nextIndex});

  }

  previous()
  {
    if(this.animating) return;

    const nextIndex = this.state.activeIndex === 0 ? this.props.retrieved.length / 12 - 1 : this.state.activeIndex -1;
    this.setState({activeIndex: nextIndex});
  }

  goToIndex(nexIndex)
  {
    if(this.animating) return;
    this.setState({ activeIndex: nexIndex });
  }




  showProductSuppliers()
  {

    //const { intl } = this.props;

    const productSuppliers = this.props.retrieved && this.props.retrieved['hydra:member'];


    console.log("Résultats produit-suppliers", productSuppliers);

    let rows = [];

    if(productSuppliers && productSuppliers.length > 1)
    {
      for(let i = 0; i < Math.ceil(productSuppliers.length / 12 ); i++)
      {

        let resultsPer12 = [];

        for(let j = 0; j < 12 && productSuppliers[j]; j++)
        {
          if(process.env.DEBUG === 1 )
          {
            console.log("Résultats produit" + j, productSuppliers[i * 12 + j]);
          }



          if(j > 0 && productSuppliers[i * 12 + j])
          {

            resultsPer12.push(
              <Col key={"productSuppliers" + (i * 12 + j)} xs={"12"} sm="6" md="4" lg="3">
                <Card body className={" text-white bg-dark"}>
                  <Link

                    to={`/supplier_product/show/${encodeURIComponent(productSuppliers[i * 12 + j]['id'])}`}
                  >
                    <div className="card-img-custom">
                      <img src="https://picsum.photos/2000/3000" alt={productSuppliers[i * 12 + j]["images"][0]["alt"]} className="image img-fluid" style={{ width:"100%"}} />

                      <CardTitle className={"image-bottom-left-title"}>

                        <span className="font-weight-bold">

                          {/* Permet d'injecter la traduction d'une valeur reçu par une entité
                            intl.formatMessage({
                              id: "app.category.item"+productSuppliers[i * 12 + j]["id"]+".name",
                              description: "category item - name for item "+productSuppliers[i * 12 + j]["id"],
                              defaultMessage: productSuppliers[i * 12 + j]["name"]
                            })
                          */}
                          {productSuppliers[i * 12 + j]["title"]}
                        </span>


                      </CardTitle>
                    </div>
                  </Link>

                  <CardFooter>
                    <Rating rating={productSuppliers[i*12+j]["rating"]} />
                    <p>
                      À partir de : {productSuppliers[i*12+j]["minimumPrice"]}
                    </p>
                    <ButtonAddShoppingCard buttonLabel={"Ajouter au panier"} product={productSuppliers[i*12+j]}/>

                  </CardFooter>
                </Card>
              </Col>
            );
          }

        }

        rows.push(
          <CarouselItem
            onExiting={this.onExiting}
            onExited={this.onExited}
            key={i}
          >
            <Row
              key={"rows" + (i)}
            >
              {resultsPer12}
            </Row>
          </CarouselItem>
        );
      }
    }else{
      /* Cas table contenant 1 seul élément */
      rows.push(
        <CarouselItem
          onExiting={this.onExiting}
          onExited={this.onExited}
          key={0}
        >
          <Row
            key={"rows0"}
          >
            <Col key={"productSuppliers0"} xs={"12"} sm="6" md="4" lg="3">
              <Card body className={" text-white bg-dark"}>
                <Link

                  to={`/products/show/${encodeURIComponent(productSuppliers[0]['product']['id'])}`}
                >
                  <div className="card-img-custom">
                    <img src="https://picsum.photos/2000/3000" alt={productSuppliers[0]['product']["images"][0]["alt"]} className="image img-fluid" style={{ width:"100%"}} />


                    <CardTitle className={"image-bottom-left-title  p-1"}>

                        <span className="font-weight-bold">

                          {/* Permet d'injecter la traduction d'une valeur reçu par une entité
                            intl.formatMessage({
                              id: "app.category.item"+productSuppliers[0]["id"]+".name",
                              description: "category item - name for item "+productSuppliers[0]["id"],
                              defaultMessage: productSuppliers[0]["name"]
                            })
                          */}
                          {productSuppliers[0]["product"]["title"].replace(/(([^\s]+\s\s*){8})(.*)/,"$1…")}
                        </span>


                    </CardTitle>
                  </div>
                </Link>

                <CardFooter>
                  <Rating rating={productSuppliers[0]["rating"]} />

                  <p>
                    À partir de : {productSuppliers[0]["finalPrice"].toFixed(2)} &euro;
                  </p>
                  <ButtonAddShoppingCard buttonLabel={"Ajouter au panier"} product={productSuppliers[0]} history={this.props.history}/>
                  {/*
                  <Link to={'/shopping_card/add/'+productSuppliers[0]['id']} className={"btn btn-outline-primary d-block mx-auto my-2"}>
                    <FormattedMessage  id={"app.button.add_shopping_card"}
                                       defaultMessage="Ajouter au panier"
                                       description=" Button - Add to shopping card"
                    />
                  </Link>
                  */}

                </CardFooter>
              </Card>
            </Col>
          </Row>
        </CarouselItem>
      );
    }


    return rows;

  }


  render() {
    const { activeIndex } = this.state;

    const items = this.props.retrieved  !== null ? this.showProductSuppliers() : {};

    (process.env.DEBUG === 1) && console.log('Product suppliers', items);

    const styleCarouselInner = {
        margin: "0 40px"
    };

    return <Fragment>
        <div className={"supplier-products-offer w-100 my-3 py-2  "}>
          <h3 className={'text-center'}>Produits proposés</h3>

          {this.props.loading && (
            <div className="alert alert-light col-lg-3 mx-auto" role="status">
              <Spinner type={'grow'} color={'info'} className={'mx-auto'}/>
              <strong className={'mx-2 align-baseline'} style={{fontSize: '1.75rem'}}>
                <FormattedMessage id={'app.loading'}
                                  defaultMessage={'Chargement en cours'}
                                  description={'App - Loading'}
                />
              </strong>
            </div>
          )}
          {this.props.error && <div className="alert alert-danger">{this.props.error}</div>}



            {this.props.retrieved &&
              <Carousel
                  activeIndex={activeIndex}
                  next={this.next}
                  previous={this.previous}
                  style={styleCarouselInner}
                  className={" col-lg-12"}
                  interval={false}
              >


                  {this.props.retrieved && items}

                  <CarouselIndicators items={this.props.retrieved && items}
                                      activeIndex={activeIndex}
                                      onClickHandler={this.goToIndex}
                  />
                  <CarouselControl direction={"prev"} directionText={"Précédent"} onClickHandler={this.previous} className={"col-lg-1"}/>
                  <CarouselControl direction={"next"} directionText={"Suivant"} onClickHandler={this.next}/>

              </Carousel>
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
  retrieved: state.supplierproduct.listByProductId.retrieved,
  error: state.supplierproduct.listByProductId.error,
  loading: state.supplierproduct.listByProductId.loading,
  eventSource: state.supplierproduct.listByProductId.eventSource,
});

const mapDispatchToProps = dispatch => ({
  retrieveBySupplierId: id => dispatch(retrieveBySupplierId(id)),
  reset: eventSource => dispatch(reset(eventSource))
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(CarouselProductSuppliers));
