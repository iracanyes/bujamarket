import React, {Component, Fragment} from 'react';
import { connect } from 'react-redux';
import { Link, Redirect, NavLink as RRDNavLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getProfile , reset } from '../../actions/user/profile';
import { getProfileImage } from "../../actions/image/profile";
import { toastError } from "../../layout/ToastMessage";
import { SpinnerLoading } from "../../layout/Spinner";
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  CardImg,
  Button,
  UncontrolledCollapse,
  NavLink,
  Nav,
  NavItem,
  TabContent,
  TabPane
} from 'reactstrap';
import classnames from "classnames";
import { CountryFlag } from "../../layout/CountryFlag.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormattedMessage, injectIntl } from "react-intl";
import ProfileAddressesWidget from "../address/ProfileAddressesWidget";
import ProfileBankAccountsWidget from "../bankaccount/ProfileBankAccountsWidget";
import ProfileForumsWidget from "../forum/ProfileForumsWidget";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(`${process.env.REACT_APP_STRIPE_PUBLIC_KEY}`);

class Profile extends Component {
  static propTypes = {
    retrieved: PropTypes.object,
    retrievedImage: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    eventSource: PropTypes.instanceOf(EventSource),
    getProfile: PropTypes.func.isRequired,
    getProfileImage: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired
  };



  constructor(props) {
    super(props);

    this.state = { activeTab: '1'};

    this.toggle = this.toggle.bind(this);
  }

  toggle = tab => {
    if( this.state.activeTab !== tab) this.setState({ activeTab: tab });
  }

  componentDidMount() {
    this.props.getProfile(this.props.history, this.props.location);
    if(this.props.retrievedImage === null)
      this.props.getProfileImage(this.props.history, this.props.location);
  }

  componentWillUnmount() {
    this.props.reset(this.props.eventSource);
    URL.revokeObjectURL(this.props.retrievedImage);
  }

