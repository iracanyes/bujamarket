import React, { Component, Fragment } from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import {injectIntl, FormattedMessage} from "react-intl";
import AwesomeSlider from 'react-awesome-slider';
import CoreStyles from 'react-awesome-slider/src/core/styles.scss';
import AwesomeSliderStyles from 'react-awesome-slider/src/styled/fall-animation';
import * as homepageImages from "../assets/img/homepage";


class HomepageSlider extends Component
{
  render(){


    return (
      <Fragment>
        {/*  */}
        <AwesomeSlider
          animation={'fallAnimation'}
          cssModule={[CoreStyles, AwesomeSliderStyles]}
        >
          {Object.values(homepageImages.default).map( (url, index) => (
            <div data-src={url} key={index} className={'homepage-slider-content'}>
              {console.log(index + ' => ' + url )}
              {console.log(typeof index )}
              {index === 0 && (
                <div className={'awssld__content'}>
                  <div className="title">
                    <h1>
                      <FormattedMessage
                        id={'app.homepage.welcome'}
                        defaultMessage={"Bienvenue sur Buja Market"}
                        description={"Homepage  - Welcome"}
                      />
                    </h1>
                    <h4>
                      <FormattedMessage
                        id={"app.homepage.slider.title2"}
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
                        defaultMessage={"Voir toutes les catégories"}
                        description={"Button - See all categories"}
                      />
                    </a>
                  </div>

                </div>
              )}
              { index === 1 && (
                <div className={'awssld__content'}>
                  <h4>
                    <FormattedMessage
                      id={"app.homepage.slider.title2"}
                      defaultMessage={"Un suivi de vos commandes en temps réel jusqu'à destination"}
                      description={"Homepage - Title 2"}
                    />
                  </h4>
                  <a
                    className={'btn btn-outline-primary'}
                    href={'#home-carousel-categories'}
                  >
                    <FormattedMessage
                      id={"app.button.see_favorite_products"}
                      defaultMessage={"Voir les produits favoris"}
                      description={"Button - See favorite products"}
                    />
                  </a>
                </div>
              )}
              { index === 2 && (
                <div className={'awssld__content'}>
                  <h4>
                    <FormattedMessage
                      id={"app.homepage.slider.title3"}
                      defaultMessage={"Tous vos achats sont sécurisés par Stripe (un des meilleurs plateformes de paiement sécurisés en ligne)"}
                      description={"Homepage - Title 3"}
                    />
                  </h4>
                  <a
                    className={'btn btn-outline-primary'}
                    href={'#home-carousel-categories'}
                  >
                    <FormattedMessage
                      id={"app.button.see_products"}
                      defaultMessage={"Voir les produits"}
                      description={"Button - See all products"}
                    />
                  </a>
                </div>
              )}
            </div>
          ))}
        </AwesomeSlider>
      </Fragment>
    );
  }
}

export default withRouter(injectIntl(HomepageSlider));
