import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import PropTypes from 'prop-types';
import { getNamesWithImage, reset } from '../../actions/category/getNamesWithImage';
import { success } from '../../actions/category/delete';
import { injectIntl } from "react-intl";
import {toastError} from "../../layout/ToastMessage";

/* Carousel */
import {
  Col,
  Row,
  CardTitle,
} from "reactstrap";
import {
  Paper,
  Card,
  CardHeader,
  CardMedia, Grid,

} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import {SpinnerLoading} from "../../layout/Spinner";
import AwesomeSlider from "react-awesome-slider";
import AwesomeSliderStyles from "react-awesome-slider/src/styled/fold-out-animation/fold-out-animation.scss";
import BackgroundImageItems from '../../assets/img/abstract-art-black-and-white.jpg';
import BackgroundImageItem from '../../assets/img/parallax-gris.jpg';
import { grey } from "@material-ui/core/colors";

const styles = theme =>  ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    paddingLeft: '7.5rem',
    paddingRight: '7.5rem'
  },
  gridContainer: {

  },
  gridItem: {
    //margin: theme.spacing(1)
  },
  cardLink: {
    "&:hover": {
      textDecoration: 'unset'
    }
  },
  cardHeader: {
    "& .MuiCardHeader-title": {
      fontSize: '1rem',
      fontFamily: 'Montserrat',
      color: grey[700],
      "&:hover": {
        textDecoration: 'unset'
      }

    }
  },
  cardMedia: {
    height: '7.5rem'
  }
});

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

    const { intl, classes } = this.props;

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
            <Grid item
              key={"categories" + (i * 12 + j)}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              className={classes.gridItem}
            >
              <Paper elevation={3}>
                <Card>
                  <Link
                    to={'/products'}
                    className={classes.cardLink}
                  >
                    <CardHeader
                      title={intl.formatMessage({
                        id: "app.page.category.all_category.title",
                        description: "category item - all category ",
                        defaultMessage: "Toutes les catégories"
                      })}
                      subheader={''}
                      className={classes.cardHeader}
                    />
                    <CardMedia
                      image={BackgroundImageItems}
                      title={intl.formatMessage({
                        id: "app.page.category.all_category.title",
                        description: "category item - all category ",
                        defaultMessage: "Toutes les catégories"
                      })}
                      className={classes.cardMedia}
                    />
                  </Link>

                </Card>
              </Paper>
            </Grid>
          );

          // Ajout de la première catégorie de produit
          resultsPer12.push(
            <Grid
              item
              key={"category" + (i * 12 + j)}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              className={classes.gridItem}
            >
              <Paper elevation={3}>
                <Card>
                  <Link
                    to={`categories/show/${encodeURIComponent(categories[i * 12 + j]['id'])}`}
                    className={classes.cardLink}
                  >
                    <CardHeader
                      title={categories[i * 12 + j]["name"]}
                      subheader={''}
                      className={classes.cardHeader}
                    />
                    <CardMedia
                      image={categories[i * 12 + j]['url']}
                      title={categories[i * 12 + j]["name"]}
                      className={classes.cardMedia}
                    />
                  </Link>
                </Card>
              </Paper>
            </Grid>
          );

        }

        if(j > 0 && categories[i * 12 + j])
        {

          resultsPer12.push(
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={"category" + (i * 12 + j)}
              className={classes.gridItem}
            >
              <Paper elevation={3}>
                <Card>
                  <Link
                    to={`categories/show/${encodeURIComponent(categories[i * 12 + j]['id'])}`}
                    className={classes.cardLink}
                  >
                    <CardHeader
                      title={categories[i * 12 + j]["name"]}
                      subheader={''}
                      className={classes.cardHeader}
                    />
                    <CardMedia
                      image={categories[i * 12 + j]['url']}
                      title={categories[i * 12 + j]["name"]}
                      className={classes.cardMedia}
                    />
                  </Link>

                </Card>
              </Paper>
            </Grid>
          );
        }

      }

      rows.push(
        <div
          data-src={BackgroundImageItem}
          key={i}
          className={classes.root}
        >
          <Grid
            container
            spacing={3}
            key={"category_rows" + (i)}
            className={classes.gridContainer}
          >
            {resultsPer12}
          </Grid>
        </div>
      );
    }

    return rows;

  }

  render() {
    const { error, loading } = this.props;
    /* Affichage des erreurs */
    error && toastError(error);

    return <Fragment>
        <div className={"list-categories"}>
          {loading &&
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

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CarouselCategories)));