  render() {

    const item = this.props.retrieved && this.props.retrieved['hydra:member'][0];
    const { error, loading, retrievedImage, loadingImage } = this.props;
    const { activeTab } = this.state;
    const image = this.props.retrievedImage && this.props.retrievedImage;

    /* Affichage des erreurs */
    error && toastError(error);

    return (
      <Fragment>
        <Col id={'profile-info'} className={'mt-5'}>
          {loading && <div className="my-5"><SpinnerLoading message={'Chargement du profil'} /></div>}
          { item !== null && (
            <div>
              <Row>
                <Col>
                  <Card className={"d-flex flex-row text-center profile-card-title"}>
                    <CardHeader className={"d-flex text-left"}>
                      <picture className={'d-flex mx-auto'}>
                        { loadingImage && <SpinnerLoading message={"Chargement de l'image de profil"} />}
                        { retrievedImage && <CardImg src={ retrievedImage } alt={item['firstname']} className={'img-thumbnail rounded-circle'} />}
                      </picture>

                    </CardHeader>
                    <CardBody>
                      <Row className={'d-flex justify-content-between'}>
                        <Col className={'d-flex flex-column justify-content-start py-2'}>
                          <h4>{item.firstname + " " + item.lastname }</h4>
                          <br/>
                          {item.socialReason && (<h5>De <strong>{item.socialReason}</strong></h5>)}
                        </Col>
                        <div>
                          <Link to={`/profile/edit}`}>
                            <button className="btn btn-warning py-2 pl-3">
                              <FontAwesomeIcon icon={'edit'} className={'btn-outline-primary mr-2'}/>
                              Edit
                            </button>
                          </Link>
                        </div>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
              <Row className="d-flex flex-row mt-3">
                <Col lg={4}>
                  <Card className={'info-member'}>
                    <CardBody>
                      <h4>Information membre</h4>
                      <p>
                        <strong className={'w-25'}>E-mail : </strong> { item['email']}
                      </p>
                      <p>
                        <strong className={'w-25'}>Prénom : </strong> { item['firstname']}
                      </p>
                      <p>
                        <strong className={'w-25'}>Nom : </strong> { item['lastname']}
                      </p>
                      <p>
                        <strong>Date inscription : </strong> { new Date(item['dateRegistration']).toLocaleString('fr-BE', { timezone: 'UTC'})}
                      </p>
                      <p>
                        <strong>Inscription validée : </strong> { item['signinConfirmed'] ? <FontAwesomeIcon icon={'check-circle'} className={'text-success'} /> : <FontAwesomeIcon icon={'exclamation-triangle'} className={'text-danger'} /> }
                      </p>

                    </CardBody>
                  </Card>
                </Col>
                <Col lg={8} >
                  <Card className={'info-address mb-3'}>
                    <CardBody>
                      <h4>Configuration linguistique et monétaire</h4>
                      <Row>
                        <Col className={'d-flex flex-row'}>
                          <div>
                            <strong className={'w-25'}>Langue : </strong>
                          </div>
                          <CountryFlag isoCountry={ item['language']} />
                        </Col>
                        <Col>
                          <strong className={'w-25'}>Préférence monétaire : </strong> { item['currency']}
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                  <Card className={"mb-3"}>
                    <CardBody>
                      <ProfileAddressesWidget user={ item } />
                    </CardBody>
                  </Card>
                  <Card className="mb-3">
                    <CardBody>
                      <ProfileBankAccountsWidget user={ item }/>
                    </CardBody>
                  </Card>


                </Col>
              </Row>
              {/* Supplier info card */}
              { item.brandName && (
                <Row>
                  <Col>
                    <Card className={"card-info-supplier"}>
                      <CardBody className={'d-flex flex-column'}>
                        <Col>
                          <div className="d-flex">
                            <h2><FormattedMessage id={"app.profile.supplier_info"} defaultMessage={"Informations fournisseurs"} description={"Profile - Supplier infos"} /></h2>
                          </div>
                        </Col>
                        <div className="d-flex flex-row">
                          <Col>
                            <div className={'d-flex'}>
                              <strong><FormattedMessage id={"app.supplier.item.brand_name"}/> : </strong>
                              <span>{ item.brandName }</span>
                            </div>
                            <div className={'d-flex'}>
                              <strong><FormattedMessage id={"app.supplier.item.social_reason"}/> : </strong>
                              <span>{ item.socialReason }</span>
                            </div>
                            <div className={'d-flex mt-2'}>
                              <strong><FormattedMessage id={"app.supplier.item.trade_registry_number"} /> : </strong>
                              <span>{ item.tradeRegistryNumber }</span>
                            </div>
                            <div className={'d-flex mt-2'}>
                              <strong><FormattedMessage id={"app.supplier.item.vat_number"} /> : </strong>
                              <span>{ item.vatNumber }</span>
                            </div>
                          </Col>
                          <Col>
                            <div className={'d-flex mr-1'}>
                              <strong><FormattedMessage id={"app.supplier.item.website.domain-name"} /> : </strong>
                              {
                                item.website !== null
                                ? (<NavLink tag={RRDNavLink} to={ item.website }>{ item.website }</NavLink>)
                                  : <span> Aucun site internet</span>
                              }

                            </div>
                            <div className={'d-flex mt-2 mr-1'}>
                              <strong><FormattedMessage id={"app.supplier.item.contact_email"} /> : </strong>
                              <span>{ item.contactEmail }</span>
                            </div>
                            <div className={'d-flex mt-2'}>
                              <strong><FormattedMessage id={"app.supplier.item.contact_phone_number"} /> : </strong>
                              <span>{ item.contactPhoneNumber }</span>
                            </div>
                            <div className={'d-flex mt-2'}>
                              <strong><FormattedMessage id={"app.supplier.item.contact_fullname"} /> : </strong>
                              <span>{ item.contactFullname }</span>
                            </div>
                          </Col>
                        </div>

                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              )}

            </div>
          )}

        </Col>
      </Fragment>
    );
  }


}

const mapStateToProps = state => ({
  retrieved: state.user.profile.retrieved,
  error: state.user.profile.error,
  loading: state.user.profile.loading,
  eventSource: state.user.profile.eventSource,
  retrievedImage: state.image.profile.retrieved,
  loadingImage: state.image.profile.loading,
  errorImage: state.image.profile.error
});

const mapDispatchToProps = dispatch => ({
  getProfile: (history, location) => dispatch(getProfile(history, location)),
  getProfileImage : (history, location) => dispatch(getProfileImage(history, location)),
  reset: eventSource => dispatch(reset(eventSource))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(withRouter(Profile)));
