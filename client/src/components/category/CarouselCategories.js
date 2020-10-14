import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getNamesWithImage, reset } from '../../actions/category/getNamesWithImage';
import { success } from '../../actions/category/delete';
import { injectIntl } from "react-intl";
import 'bootstrap/dist/css/bootstrap.css';
import { toast } from "react-toastify";
import { ToastError } from "../../layout/ToastMessage";

/* Carousel */
import {
  Col,
  Row,
  Card,
  CardTitle,
} from "reactstrap";
import {SpinnerLoading} from "../../layout/Spinner";
import AwesomeSlider from "react-awesome-slider";
import AwesomeSliderStyles from "react-awesome-slider/src/styled/fold-out-animation/fold-out-animation.scss";
import BackgroundImageItems from '../../assets/img/abstract-art-black-and-white.jpg';
import BackgroundImageItem from '../../assets/img/parallax-gris.jpg';

class CarouselCategories extends Component {
  static propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    retrieved: PropTypes.object,
    deletedItem: PropTypes.object,
    getNamesWithImage: PropTypes.func.isRequired,
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
    this.props.getNamesWithImage();
  }


  componentWillUnmount() {
    this.props.reset();
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

    let rows = [];

    for(let i = 0; i < Math.ceil(categories.length / 12 ); i++)
    {

      let resultsPer12 = [];


      for(let j = 0; (i !== 0) ? (j <= 12) : (j < 11); j++)
      {

        if(j === 0 && i === 0)
        {
          // Ajout de tous les catégories de produit
          resultsPer12.push(
            <Col key={"categories" + (i * 12 + j)} xs={"12"} sm="6" md="4" lg="3">
              <Card body className={" text-white bg-dark"}>
                <Link to={"/products"}>
                  <div className="card-img-custom">
                    <img src={BackgroundImageItems} alt={""} className="image img-fluid" style={{ width:"100%"}} />
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

          // Ajout de la première catégorie de produit
          resultsPer12.push(
            <Col key={"category" + (i * 12 + j)} xs={"12"} sm="6" md="4" lg="3">
              <Card body className={" text-white bg-dark"}>
                <Link

                  to={`categories/show/${encodeURIComponent(categories[i * 12 + j]['id'])}`}
                >
                  <div className="card-img-custom">
                    <img src={categories[i * 12 + j]['url']} alt={categories[i * 12 + j]["name"]} className="image img-fluid" style={{ width:"100%"}} />

                    <CardTitle className={"image-bottom-left-title"}>

                      <span className="font-weight-bold">
                        {categories[i * 12 + j]["name"]}
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
                    <img src={categories[i * 12 + j]['url']} alt={categories[i * 12 + j]["name"]} className="image img-fluid" style={{ width:"100%"}} />

                    <CardTitle className={"image-bottom-left-title"}>
                      <span className="font-weight-bold">
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
        <div
          data-src={BackgroundImageItem}
          key={i}
          className={'col-10'}
        >
          <Row
            key={"category_rows" + (i)}
            className={'justify-content-center'}
          >
            {resultsPer12}
          </Row>
        </div>
      );
    }

    return rows;

  }

  render() {

    this.props.error && toast(<ToastError message={this.props.error} />);

    return <Fragment>
        <div className={"list-categories"}>
          {this.props.loading &&
            <SpinnerLoading message={"Chargement des catégories de produit"} />
          }

          { this.props.retrieved && (
            <AwesomeSlider
              animation={'foldOutAnimation'}
              cssModule={AwesomeSliderStyles}
            >
              {this.props.retrieved['hydra:member'] && (
                this.showCategories()
              )}
            </AwesomeSlider>
          )}


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
    retrieved: state.category.getNamesWithImage.retrieved,
    error: state.category.getNamesWithImage.error,
    loading: state.category.getNamesWithImage.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getNamesWithImage: (page) => dispatch(getNamesWithImage(page)),
    reset: () => {
      dispatch(reset());
      dispatch(success(null));
    },
  };
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(CarouselCategories));
