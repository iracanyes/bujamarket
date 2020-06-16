import React, {Component, Fragment} from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getProfile , reset } from '../../actions/user/profile';
import { getProfileImage } from "../../actions/image/profile";
import {toastError} from "../../layout/ToastMessage";
import { SpinnerLoading } from "../../layout/Spinner";
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  CardImg,
  Button,
  UncontrolledCollapse
} from 'reactstrap';
import {CountryFlag} from "../../layout/CountryFlag.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormattedMessage, injectIntl} from "react-intl";
import ProfileAddressesWidget from "../address/ProfileAddressesWidget";
import ProfileBankAccountsWidget from "../bankaccount/ProfileBankAccountsWidget";

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

  componentDidMount() {
    this.props.getProfile(this.props.history, this.props.location);
    if(this.props.retrievedImage === null)
      this.props.getProfileImage();
  }

  componentWillUnmount() {
    this.props.reset(this.props.eventSource);
    URL.revokeObjectURL(this.props.retrievedImage);
  }

  render() {

    const item = this.props.retrieved && this.props.retrieved['hydra:member'][0];
    const { error, loading, retrievedImage, loadingImage } = this.props;

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
                  <Card className={"d-flex flex-row text-center"}>
                    <CardHeader className={"d-flex text-left"}>
                      <picture className={'d-flex mx-auto'}>
                        { loadingImage && <SpinnerLoading message={"Chargement de l'image de profil"} />}
                        { retrievedImage && <CardImg src={ retrievedImage } alt={item['firstname']} className={'img-thumbnail rounded-circle'} />}
                      </picture>

                    </CardHeader>
                    <CardBody>
                      <Row className={'d-flex justify-content-between'}>
                        <Col className={'d-flex justify-content-start py-2'}>
                          <h4>{item.firstname + " " + item.lastname }</h4>
                          <h5>{"De " + item.brandName && item.brandName }</h5>
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
              <Row className={"my-4"}>
                <div className={'mx-auto'}>
                  <Button color={'primary'} id={'toggler1'} className={'mr-3'}>Information de profil</Button>
                  <Button color={'primary'} id={'toggler2'} className={'mr-3'} >Relation admin/client</Button>
                  <Button color={'primary'} id={'toggler3'} className={'mr-3'} >Évaluation</Button>
                </div>
              </Row>
              <Row>
                <UncontrolledCollapse defaultOpen={true} toggler={'#toggler1'} className={'w-100'}>
                  <Row className="d-flex flex-row">
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


                </UncontrolledCollapse>
                <UncontrolledCollapse defaultOpen={true} toggler={'#toggler2'} className={'w-100'}>
                  <Card>
                    <CardHeader className={"d-flex flex-row text-center"}>
                      <picture className={'d-flex'}>
                        { loadingImage && <SpinnerLoading message={"Chargement de l'image de profil"} />}
                        { retrievedImage && <CardImg src={ retrievedImage } alt={item['firstname']} className={'img-thumbnail rounded-circle'} />}
                      </picture>
                      <Col className={'d-flex w-75'}>
                        <h2>{ item.brandName }</h2>
                        <h4>
                          {item['firstname'] + ' ' + item['lastname'] }
                        </h4>
                      </Col>
                    </CardHeader>
                    <CardBody className={'d-flex flex-row'}>
                      <Col>
                        <p>
                          <strong>E-mail : </strong> { item['email']}
                        </p>
                        <p>
                          <strong>Prénom : </strong> { item['firstname']}
                        </p>
                        <p>
                          <strong>Nom : </strong> { item['lastname']}
                        </p>
                      </Col>
                      <Col>
                        <div className={'d-flex flex-row mr-1'}>
                          <strong className={'w-25'}>Langue : </strong> <CountryFlag isoCountry={ item['language']} />
                        </div>
                        <div className={'d-flex flex-row mr-1'}>
                          <strong className={'w-25'}>Préférence monétaire : </strong> { item['currency']}
                        </div>

                      </Col>
                      <Col>
                        <p>
                          <strong>Date inscription : </strong> { new Date(item['dateRegistration']).toLocaleString('fr-BE', { timezone: 'UTC'})}
                        </p>
                        <p>
                          <strong>Date inscription : </strong> { item['signinConfirmed'] ? <FontAwesomeIcon icon={'check-circle'} className={'text-success'} /> : <FontAwesomeIcon icon={'exclamation-triangle'} className={'text-danger'} /> }
                        </p>
                      </Col>
                    </CardBody>
                  </Card>
                </UncontrolledCollapse>
                <UncontrolledCollapse defaultOpen={true} toggler={'#toggler3'} className={'w-100'}>
                  <Card>
                    <CardHeader className={"d-flex flex-row text-center"}>
                      <picture className={'d-flex'}>
                        { loadingImage && <SpinnerLoading message={"Chargement de l'image de profil"} />}
                        { retrievedImage && <CardImg src={ retrievedImage } alt={item['firstname']} className={'img-thumbnail rounded-circle'} />}
                      </picture>
                      <Col className={'d-flex w-75'}>
                        <h2>{ item.brandName }</h2>
                        <h4>
                          {item['firstname'] + ' ' + item['lastname'] }
                        </h4>
                      </Col>
                    </CardHeader>
                    <CardBody className={'d-flex flex-row'}>
                      <Col>
                        <p>
                          <strong>E-mail : </strong> { item['email']}
                        </p>
                        <p>
                          <strong>Prénom : </strong> { item['firstname']}
                        </p>
                        <p>
                          <strong>Nom : </strong> { item['lastname']}
                        </p>
                      </Col>
                      <Col>
                        <div className={'d-flex flex-row mr-1'}>
                          <strong className={'w-25'}>Langue : </strong> <CountryFlag isoCountry={ item['language']} />
                        </div>
                        <div className={'d-flex flex-row mr-1'}>
                          <strong className={'w-25'}>Préférence monétaire : </strong> { item['currency']}
                        </div>

                      </Col>
                      <Col>
                        <p>
                          <strong>Date inscription : </strong> { new Date(item['dateRegistration']).toLocaleString('fr-BE', { timezone: 'UTC'})}
                        </p>
                        <p>
                          <strong>Date inscription : </strong> { item['signinConfirmed'] ? <FontAwesomeIcon icon={'check-circle'} className={'text-success'} /> : <FontAwesomeIcon icon={'exclamation-triangle'} className={'text-danger'} /> }
                        </p>
                      </Col>
                    </CardBody>
                  </Card>
                </UncontrolledCollapse>
              </Row>
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
  getProfileImage : () => dispatch(getProfileImage()),
  reset: eventSource => dispatch(reset(eventSource))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(Profile));
