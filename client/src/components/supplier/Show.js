import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { retrieve, reset } from '../../actions/supplier/show';
import {
  Col,
  Row,
  Button,
  Card,
  CardTitle,
  CardText,
  CardFooter,
  Spinner
} from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import CarouselProductSuppliersBySupplier from "../supplierproduct/CarouselProductSuppliersBySupplier";

class Show extends Component {
  static propTypes = {
    retrieved: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    eventSource: PropTypes.instanceOf(EventSource),
    retrieve: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
  };

  componentDidMount() {
    if(JSON.parse(localStorage.getItem('token')) === null)
    {
      this.props.history.push({pathname: '../../login', state: { from : window.location.pathname }});
    }else{
      this.props.retrieve(decodeURIComponent(this.props.match.params.id), this.props.history);
    }

  }

  componentWillUnmount() {
    this.props.reset(this.props.eventSource);
  }

  render() {

    const item = this.props.retrieved;

    return (
      <div className={'supplier-details'}>

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

          <div class={'col-lg-9 mx-auto'}>
            <Row>
              <Col lg={2}>
                <img src={item['image']['url']}
                     className={'img-thumbnail rounded-circle'}
                     style={{width: '7.5rem', height:'7.5rem'}}
                     alt={item['image']['alt']}
                     title={item['image']['title']}
                />
              </Col>
              <Col>
                <h2>{item['brandName']}</h2>
                <strong>{item['socialReason']}</strong>
              </Col>
            </Row>
            <Row className={'mt-3'}>
              <Col>
                <Card body outline color={'info'} style={{height:'100%'}}>
                  <CardTitle color={'info'}><h6 className={'text-center'}>Business information</h6></CardTitle>
                  <CardText>
                    <p>
                      Responsable : <br/> <strong>{ item['firstname'] + ' ' + item['lastname']}</strong>
                    </p>
                    <p>
                      Numéro registre de commerce  : <br/> <strong>{ item['tradeRegistryNumber']}</strong>
                    </p>
                    <p>
                      Numéro TVA : <br/> <strong>{ item['vatNumber']}</strong>
                    </p>
                    <p>
                      Date d'inscription : <br/> <strong>{new Date(item['dateRegistration']).toLocaleDateString('fr-FR')}</strong>
                    </p>
                  </CardText>
                </Card>
              </Col>
              <Col>
                <Card body outline color={'warning'} style={{height:'100%'}}>
                  <CardTitle><h6 className={'text-center'}>Contact Information</h6></CardTitle>
                  <CardText>
                    <p>
                      Responsable  : <br/> <strong>{ item['contactFullname']}</strong>
                    </p>
                    <p>
                      Numéro de téléphone: <br/> <strong>{ item['contactPhoneNumber']}</strong>
                    </p>
                    <p>
                      E-mail: <br/> <strong>{item['contactEmail']}</strong>
                    </p>
                    <p>
                      Site web : <a href={item['website']} target={'_blank'}>{item['website']}</a>
                    </p>
                  </CardText>
                </Card>
              </Col>
              <Col>
                <Card body outline color={'secondary'} style={{height:'100%'}}>
                  <CardTitle><h6 className={'text-center'}>Adresses</h6></CardTitle>
                  <CardText>
                    {item.addresses.map((item, index) => (
                      <div>
                        <p>
                          <strong>{item.locationName}</strong>
                        </p>
                        <ul style={{listStyle: 'none'}}>
                          <li key={1}>
                            {item.street + ', ' + item.number}
                          </li>
                          <li key={2}>
                            { item.state + ' ' + item.zipCode }
                          </li>
                          <li key={3}>
                            { item.state + ' ' + item.country }
                          </li>
                        </ul>
                      </div>
                    ))}
                  </CardText>
                </Card>
              </Col>

            </Row>
            <Row className={'mt-3 bg-light'}>
              <CarouselProductSuppliersBySupplier supplierId={item.id}/>

            </Row>
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
    console.log("item - "+ type, items);
    return (
      <Link to={`../../${type}/show/${encodeURIComponent(items['id'])}`}>
        {items['title'] && items['title']}
        {items['name'] && items['name']}
      </Link>
    );
  };
}

const mapStateToProps = state => ({
  retrieved: state.supplier.show.retrieved,
  error: state.supplier.show.error,
  loading: state.supplier.show.loading,
  eventSource: state.supplier.show.eventSource,
  deleteError: state.supplier.del.error,
  deleteLoading: state.supplier.del.loading,
  deleted: state.supplier.del.deleted
});

const mapDispatchToProps = dispatch => ({
  retrieve: (id, history) => dispatch(retrieve(id, history)),
  reset: eventSource => dispatch(reset(eventSource))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Show);
