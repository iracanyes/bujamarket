import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { list, reset } from '../../actions/category/list';
import { success } from '../../actions/category/delete';
import { injectIntl } from "react-intl";
import 'bootstrap/dist/css/bootstrap.css';
/* Carousel */
import {
  Col,
  Row,
  Card,
  CardTitle,
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
} from "reactstrap";
import { FormattedMessage } from "react-intl";

class CarouselCategories extends Component {
  static propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    retrieved: PropTypes.object,
    deletedItem: PropTypes.object,
    list: PropTypes.func.isRequired,
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
    this.showCategories = this.showCategories.bind(this);

  }


  componentDidMount() {
    this.props.list();
  }

  /*
  componentWillUnmount() {
    this.props.reset();
  }
  */


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

    const nextIndex = this.state.activeIndex === (Math.ceil(this.props.retrieved['hydra:member'].length / 12) - 1) ? 0 : this.state.activeIndex + 1;
    this.setState({activeIndex: nextIndex});

  }

  previous()
  {
    if(this.animating) return;

    const nextIndex = this.state.activeIndex === 0 ? (Math.ceil(this.props.retrieved['hydra:member'].length / 12) - 1) : this.state.activeIndex -1;
    this.setState({activeIndex: nextIndex});
  }

  goToIndex(nexIndex)
  {
    if(this.animating) return;
    this.setState({ activeIndex: nexIndex });
  }


  showCategories()
  {

    const { intl } = this.props;

    const categories = this.props.retrieved && this.props.retrieved["hydra:member"];


    // console.log("Résultats catégories", categories);

    let rows = [];

    for(let i = 0; i < Math.ceil(categories.length / 12 ); i++)
    {

      let resultsPer12 = [];

      for(let j = 0; j < 12; j++)
      {
        if(process.env.DEBUG === 1 )
        {
          console.log("Résultats catégorie" + j, categories[i * 12 + j]);
        }



        if(j === 0 && i === 0)
        {
          resultsPer12.push(
            <Col key={"categories" + (i * 12 + j)} xs={"12"} sm="6" md="4" lg="3">
              <Card body className={" text-white bg-dark"}>
                <Link to={"/products/"}>
                  <div className="card-img-custom">
                    <img src="https://picsum.photos/2000/3000" alt={categories[i * 12 + j]["image"]["alt"]} className="image img-fluid" style={{ width:"100%"}} />
                    <div className="middle">
                      <div className="btn btn-outline-info text">
                        <FormattedMessage  id={"app.page.customer.list.button.see_more"}
                                           defaultMessage="Voir plus"
                                           description="Customers list - button see more"
                        />
                      </div>

                    </div>
                    <CardTitle className={"image-bottom-left-title"}>

                      <span className="font-weight-bold">
                        {intl.formatMessage({
                          id: "app.page.category.all_category.title",
                          description: "category item - all category ",
                          defaultMessage: "Toutes les catégories"
                        })}
                      </span>


                    </CardTitle>
                  </div>
                </Link>


              </Card>
            </Col>
          );
        }

        if(j > 0 && categories[i * 12 + j])
        {

          resultsPer12.push(
            <Col key={"categories" + (i * 12 + j)} xs={"12"} sm="6" md="4" lg="3">
              <Card body className={" text-white bg-dark"}>
                <Link

                  to={`categories/show/${encodeURIComponent(categories[i * 12 + j]['id'])}`}
                >
                  <div className="card-img-custom">
                    <img src="https://picsum.photos/2000/3000" alt={categories[i * 12 + j]["image"]["alt"]} className="image img-fluid" style={{ width:"100%"}} />
                    <div className="middle">
                      <div className="btn btn-outline-info text">
                        <FormattedMessage  id={"app.page.customer.list.button.see_more"}
                                           defaultMessage="Voir plus"
                                           description="Customers list - button see more"
                        />
                      </div>

                    </div>
                    <CardTitle className={"image-bottom-left-title"}>

                      <span className="font-weight-bold">

                        {/* Permet d'injecter la traduction d'une valeur reçu par une entité
                          intl.formatMessage({
                            id: "app.category.item"+categories[i * 12 + j]["id"]+".name",
                            description: "category item - name for item "+categories[i * 12 + j]["id"],
                            defaultMessage: categories[i * 12 + j]["name"]
                          })
                        */}
                        {categories[i * 12 + j]["name"]}
                      </span>


                    </CardTitle>
                  </div>
                </Link>




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

    return rows;

  }


  render() {
    const { activeIndex } = this.state;

    const items = this.props.retrieved  !== null ? this.showCategories() : {};

    const styleCarouselInner = {
        margin: "0 40px"
    };

    return <Fragment>
        <div className={"list-categories"}>


          {this.props.loading && <div className="alert alert-info">Loading...</div>}
          {this.props.deletedItem && <div className="alert alert-success">{this.props.deletedItem['@id']} deleted.</div>}
          {this.props.error && <div className="alert alert-danger">{this.props.error}</div>}



            {this.props.retrieved &&
              <Carousel
                  activeIndex={activeIndex}
                  next={this.next}
                  previous={this.previous}
                  style={styleCarouselInner}
                  className={" col-lg-12"}
              >


                  {this.props.retrieved['hydra:member'] && items}

                  <CarouselIndicators items={this.props.retrieved['hydra:member'] && items} activeIndex={activeIndex} onClickHandler={this.goToIndex}/>
                  <CarouselControl direction={"prev"} directionText={"Précédent"} onClickHandler={this.previous}/>
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

const mapStateToProps = (state) => {
  return {
    retrieved: state.category.list.retrieved,
    error: state.category.list.error,
    loading: state.category.list.loading,
    deletedItem: state.category.del.deleted,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    list: (page) => dispatch(list(page)),
    reset: () => {
      dispatch(reset());
      dispatch(success(null));
    },
  };
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(CarouselCategories));
