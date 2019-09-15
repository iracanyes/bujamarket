import React, { Component, Fragment } from 'react';
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
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
} from "reactstrap";

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

    const nextIndex = this.state.activeIndex === (Math.ceil(this.props.products.length / 12) - 1) ? 0 : this.state.activeIndex + 1;
    this.setState({activeIndex: nextIndex});

  }

  previous()
  {
    if(this.animating) return;

    const nextIndex = this.state.activeIndex === 0 ? (Math.ceil(this.props.products.length / 12) - 1) : this.state.activeIndex -1;
    this.setState({activeIndex: nextIndex});
  }

  goToIndex(nexIndex)
  {
    if(this.animating) return;
    this.setState({ activeIndex: nexIndex });
  }


  showProducts()
  {

    const { intl } = this.props;

    const products = this.props.products && this.props.products;


    //console.log("Résultats produits", products);

    let rows = [];

    if(products.length > 1)
    {
      for(let i = 0; i < Math.ceil(products.length / 12 ); i++)
      {

        let resultsPer12 = [];

        for(let j = 0; j < 12 && products[j]; j++)
        {
          if(process.env.DEBUG === 1 )
          {
            console.log("Résultats produit" + j, products[i * 12 + j]);
          }



          if(j > 0 && products[i * 12 + j])
          {

            resultsPer12.push(
              <Col key={"products" + (i * 12 + j)} xs={"12"} sm="6" md="4" lg="3">
                <Card body className={" text-white bg-dark"}>
                  <Link

                    to={`/products/show/${encodeURIComponent(products[i * 12 + j]['id'])}`}
                  >
                    <div className="card-img-custom">
                      <img src={products[i * 12 + j]["images"][0]['url']} alt={products[i * 12 + j]["images"][0]["alt"]} className="image img-fluid" style={{ width:"100%"}} />

                      <CardTitle className={"image-bottom-left-title"}>

                        <span className="font-weight-bold">

                          {/* Permet d'injecter la traduction d'une valeur reçu par une entité
                            intl.formatMessage({
                              id: "app.category.item"+products[i * 12 + j]["id"]+".name",
                              description: "category item - name for item "+products[i * 12 + j]["id"],
                              defaultMessage: products[i * 12 + j]["name"]
                            })
                          */}
                          {products[i * 12 + j]["title"]}
                        </span>


                      </CardTitle>
                    </div>
                  </Link>

                  <CardFooter>
                    <p>
                      À partir de : {products[i*12+j]["minimumPrice"]}
                    </p>
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
            <Col key={"products0"} xs={"12"} sm="6" md="4" lg="3">
              <Card body className={" text-white bg-dark"}>
                <Link

                  to={`/products/show/${encodeURIComponent(products[0]['id'])}`}
                >
                  <div className="card-img-custom">
                    <img src={products[0]["images"][0]['url']} alt={products[0]["images"][0]["alt"]} className="image img-fluid" style={{ width:"100%"}} />


                    <CardTitle className={"image-bottom-left-title"}>

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
        </CarouselItem>
      );
    }


    return rows;

  }


  render() {
    const { activeIndex } = this.state;

    const items = this.props.products  !== null ? this.showProducts() : {};

    const styleCarouselInner = {
        margin: "0 40px"
    };

    return <Fragment>
        <div className={"list-products my-3 py-2  "}>


          {this.props.loading && <div className="alert alert-info">Loading...</div>}
          {this.props.deletedItem && <div className="alert alert-success">{this.props.deletedItem['@id']} deleted.</div>}
          {this.props.error && <div className="alert alert-danger">{this.props.error}</div>}



            {this.props.products &&
              <Carousel
                  activeIndex={activeIndex}
                  next={this.next}
                  previous={this.previous}
                  style={styleCarouselInner}
                  className={" col-lg-12"}
              >


                  {this.props.products && items}

                  <CarouselIndicators items={this.props.products && items} activeIndex={activeIndex} onClickHandler={this.goToIndex}/>
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


export default injectIntl(CarouselCategoryProducts);
