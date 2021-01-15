import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { retrieve, reset } from '../../actions/supplierproduct/show';
import { listBySupplierProductId as listComments, reset as resetComments } from '../../actions/comment/list';
import Rating from "../../layout/Rating";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from "react-intl";
import ButtonAddToFavorite2 from "../favorite/ButtonAddToFavorite2";
import SupplierProductCommentsWidget from "../comment/SupplierProductCommentsWidget";
import ButtonAddToShoppingCart2 from "../shoppingcart/ButtonAddToShoppingCart2";
import SupplierShowWidget from "../supplier/SupplierShowWidget";
import {toastError} from "../../layout/ToastMessage";
import {SpinnerLoading} from "../../layout/Spinner";
import AwesomeSlider from "react-awesome-slider";
import CoreStyles from "react-awesome-slider/src/core/styles.scss";
import AwesomeSliderStyles from "react-awesome-slider/src/styled/cube-animation/cube-animation.scss";
import {
  Button,
  IconButton
} from "@material-ui/core";
import { withStyles } from "@material-ui/core";

const styles = theme => ({
  buttonWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '25rem'
  },
  buttonAddShoppingCart: {},
  buttonAddFavorite: {}
});

class Show extends Component {
  static propTypes = {
    retrieved: PropTypes.object,
    loading: PropTypes.bool,
    error: PropTypes.string,
    eventSource: PropTypes.instanceOf(EventSource),
    retrieve: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    deleteError: PropTypes.string,
    deleted: PropTypes.object,
  };

  componentDidMount() {

    this.props.retrieve(decodeURIComponent(this.props.match.params.id), this.props.history, this.props.location);

    if(localStorage.getItem('token'))
      this.props.listComments({supplier_product: decodeURIComponent(this.props.match.params.id)},'comments/supplier_product',this.props.history, this.props.location );
  }

  componentWillUnmount() {
    this.props.reset(this.props.eventSource);
    this.props.resetComments(this.props.eventSourceComments);
  }

