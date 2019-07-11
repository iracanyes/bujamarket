import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { list, reset } from '../../actions/category/list';
import { success } from '../../actions/category/delete';

import 'bootstrap/dist/css/bootstrap.css';
/* Carousel */
import {
  Card,
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption,
} from 'reactstrap';

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
    this.createCarouselItems = this.createCarouselItems.bind(this);

  }

  /*
  componentWillMount() {
    this.props.list();
  }
  */

  componentDidMount() {
    this.props.list();
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

      const categories = this.props.retrieved['hydra:member'] && this.props.retrieved['hydra:member'][0];
      const images = this.props.retrieved['hydra:member'] && this.props.retrieved['hydra:member'][1];
      const {activeIndex} = this.state;

      /* Carousel Element */
      for(let i = 0; i< Math.ceil(images.length / 6); i++ ){

          let rows = [];

          /* Row in Carousel Element */
          for(let j = 0; j < 2 ; j++){

              let categ= [];

              /* Category & Image */
              let styleImage = {
                  width: 120,
                  margin: "0 auto",
                  display: "block",
                  borderRadius: "25% 20% 0% 25%"
              };

              let styleTitle={
                  textAlign: 'center'
              };

              for(let k= 0; k < 3; k++) {
                  console.log("ID image : " + (i * 6 + j * 2 + k));

                  if (images[(i * 6 + j * 2 + k)] && categories[(i * 6 + j * 2 + k)]){

                      categ.push(
                          <div key={'categ' + k} className="col-sm-4 m-10">
                              <img src={images[(i * 6 + j * 2 + k)].url} alt={images[(i * 6 + j * 2 + k)].alt} />
                              <h4>{categories[(i * 6 + j * 2 + k)].name}</h4>
                          </div>
                      );
                  }else{
                      categ.push(
                          <div key={'categ' + k} className="col-sm-4 m-10">
                              <img src={'https://lorempixel.com/1200/900/?14437'} alt={'No Categories'} />
                              <h4>...</h4>
                          </div>
                      )
                  }
              }

              rows.push(
                  <div className={"row"} key={'rows'+j}>
                      {categ}
                  </div>
              );
          }


          items.push(
              <CarouselItem
                  onExiting={this.onExiting}
                  onExited={this.onExited}
                  key={ 'carouselItem'+i }
                  className={"owl-rows"}
              >
                  {rows}
              </CarouselItem>
          );
      }

      console.log("ITEMS ");
      console.log(items);
      return items;

  }


  render() {
    const { activeIndex } = this.state;

    const items = this.props.retrieved  !== null ? this.createCarouselItems() : {};

    const styleCarouselInner = {
        margin: "0 40px"
    };

    return <Fragment>
        <div>


          {this.props.loading && <div className="alert alert-info">Loading...</div>}
          {this.props.deletedItem && <div className="alert alert-success">{this.props.deletedItem['@id']} deleted.</div>}
          {this.props.error && <div className="alert alert-danger">{this.props.error}</div>}

          {/*
          <p><Link to="create" className="btn btn-primary">Create</Link></p>
          */}

            {this.props.retrieved &&
              <Carousel
                  activeIndex={activeIndex}
                  next={this.next}
                  previous={this.previous}
                  style={styleCarouselInner}
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

export default connect(mapStateToProps, mapDispatchToProps)(CarouselCategories);
