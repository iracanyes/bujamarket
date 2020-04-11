import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { retrieve, reset } from '../../actions/supplierproduct/show';
import Rating from "../../layout/Rating";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Spinner } from "reactstrap";
import { FormattedMessage } from "react-intl";

class Show extends Component {
  static propTypes = {
    retrieved: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    eventSource: PropTypes.instanceOf(EventSource),
    retrieve: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    deleteError: PropTypes.string,
    deleted: PropTypes.object,
  };

  componentDidMount() {
    this.props.retrieve(decodeURIComponent(this.props.match.params.id));
  }

  componentWillUnmount() {
    this.props.reset(this.props.eventSource);
  }

  render() {
    if (this.props.deleted) return <Redirect to=".." />;

    const item = this.props.retrieved;

    return (
      <div>

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
        {this.props.error && (
          <div className="alert alert-danger" role="alert">
            <span className="fa fa-exclamation-triangle" aria-hidden="true" />{' '}
            {this.props.error}
          </div>
        )}
        {this.props.deleteError && (
          <div className="alert alert-danger" role="alert">
            <span className="fa fa-exclamation-triangle" aria-hidden="true" />{' '}
            {this.props.deleteError}
          </div>
        )}

        {item && (
          <div className="container">



            <div className="table-row h-100">
              <div className="px-3">
                <div className="content">
                  <div className="mt-80 mb80">
                    <div className="detail-banner" style={{backgroundImage: `url(${process.env.REACT_APP_API_ENTRYPOINT+ '/uploads/images/products/'+ item.product.images[0].url})`}}>
                      <div className="container">
                        <div className="detail-banner-left">
                          <div className="detail-banner-info">
                            <div className="detail-label">{item.product.category.name}</div>
                            <div className="detail-verified">Verified</div>
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
                           </div>

                          <div className="detail-banner-btn bookmark">
                            <FontAwesomeIcon icon="shopping-cart" className="menu-top-l1" />
                            <span data-toggle="Bookmarked" className={'ml-1'}>Ajouter au panier</span>
                          </div>
                          {/* /.detail-claim */}

                          <div className="detail-banner-btn heart">
                            <FontAwesomeIcon icon="heart" className="menu-top-l1" />
                            <span data-toggle="I Love It"  className={'ml-1'}>Ajouter aux favoris</span>
                          </div>
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
                            <a href="assets/img/tmp/gallery-1.jpg">
                              <img src="https://picsum.photos/200/300" alt={item.product.title} />
                            </a>
                          </div>

                          <ul className="detail-gallery-index">
                            {item.product.images.map((item, index) => (
                              <li className="detail-gallery-list-item active" key={index}>
                                <a data-target="assets/img/tmp/gallery-1.jpg" >
                                  <img src="https://picsum.photos/200/300" alt="..." />
                                </a>
                              </li>
                            ))}

                          </ul>
                        </div>
                        {/* /.detail-gallery */}

                        <h2 id="reviews">Avis des clients</h2>
                        <div className="reviews">
                          <div className="review bg-white">
                            <div className="review-image">
                              <img src="https://picsum.photos/200/300" alt="" />
                            </div>
                            {/* /.review-image */}

                            <div className="review-inner">
                              <div className="review-title">
                                <h2>Nancy Collins</h2>

                                <span className="report">
                                    <span className="separator">&#8226;</span><i className="fa fa-flag" title="Report"
                                                                                 data-toggle="tooltip"
                                                                                 data-placement="top"></i>
                                </span>

                                <div className="review-overall-rating">
                                  <span className="overall-rating-title">Avis client:</span>
                                  <Rating rating={item.rating}/>
                                </div>
                                {/* /.review-rating */}
                              </div>
                              {/* /.review-title */}

                              <div className="review-content-wrapper">
                                <div className="review-content">
                                  <div className="review-pros">
                                    <p>Quisque aliquet ornare nunc in viverra. Nullam ornare molestie ligula in luctus.
                                      Suspendisse ac cursus elit. In congue mattis felis, non hendrerit orci dictum
                                      id.</p>
                                  </div>
                                  {/* /.pros */}
                                  <div className="review-cons">
                                    <p>Duis et magna vel est tempus vehicula vitae sit amet enim. Sed vitae ligula
                                      congue.</p>
                                  </div>
                                  {/* /.cons */}
                                </div>
                                {/* /.review-content */}

                                <div className="review-rating">
                                  <dl>
                                    <dt>Description</dt>
                                    <dd>
                                       <FontAwesomeIcon icon={["fas","star"]} />
                                       <FontAwesomeIcon icon={["fas","star"]} />
                                       <FontAwesomeIcon icon={["fas","star"]} />
                                       <FontAwesomeIcon icon={["fas","star"]} />
                                       <FontAwesomeIcon icon={["fas","star"]} />
                                    </dd>
                                    <dt>Délai de livraison</dt>
                                    <dd>
                                       <FontAwesomeIcon icon={["fas","star"]} />
                                       <FontAwesomeIcon icon={["fas","star"]} />
                                       <FontAwesomeIcon icon={["fas","star"]} />
                                       <FontAwesomeIcon icon={["fas","star"]} />
                                       <FontAwesomeIcon icon={["far","star"]} />
                                    </dd>
                                    <dt>Qualité produit</dt>
                                    <dd>
                                       <FontAwesomeIcon icon={["fas","star"]} />
                                       <FontAwesomeIcon icon={["fas","star"]} />
                                       <FontAwesomeIcon icon={["fas","star"]} />
                                       <FontAwesomeIcon icon={["far","star"]} />
                                       <FontAwesomeIcon icon={["far","star"]} />
                                    </dd>
                                    <dt>Atmosphere</dt>
                                    <dd>
                                       <FontAwesomeIcon icon={["fas","star"]} />
                                       <FontAwesomeIcon icon={["fas","star"]} />
                                       <FontAwesomeIcon icon={["fas","star"]} />
                                       <FontAwesomeIcon icon={["far","star"]} />
                                       <FontAwesomeIcon icon={["far","star"]} />
                                    </dd>
                                  </dl>
                                </div>
                                {/* /.review-rating */}
                              </div>
                              {/* /.review-content-wrapper */}

                            </div>
                            {/* /.review-inner */}
                          </div>
                          {/* /.review */}

                          <div className="review bg-white">
                            <div className="review-image">
                              <img src="https://picsum.photos/200/300" alt="" />
                            </div>
                            {/* /.review-image */}

                            <div className="review-inner">
                              <div className="review-title">
                                <h2>Kim Glove</h2>
                                <span className="report">
                                    <span className="separator">&#8226;</span><i className="fa fa-flag" title="Report"
                                                                                 data-toggle="tooltip"
                                                                                 data-placement="top"></i>
                                </span>


                                <div className="review-overall-rating">
                                  <span className="overall-rating-title">Score Total :</span>
                                   <FontAwesomeIcon icon={["fas","star"]} />
                                   <FontAwesomeIcon icon={["fas","star"]} />
                                  <i className="fa fa-star-half-o"></i>
                                   <FontAwesomeIcon icon={["far","star"]} />
                                   <FontAwesomeIcon icon={["far","star"]} />
                                </div>
                                {/* /.review-rating */}
                              </div>
                              {/* /.review-title */}

                              <div className="review-content-wrapper">
                                <div className="review-content">
                                  <div className="review-pros">
                                    <p>Quisque aliquet ornare nunc in viverra. Nullam ornare molestie ligula in
                                      luctus.</p>
                                  </div>
                                  {/* /.pros */}
                                  <div className="review-cons">
                                    <p>Suspendisse ac cursus elit. In congue mattis felis, non hendrerit orci dictum id.
                                      Duis et magna vel est tempus vehicula vitae sit amet enim. Sed vitae ligula
                                      congue.</p>
                                  </div>
                                  {/* /.cons */}
                                </div>
                                {/* /.review-content */}

                                <div className="review-rating">
                                  <dl>
                                    <dt>Description</dt>
                                    <dd>
                                       <FontAwesomeIcon icon={["fas","star"]} />
                                       <FontAwesomeIcon icon={["fas","star"]} />
                                       <FontAwesomeIcon icon={["fas","star"]} />
                                       <FontAwesomeIcon icon={["fas","star"]} />
                                       <FontAwesomeIcon icon={["far","star"]} />
                                    </dd>
                                    <dt>Délai de livraison</dt>
                                    <dd>
                                       <FontAwesomeIcon icon={["fas","star"]} />
                                       <FontAwesomeIcon icon={["fas","star"]} />
                                       <FontAwesomeIcon icon={["far","star"]} />
                                       <FontAwesomeIcon icon={["far","star"]} />
                                       <FontAwesomeIcon icon={["far","star"]} />
                                    </dd>
                                    <dt>Qualité produit</dt>
                                    <dd>
                                       <FontAwesomeIcon icon={["fas","star"]} />
                                       <FontAwesomeIcon icon={["fas","star"]} />
                                       <FontAwesomeIcon icon={["fas","star"]} />
                                       <FontAwesomeIcon icon={["far","star"]} />
                                       <FontAwesomeIcon icon={["far","star"]} />
                                    </dd>
                                    <dt>Service client</dt>
                                    <dd>
                                       <FontAwesomeIcon icon={["fas","star"]} />
                                       <FontAwesomeIcon icon={["fas","star"]} />
                                       <FontAwesomeIcon icon={["far","star"]} />
                                       <FontAwesomeIcon icon={["far","star"]} />
                                       <FontAwesomeIcon icon={["far","star"]} />
                                    </dd>
                                  </dl>
                                </div>
                                {/* /.review-rating */}
                              </div>
                              {/* /.review-content-wrapper */}

                            </div>
                            {/* /.review-inner */}
                          </div>
                          {/* /.review */}

                          <div className="review  bg-white">
                            <div className="review-image">
                              <img src="https://picsum.photos/200/300" alt="" />
                            </div>
                            {/* /.review-image */}

                            <div className="review-inner">
                              <div className="review-title">
                                <h2>Richard Peterson</h2>
                                <span className="report">
                                    <span className="separator">&#8226;</span><i className="fa fa-flag" title="Report"
                                                                                 data-toggle="tooltip"
                                                                                 data-placement="top"></i>
                                </span>

                                <div className="review-overall-rating">
                                  <span className="overall-rating-title">Total Score:</span>
                                   <FontAwesomeIcon icon={["fas","star"]} />
                                   <FontAwesomeIcon icon={["fas","star"]} />
                                   <FontAwesomeIcon icon={["fas","star"]} />
                                   <FontAwesomeIcon icon={["fas","star"]} />
                                   <FontAwesomeIcon icon={["fas","star"]} />
                                </div>
                                {/* /.review-rating */}
                              </div>
                              {/* /.review-title */}

                              <div className="review-content-wrapper">
                                <div className="review-content">
                                  <div className="review-pros">
                                    <p>Quisque aliquet ornare nunc in viverra. Nullam ornare molestie ligula in luctus.
                                      Suspendisse ac cursus elit. In congue mattis felis, non hendrerit orci dictum
                                      id.</p>
                                  </div>
                                  {/* /.pros */}
                                  <div className="review-cons">
                                    <p>Duis et magna vel est tempus vehicula vitae sit amet enim. Sed vitae ligula
                                      congue.</p>
                                  </div>
                                  {/* /.cons */}
                                </div>
                                {/* /.review-content */}

                                <div className="review-rating">
                                  <dl>
                                    <dt>Description</dt>
                                    <dd>
                                       <FontAwesomeIcon icon={["fas","star"]} />
                                       <FontAwesomeIcon icon={["fas","star"]} />
                                       <FontAwesomeIcon icon={["fas","star"]} />
                                       <FontAwesomeIcon icon={["fas","star"]} />
                                       <FontAwesomeIcon icon={["fas","star"]} />
                                    </dd>
                                    <dt>Délai de livraison</dt>
                                    <dd>
                                       <FontAwesomeIcon icon={["fas","star"]} />
                                       <FontAwesomeIcon icon={["fas","star"]} />
                                       <FontAwesomeIcon icon={["fas","star"]} />
                                       <FontAwesomeIcon icon={["fas","star"]} />
                                       <FontAwesomeIcon icon={["far","star"]} />
                                    </dd>
                                    <dt>Qualité produit</dt>
                                    <dd>
                                       <FontAwesomeIcon icon={["fas","star"]} />
                                       <FontAwesomeIcon icon={["fas","star"]} />
                                       <FontAwesomeIcon icon={["fas","star"]} />
                                       <FontAwesomeIcon icon={["fas","star"]} />
                                       <FontAwesomeIcon icon={["fas","star"]} />
                                    </dd>
                                    <dt>Service client</dt>
                                    <dd>
                                       <FontAwesomeIcon icon={["fas","star"]} />
                                       <FontAwesomeIcon icon={["fas","star"]} />
                                       <FontAwesomeIcon icon={["fas","star"]} />
                                       <FontAwesomeIcon icon={["fas","star"]} />
                                       <FontAwesomeIcon icon={["fas","star"]} />
                                    </dd>
                                  </dl>
                                </div>
                                {/* /.review-rating */}
                              </div>
                              {/* /.review-content-wrapper */}

                            </div>
                            {/* /.review-inner */}
                          </div>
                          {/* /.review */}

                        </div>
                        {/* /.reviews */}

                      </div>
                      {/* /.col-sm-7 */}

                      <div className="col-sm-5">

                        <div className=" bg-white p-2">
                          <div className="detail-overview-hearts">
                            <i className="fa fa-heart"></i>
                            <strong>213 </strong>
                            <span>
                              personnes l'ont aimé
                            </span>
                          </div>
                          <div className="detail-overview-rating">
                             <FontAwesomeIcon icon={["fas","star"]} /> <strong>4.3 / 5 </strong>sur <a href="#reviews">316
                            commentaires</a>
                          </div>

                          <div className="detail-actions row">
                            <div className="col-sm-4">
                              <div className="btn btn-primary btn-book">
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
                                  Plainte
                                </span>
                              </div>
                            </div>
                            {/* /.col-sm-4 */}
                          </div>
                          {/* /.detail-actions */}
                        </div>

                        <h2>Fournisseur :  <span className="text-secondary">{item.supplier.brandName}</span></h2>
                        <div className="bg-white p-2">
                          <div className="detail-vcard">
                            <div className="detail-logo">
                              <img src="https://picsum.photos/500/600" />
                            </div>
                            {/* /.detail-logo */}

                            <div className="detail-contact">
                              <div className="detail-contact-email">
                                <i className="fa fa-envelope-o"></i> <a href="mailto:#">company@example.com</a>
                              </div>
                              <div className="detail-contact-phone">
                                <i className="fa fa-mobile-phone"></i> <a href="tel:#">+01-23-456-789</a>
                              </div>
                              <div className="detail-contact-website">
                                <i className="fa fa-globe"></i> <a href="#">www.superlist.com</a>
                              </div>
                              <div className="detail-contact-address">
                                <i className="fa fa-map-o"></i>
                                347/26 22nd Avenue<br/>
                                NYC AZ 85705, USA
                              </div>
                            </div>
                            {/* /.detail-contact */}
                          </div>
                          {/* /.detail-vcard */}

                          <div className="detail-description">
                            <p>Vestibulum a lectus ullamcorper, dapibus ante id, sagittis libero. In tincidunt nisi
                              venenatis, ornare eros at, hendrerit sem. Nunc metus purus, porta a dignissim vel, vulputate
                              sed odio. Aenean est nisi, pulvinar eget velit quis, placerat hendrerit arcu. Vestibulum non
                              dictum nibh.</p>
                            <p>In congue mattis felis, non hendrerit orci dictum id. Etiam consequat nulla vitae tempus
                              interdum.Nam gravida convallis lacus, at dignissim urna pulvinar sed.</p>
                            <p>Cras ac mi odio. Aliquam erat volutpat. Cras euismod facilisis ligula in tristique. Proin
                              et eleifend lacus, vitae dictum orci</p>
                          </div>

                          <div className="detail-follow">
                            <h5>
                              <FormattedMessage id={"app.page.supplier_product.follow_us"}
                                                defaultMessage={"Suivez-nous"}
                                                description={"Supplier product page - follow us"}
                              />
                            </h5>
                            <div className="follow-wrapper">
                              <a className="follow-btn facebook" href="#"><FontAwesomeIcon icon={['fab',"facebook"]}/></a>
                              <a className="follow-btn youtube" href="#"><FontAwesomeIcon icon={['fab',"youtube"]}/></a>
                              <a className="follow-btn twitter" href="#"><FontAwesomeIcon icon={['fab',"twitter"]}/></a>
                              <a className="follow-btn tripadvisor" href="#"><FontAwesomeIcon icon={['fab',"tripadvisor"]}/></a>
                              <a className="follow-btn google-plus" href="#"><FontAwesomeIcon icon={['fab',"google-plus"]}/></a>
                            </div>
                            {/* /.follow-wrapper */}
                          </div>
                          {/* /.detail-follow */}
                        </div>

                        <h2>Catégories</h2>

                        <div className="bg-white p-2">
                          <ul className="detail-amenities">
                            <li className="yes">WiFi</li>
                            <li className="yes">Parking</li>
                            <li className="no">Vine</li>
                            <li className="yes">Terrace</li>
                            <li className="no">Bar</li>
                            <li className="yes">Take Away Coffee</li>
                            <li className="no">Catering</li>
                            <li className="yes">Raw Food</li>
                            <li className="no">Delivery</li>
                            <li className="yes">No-smoking room</li>
                            <li className="no">Reservations</li>
                          </ul>
                        </div>
                        {/* /.detail-amenities */}

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

                        <h2>3 Reasons Why Choose Us</h2>

                        <div className="bg-white p-2 reasons">
                          <div className="reason">
                            <div className="reason-icon">
                              <i className="fa fa-trophy"></i>
                            </div>
                            {/* /.reason-icon */}
                            <div className="reason-content">
                              <h4>Coffee House of the Year 2015</h4>
                              <p>Fusce at venenatis lorem. Quisque volutpat aliquam leo, a pellentesque orci varius sit
                                amet.</p>
                            </div>
                            {/* /.reason-content */}
                          </div>
                          {/* /.reason */}
                          <div className="reason">
                            <div className="reason-icon">
                              <i className="fa fa-coffee"></i>
                            </div>
                            {/* /.reason-icon */}
                            <div className="reason-content">
                              <h4>High Quality Coffee Beans</h4>
                              <p>Fusce at venenatis lorem. Quisque volutpat aliquam leo, a pellentesque orci varius sit
                                amet.</p>
                            </div>
                            {/* /.reason-content */}
                          </div>
                          {/* /.reason */}
                          <div className="reason">
                            <div className="reason-icon">
                              <i className="fa fa-cutlery"></i>
                            </div>
                            {/* /.reason-icon */}
                            <div className="reason-content">
                              <h4>Snacks & Deserts</h4>
                              <p>Fusce at venenatis lorem. Quisque volutpat aliquam leo, a pellentesque orci varius sit
                                amet.</p>
                            </div>
                            {/* /.reason-content */}
                          </div>
                          {/* /.reason */}
                        </div>

                        <div className="detail-payments">
                          <h3>Moyens de paiement acceptés</h3>

                          <ul>
                            <li><a href="#"><FontAwesomeIcon icon={['fab','paypal']}/></a></li>
                            <li><a href="#"><FontAwesomeIcon icon={['fab',"cc-amex"]} /></a></li>
                            <li><a href="#"><FontAwesomeIcon icon={['fab',"cc-mastercard"]} /></a></li>
                            <li><a href="#"><FontAwesomeIcon icon={['fab',"cc-stripe"]} /></a></li>
                            <li><a href="#"><FontAwesomeIcon icon={['fab',"cc-visa"]} /></a></li>
                          </ul>
                        </div>
                      </div>
                      {/* /.col-sm-5 */}

                      <div className="col-sm-12">
                        <h2>Commenter le produit</h2>

                        <form className="bg-white p-2 add-review" method="post" action="?">
                          <div className="row">
                            <div className="form-group col-sm-6">
                              <label htmlFor="">Nom <span className="required">*</span></label>
                              <input type="text" className="form-control" id="" required />
                            </div>
                            {/* /.col-sm-6 */}

                            <div className="form-group col-sm-6">
                              <label htmlFor="">Email <span className="required">*</span></label>
                              <input type="email" className="form-control" id="" required />
                            </div>
                            {/* /.col-sm-6 */}
                          </div>
                          {/* /.row */}

                          <div className="row">
                            <div className="form-group input-rating col-sm-3">

                              <div className="rating-title">Description</div>

                              <input type="radio" value="1" name="food" id="rating-food-1" />
                              <label htmlFor="rating-food-1"></label>
                              <input type="radio" value="2" name="food" id="rating-food-2" />
                              <label htmlFor="rating-food-2"></label>
                              <input type="radio" value="3" name="food" id="rating-food-3" />
                              <label htmlFor="rating-food-3"></label>
                              <input type="radio" value="4" name="food" id="rating-food-4" />
                              <label htmlFor="rating-food-4"></label>
                              <input type="radio" value="5" name="food" id="rating-food-5" />
                              <label htmlFor="rating-food-5"></label>

                            </div>
                            {/* /.col-sm-3 */}
                            <div className="form-group input-rating col-sm-3">

                              <div className="rating-title">Délai de livraison</div>

                              <input type="radio" value="1" name="staff" id="rating-staff-1" />
                              <label htmlFor="rating-staff-1"></label>
                              <input type="radio" value="2" name="staff" id="rating-staff-2" />
                              <label htmlFor="rating-staff-2"></label>
                              <input type="radio" value="3" name="staff" id="rating-staff-3" />
                              <label htmlFor="rating-staff-3"></label>
                              <input type="radio" value="4" name="staff" id="rating-staff-4" />
                              <label htmlFor="rating-staff-4"></label>
                              <input type="radio" value="5" name="staff" id="rating-staff-5" />
                              <label htmlFor="rating-staff-5"></label>

                            </div>
                            {/* /.col-sm-3 */}
                            <div className="form-group input-rating col-sm-3">

                              <div className="rating-title">Qualité produit</div>

                              <input type="radio" value="1" name="value" id="rating-value-1" />
                              <label htmlFor="rating-value-1"></label>
                              <input type="radio" value="2" name="value" id="rating-value-2" />
                              <label htmlFor="rating-value-2"></label>
                              <input type="radio" value="3" name="value" id="rating-value-3" />
                              <label htmlFor="rating-value-3"></label>
                              <input type="radio" value="4" name="value" id="rating-value-4" />
                              <label htmlFor="rating-value-4"></label>
                              <input type="radio" value="5" name="value" id="rating-value-5" />
                              <label htmlFor="rating-value-5"></label>

                            </div>
                            {/* /.col-sm-3 */}
                            <div className="form-group input-rating col-sm-3">

                              <div className="rating-title">Service client</div>

                              <input type="radio" value="1" name="atmosphere" id="rating-atmosphere-1" />
                              <label htmlFor="rating-atmosphere-1"></label>
                              <input type="radio" value="2" name="atmosphere" id="rating-atmosphere-2" />
                              <label htmlFor="rating-atmosphere-2"></label>
                              <input type="radio" value="3" name="atmosphere" id="rating-atmosphere-3" />
                              <label htmlFor="rating-atmosphere-3"></label>
                              <input type="radio" value="4" name="atmosphere" id="rating-atmosphere-4" />
                              <label htmlFor="rating-atmosphere-4"></label>
                              <input type="radio" value="5" name="atmosphere" id="rating-atmosphere-5" />
                              <label htmlFor="rating-atmosphere-5"></label>

                            </div>
                            {/* /.col-sm-3 */}
                          </div>
                          {/* /.row */}

                          <div className="row">
                            <div className="form-group col-sm-6">
                              <label htmlFor="">Commentaire positif</label>
                              <textarea className="form-control" rows="5" id=""></textarea>
                            </div>
                            {/* /.col-sm-6 */}
                            <div className="form-group col-sm-6">
                              <label htmlFor="">Commentaire négatif</label>
                              <textarea className="form-control" rows="5" id=""></textarea>
                            </div>
                            {/* /.col-sm-6 */}

                            <div className="col-sm-8">
                              <p>Champ requis marqué par <span className="required">*</span></p>
                            </div>
                            {/* /.col-sm-8 */}
                            <div className="col-sm-4">
                              <button className="btn btn-primary btn-block" type="submit">
                                <FontAwesomeIcon icon={["fas","star"]} />
                                <span className="ml-2">Soumission du commentaire</span>
                              </button>
                            </div>
                            {/* /.col-sm-4 */}
                          </div>
                          {/* /.row */}
                        </form>
                      </div>
                      {/* /.col-* */}
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
        */}


        {/* /.page-wrapper */}
        {/* Bouton de commande
        <Link to=".." className="btn btn-primary">
          Back to list
        </Link>
        {item && (
          <Link to={`/supplier_products/edit/${encodeURIComponent(item['@id'])}`}>
            <button className="btn btn-warning">Edit</button>
          </Link>
        )}
        <button onClick={this.del} className="btn btn-danger">
          Delete
        </button>
        */}
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

const mapStateToProps = state => ({
  retrieved: state.supplierproduct.show.retrieved,
  error: state.supplierproduct.show.error,
  loading: state.supplierproduct.show.loading,
  deleted: state.supplierproduct.show.deleted,
  eventSource: state.supplierproduct.show.eventSource,
});

const mapDispatchToProps = dispatch => ({
  retrieve: id => dispatch(retrieve(id)),
  reset: eventSource => dispatch(reset(eventSource))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Show);