  render() {
    const { error, classes } = this.props;

    if (this.props.deleted) return <Redirect to="../.." />;

    const item = this.props.retrieved && this.props.retrieved;
    const comments = this.props.retrievedComments && this.props.retrievedComments['hydra:member'] ;
    const user = localStorage.getItem('token')  ? JSON.parse(atob(localStorage.getItem('token').split('.')[1])) : null;


    error && toastError(error);

    if(this.props.loading){
      return (
        <div className="spinner-loading-page">
          <SpinnerLoading message={'Chargement du produit'}/>
        </div>
      );
    }

    return (
      <div>

        {item && (
          <div id={'supplier-product-show'} className="container">

            <div className="table-row h-100">
              <div className="px-3">
                <div className="content">
                  <div className="mt-80 mb80">
                    <div className="detail-banner" style={{backgroundImage: `url(${item.images[0].url})`}}>
                      <div className="container">
                        <div className="detail-banner-left">
                          <div className="detail-banner-info">
                            <div className="detail-label">
                              {item.product.category.name}
                            </div>
                            <div className="detail-verified">
                              <FormattedMessage
                                id={'app.verified'}
                                defaultMessage={"Vérifié"}
                              />
                            </div>
                          </div>
                          {/* /.detail-banner-info */}

                          <h2 className="detail-title">
                            {item.product.title}
                          </h2>

                          <div className="detail-banner-address">
                            <i className="fa fa-map-o"></i>
                            <p>
                              {item.product.resume}
                            </p>
                          </div>
                          {/* /.detail-banner-address */}

                          {/*/.detail-banner-rating */}
                           <div className="detail-banner-rating">
                             <Rating rating={item.rating} />
                             <p>
                               {item.finalPrice.toFixed(2) +' €'}
                             </p>
                           </div>
                          { user && !user.roles.includes('ROLE_SUPPLIER') && (
                            <div className={classes.buttonWrapper}>
                              <div className={classes.buttonAddShoppingCart}>
                                <ButtonAddToShoppingCart2 product={item}/>
                              </div>

                              <div className={classes.buttonAddFavorite}>
                                <ButtonAddToFavorite2 supplierProductId={item.id}/>
                              </div>
                            </div>

                          )}
                          {/* /.detail-claim */}

                        </div>
                        {/* /.detail-banner-left */}
                      </div>
                      {/* /.container */}
                    </div>
                    {/* /.detail-banner */}

                  </div>

                  <div className="container">
                    <div className="row detail-content mt-2">
                      <div className="col-sm-7">
                        <div className="detail-gallery my-2">
                          <div className="detail-gallery-preview">
                            <div id="sp-show-slider">
                              <AwesomeSlider
                                animation={'cubeAnimation'}
                                cssModule={[ CoreStyles, AwesomeSliderStyles]}
                              >
                                {item.images.map((image, index) => (
                                  <div data-src={ image.url } key={index}/>
                                ))}
                              </AwesomeSlider>
                            </div>

                          </div>

                          <div className="detail-description">
                            <h4>
                              <FormattedMessage
                                id={"app.product_description"}
                                defaultMessage={"Description du produit"}
                                description={"Supplier Product - Product Description"}
                              />
                            </h4>
                            <p>{item.product.description}</p>
                          </div>
                        </div>
                        {/* /.detail-gallery */}


                        {localStorage.getItem('token') !== null && comments && (
                          <SupplierProductCommentsWidget id={item.id}/>
                        )}
                      </div>
                      {/* /.col-sm-7 */}

                      <div className="col-sm-5">

                        <div className=" bg-white p-2">
                          {
                            localStorage.getItem('token') !== null && comments && (
                              <div>
                                <div className="detail-overview-hearts">
                                  <i className="fa fa-heart"></i>
                                  <strong>{comments.filter(item => item.rating >= 3.5).length}</strong>
                                  <span>&nbsp;
                                personnes ont aimé le produit
                              </span>
                                </div>
                                <div className="detail-overview-rating">
                                  <FontAwesomeIcon icon={["fas","star"]} /> <strong>{item['rating']} / 10
                                </strong>
                                  &nbsp;
                                  sur
                                  &nbsp;
                                  <a href="#reviews">
                                    {comments.length}&nbsp;commentaires
                                  </a>
                                </div>
                              </div>
                            )
                          }



                          <div className="detail-actions row">
                            <div className="col-sm-4">
                              <div
                                className={
                                  "btn btn-primary btn-book"
                                  + ((user === null || !user.roles.includes('ROLE_SUPPLIER')) && ' disabled')
                                }
                              >
                                <FontAwesomeIcon icon="shopping-cart" />
                                <span className="d-block">Commander</span>
                              </div>
                            </div>
                            {/* /.col-sm-4 */}
                            <div className="col-sm-4">
                              <div className="btn btn-secondary btn-share">
                                <FontAwesomeIcon icon="share-alt" />
                                <span className="d-block">Partager</span>
                                <div className="share-wrapper">
                                  <ul className="share">
                                    <li><FontAwesomeIcon icon={['fab','facebook']}/> Facebook</li>
                                    <li><FontAwesomeIcon icon={['fab','twitter']} /> Twitter</li>
                                    <li><FontAwesomeIcon icon={["fab","google-plus"]}/> Google+</li>
                                    <li><FontAwesomeIcon icon={['fab', "pinterest"]}/> Pinterest</li>
                                    <li><FontAwesomeIcon icon={["fas","plus"]}/> Link</li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                            {/* /.col-sm-4 */}
                            <div className="col-sm-4">
                              <div className="btn btn-secondary btn-claim">
                                <FontAwesomeIcon icon="handshake"/>
                                <span className="d-block">
                                  Evaluation
                                </span>
                              </div>
                            </div>
                            {/* /.col-sm-4 */}
                          </div>
                          {/* /.detail-actions */}
                        </div>


                        <div>
                          <h4>Fournisseur :  <span className="text-secondary">{item.supplier.brandName}</span></h4>
                          <div className="bg-white p-2">
                            <SupplierShowWidget supplierId={item.supplier.id}/>
                          </div>
                        </div>


                        <div>
                          <h2>Catégorie</h2>

                          <div className="bg-white p-2">
                            <h4>{item.product.category.name}</h4>
                            <p>{item.product.category.description}</p>
                          </div>
                          {/* /.category-detail */}
                        </div>


                        <h2>
                          <FormattedMessage id={'app.page.supplier_product.form.contact_supplier'}
                                            defaultMessage={'Contactez le fournisseur'}
                                            description={'Page Supplier product - form contact supplier'}
                          />
                        </h2>

                        <div className="detail-enquire-form bg-white p-2">
                          <form method="post" action="?">
                            <div className="form-group">
                              <label htmlFor="">Nom</label>
                              <input type="text" className="form-control" name="" id="" />
                            </div>
                            {/* /.form-group */}

                            <div className="form-group">
                              <label htmlFor="">Email <span className="required">*</span></label>
                              <input type="email" className="form-control" name="" id="" required />
                            </div>
                            {/* /.form-group */}

                            <div className="form-group">
                              <label htmlFor="">Message <span className="required">*</span></label>
                              <textarea className="form-control" name="" id="" rows="5" required></textarea>
                            </div>
                            {/* /.form-group */}

                            <p>Champ requis marqué par <span className="required">*</span></p>

                            <button className="btn btn-primary btn-block" type="submit">
                              <FontAwesomeIcon icon="paper-plane" /><span className="ml-2">Envoyer</span>
                            </button>
                          </form>
                        </div>
                        {/* /.detail-enquire-form */}


                        <div className="detail-payments">
                          <h3>Moyens de paiement acceptés</h3>

                          <ul>
                            <li><IconButton color={'primary'} component={'a'}><FontAwesomeIcon icon={['fab','paypal']}/></IconButton></li>
                            <li><IconButton color={'primary'} component={'a'}><FontAwesomeIcon icon={['fab',"cc-amex"]} /></IconButton></li>
                            <li><IconButton color={'primary'} component={'a'}><FontAwesomeIcon icon={['fab',"cc-mastercard"]} /></IconButton></li>
                            <li><IconButton color={'primary'} component={'a'}><FontAwesomeIcon icon={['fab',"cc-stripe"]} /></IconButton></li>
                            <li><IconButton color={'primary'} component={'a'}><FontAwesomeIcon icon={['fab',"cc-visa"]} /></IconButton></li>
                          </ul>
                        </div>
                      </div>
                      {/* /.col-sm-5 */}

                    </div>
                    {/* /.row */}

                  </div>
                  {/* /.container */}

                </div>
                {/* /.content */}
              </div>
              {/* /.main-inner */}
            </div>
            {/* /.main */}

          </div>

        )}


      </div>
    );
  }

  renderLinks = (type, items) => {
    if (Array.isArray(items)) {
      return items.map((item, i) => (
        <div key={i}>{this.renderLinks(type, item)}</div>
      ));
    }

    return (
      <Link to={`../../${type}/show/${encodeURIComponent(items)}`}>
        {items}
      </Link>
    );
  };
}

const mapStateToProps = state => {
  const {retrieved, error, loading, deleted, eventSource} = state.supplierproduct.show;
  const {
    retrieved: retrievedComments,
    error: errorComments,
    loading: loadingComments,
    eventSource: eventSourceComments
  } = state.comment.list;

  return {
    retrieved,
    retrievedComments,
    error,
    errorComments,
    loading,
    loadingComments,
    deleted,
    eventSource,
    eventSourceComments
  };
};

const mapDispatchToProps = dispatch => ({
  retrieve: (id, history, location) => dispatch(retrieve(id, history, location)),
  reset: eventSource => dispatch(reset(eventSource)),
  listComments: (options,page, history) => dispatch(listComments(options, page, history)),
  resetComments: eventSourceComments => dispatch(resetComments(eventSourceComments))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Show));
