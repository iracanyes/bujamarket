import React, { Component, Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import {injectIntl, FormattedMessage} from "react-intl";
import { withStyles } from "@material-ui/core/styles";
import AwesomeSlider from 'react-awesome-slider';
import CoreStyles from 'react-awesome-slider/src/core/styles.scss';
import AwesomeSliderStyles from 'react-awesome-slider/src/styled/fall-animation';
import * as homepageImages from "../assets/img/homepage";

const styles = theme => ({
  slideRoot: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',

  },
  slideWrapper1: {
    width: '50%',
    height: '100%',
    background: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    paddingLeft: '7.5rem',
    display: 'flex',
    alignItems: 'center'
  },
  slideWrapperRight: {
    width: '50%',
    height: '100%',
    background: 'linear-gradient(to left, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'
  },
  slideWrapperLeft: {
    width: '50%',
    height: '100%',
    background: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'
  },
  title1: {},
  sliderContent: {
    alignItems: 'center'
  },
});

class HomepageSlider extends Component
{
  render(){
    const { connectedUser, classes } = this.props;

    return (
      <Fragment>
        {/*  */}
        { Object.keys(connectedUser).length === 0 && (
          <AwesomeSlider
            animation={'fallAnimation'}
            cssModule={[CoreStyles, AwesomeSliderStyles]}
          >
            {Object.values(homepageImages.default).map( (url, index) => (
              <div data-src={url} key={index} className={'homepage-slider-content'}>
                {index === 0 && (
                  <div className={'awssld__content'}>
                    <div className={classes.slideRoot}>
                      <div className={classes.slideWrapper1}>
                        <div className={classes.sliderContent}>
                          <h1 className={classes.title1}>
                            {/*
                            <FormattedMessage
                              id={'app.homepage.welcome'}
                              defaultMessage={"Bienvenue sur"}
                              description={"Homepage  - Welcome"}
                            />
                            <br/>
                            */}
                            {process.env.REACT_APP_NAME}
                          </h1>
                          <h4>
                            <FormattedMessage
                              id={"app.homepage.slider.subtitle1"}
                              defaultMessage={"Produits d'artisanat manufacturé en Afrique de l'Est (Kenya, Ouganda, Tanzanie, Rwanda, Burundi, Congo*)"}
                              description={"Homepage - Title 2"}
                            />
                          </h4>
                          <a
                            className={'btn btn-outline-primary text-color'}
                            href={'#home-carousel-categories'}
                          >
                            <FormattedMessage
                              id={"app.button.see_categories"}
                              defaultMessage={"Visiter nos catégories de produit"}
                              description={"Button - Visit our products' categories"}
                            />
                          </a>
                        </div>
                      </div>
                      <div className={classes.slideWrapperRight} />
                    </div>
                  </div>
                )}
                { index === 1 && (
                  <div className={'awssld__content'}>
                    <div className={classes.slideRoot}>
                      <div className={classes.slideWrapper2}/>
                      <div className={classes.slideWrapper1}>
                        <div className={classes.sliderContent}>
                          <h4>
                            <FormattedMessage
                              id={"app.homepage.slider.title2"}
                              defaultMessage={"Un suivi de vos commandes en temps réel jusqu'à destination"}
                              description={"Homepage - Title 2"}
                            />
                          </h4>
                          <a
                            className={'btn btn-outline-primary'}
                            href={'#lovedByCustomers'}
                          >
                            <FormattedMessage
                              id={"app.button.see_favorite_products"}
                              defaultMessage={"Voir les produits favoris"}
                              description={"Button - See favorite products"}
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                { index === 2 && (
                  <div className={'awssld__content'}>
                    <div className={classes.slideRoot}>
                      <div className={classes.slideWrapper1}>
                        <div className={classes.sliderContent}>
                          <h4>
                            <FormattedMessage
                              id={"app.homepage.slider.title3"}
                              defaultMessage={"Paiement sécurisés par Stripe (un des meilleurs plateformes de paiement sécurisés en ligne où que l'on soit dans le monde entier)"}
                              description={"Homepage - Title 3"}
                            />
                          </h4>
                          <Link
                            className={'btn btn-outline-primary'}
                            to={'products'}
                          >
                            <FormattedMessage
                              id={"app.button.see_products"}
                              defaultMessage={"Voir les produits"}
                              description={"Button - See all products"}
                            />
                          </Link>
                        </div>
                      </div>
                      <div className={classes.slideWrapper2} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </AwesomeSlider>
        )}
      </Fragment>
    );
  };
}

const mapStateToProps = state => {
  const { login: connectedUser } = state.user.authentication;
  return { connectedUser };
};

export default connect(mapStateToProps)(withRouter(injectIntl(withStyles(styles)(HomepageSlider))));
