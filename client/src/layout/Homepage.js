/**
 * Author: iracanyes
 * Date: 23/06/19
 * Description:
 */
import React, {Component, Fragment} from 'react';
//import '../assets/scss/page/_homepage.scss';

//import CarouselCategories from '../components/category/CarouselCategories';
//import CarouselRecentArticles from '../components/article/CarouselRecent';
//import CarouselRecentGrains from '../components/grain/CarouselRecent';
/* Appel des autres composants de la page home */
import './SidebarLeftMenu';
import './MainMenu';

export default class Homepage extends Component
{
  render(){
    return <Fragment>
      <section id="main-content" className="float-left">
        {/* Carousel - Categories  */}
        <section className="category-cards bg-transparent pt60 pb60">
          <div className="container-fluid">
            <h3>Catégories</h3>
            {/* <CarouselCategories/> */}
          </div>
          {/* .container */}
        </section>

        {/* Parallax image 1 */}
        <div className="parallax parallax-main parallax1 parallax-plus-box">

          <div className="card">
            <h5 className="card-header">Rejoignez-nous</h5>
            <div className="card-body">
              <h5 className="card-title">Envie de participer à la documentation</h5>
              <p className="card-text">
                Cette plateforme de documentation est géré directement par les membres. Envie de
                participer...
              </p>
              <p>
                <a className="btn btn-primary" data-toggle="collapse" href="#multiCollapseSignUp2"
                   role="button" aria-expanded="false" aria-controls="multiCollapseSignUp2">Devenir
                  membre</a>
                <button className="btn btn-primary" type="button" data-toggle="collapse"
                        data-target="#multiCollapseLogin2" aria-expanded="false"
                        aria-controls="multiCollapseLogin2">Login
                </button>
              </p>
              <div className="row">
                <div className="col">
                  <div className="collapse multi-collapse" id="multiCollapseSignUp2">
                    <h6>Inscription</h6>
                    <form>
                      <div className="form-row align-items-center">
                        <div className="col-lg-6 my-1">
                          <label className="sr-only" htmlFor="inlineFormInputLastname">Nom</label>
                          <input type="text" className="form-control" id="inlineFormInputLastname"
                                 placeholder="Dubois"/>
                        </div>
                        <div className="col-lg-6 my-1">
                          <label className="sr-only"
                                 htmlFor="inlineFormInputFirstname">Prénom</label>
                          <input type="text" className="form-control"
                                 id="inlineFormInputFirstname" placeholder="Jack"/>
                        </div>
                        <div className="col-lg-12 my-1">
                          <label className="sr-only" htmlFor="inlineFormInputGroupUsername">Adresse
                            e-mail</label>
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <div className="input-group-text">@</div>
                            </div>
                            <input type="text" className="form-control"
                                   id="inlineFormInputGroupUsername"
                                   placeholder="mon-adresse@email.com"/>
                          </div>
                        </div>
                        <div className="col-lg-12 my-1">
                          <label className="sr-only" htmlFor="inputPassword6">Mot de passe</label>
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <div className="input-group-text"><i
                                className="fas fa-unlock-alt"></i></div>
                            </div>
                            <input type="password" id="inputPassword6" className="form-control"
                                   aria-describedby="passwordHelpBlock"
                                   placeholder="Mot de passe"/>
                            <small id="passwordHelpBlock" className="form-text text-muted">
                              Your password must be 8-20 characters long, contain letters
                              and numbers, and must not contain spaces, special
                              characters, or emoji.
                            </small>
                          </div>
                        </div>


                        <div className="col-sm-12 my-1">
                          <div className="form-check">
                            <input className="form-check-input" type="checkbox"
                                   id="autoSizingCheck1"/>
                            <label className="form-check-label" htmlFor="autoSizingCheck1">
                              Lu et approuvé les <a href="#">conditions générales
                              d'utilisation de l'application</a>
                            </label>
                          </div>
                        </div>
                        <div className="col-auto my-1">
                          <button type="submit" className="btn btn-primary">Confirmer</button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="col">
                  <div className="collapse multi-collapse" id="multiCollapseLogin2">
                    <h6>Login</h6>
                    <form>
                      <div className="form-row align-items-center">
                        <div className="col-lg-12 my-1">
                          <label className="sr-only" htmlFor="inlineFormInputGroupUsername2">Adresse
                            e-mail</label>
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <div className="input-group-text">@</div>
                            </div>
                            <input type="text" className="form-control"
                                   id="inlineFormInputGroupUsername2"
                                   placeholder="mon-adresse@email.com"/>
                          </div>
                        </div>
                        <div className="col-lg-12 my-1">
                          <label className="sr-only" htmlFor="inputPassword4">Mot de passe</label>
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <div className="input-group-text"><i
                                className="fas fa-unlock-alt"></i></div>
                            </div>
                            <input type="password" id="inputPassword4" className="form-control"
                                   aria-describedby="passwordHelpBlock2"
                                   placeholder="Mot de passe"/>
                          </div>
                        </div>
                        <div className="col-sm-12 my-1">
                          <div className="form-check">
                            <input className="form-check-input" type="checkbox"
                                   id="autoSizingCheck2"/>
                            <label className="form-check-label" htmlFor="autoSizingCheck2">
                              Se souvenir de moi
                            </label>
                          </div>
                        </div>
                        <div className="col-auto my-1">
                          <button type="submit" className="btn btn-primary">Confirmer</button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Articles récents  */}

        { /*<CarouselRecentArticles/> */ }

        {/* Grains récents  */}

        { /* <CarouselRecentGrains/> */ }

        {/* Parallax image 2 */}
        <div className="parallax parallax-main parallax2 parallax-plus-box">

          <div className="card">
            <h5 className="card-header">Featured</h5>
            <div className="card-body">
              <h5 className="card-title">Special title treatment</h5>
              <p className="card-text">With supporting text below as a natural lead-in to additional
                content.</p>
              <a href="#" className="btn btn-primary">Go somewhere</a>
            </div>
          </div>
        </div>

        {/* Grains récents  */}

        { /* <CarouselRecentGrains/> */ }



      </section>
    </Fragment>

  }
}