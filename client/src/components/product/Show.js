import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { retrieve, reset } from '../../actions/product/show';
import CarouselProductSuppliers from "../supplierproduct/CarouselProductSuppliers";
import {
  Col,
  Row,
  Card,
  CardBody,
  CardFooter,
  CardText,
  Spinner
} from "reactstrap";
import { FormattedMessage } from "react-intl";

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
    this.props.retrieve(decodeURIComponent(this.props.match.params.id));
  }

  componentWillUnmount() {
    this.props.reset(this.props.eventSource);
  }

  render() {
    if (this.props.deleted) return <Redirect to=".." />;

    const item = this.props.retrieved;

    console.log("Product retrieved", item);

    return (
      <Fragment>
        <div id={"category-show"}>
          <h1>
            <FormattedMessage  id={"app.page.product.title"}
                               defaultMessage="Produit"
                               description=" Page product - title"
            />
            &nbsp;:&nbsp;
            {item && item['title']}
          </h1>

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

          <div className="category-detail">
            {item && (
              <Row>
                <Col lg={"6"}>
                  <img className={"img-fluid"}  src={item['images'][0]['url']} alt={item["title"]}/>
                </Col>
                <Col lg={"6"}>
                  <Card>
                    <CardBody>
                      <CardText>
                        {item['description']}
                      </CardText>
                    </CardBody>
                    <CardFooter>
                      <FormattedMessage  id={"app.product.item.price_from"}
                                         defaultMessage="À partir de"
                                         description=" Product item - price from"
                      />
                      &nbsp;:&nbsp;
                      {parseFloat(item['minimumPrice']).toFixed(2)} €
                    </CardFooter>
                  </Card>
                </Col>
              </Row>

            )}
            <div className="col-lg-4 mx-auto my-5 category-control-buttons">
              {/*
              <Link to={`..`} className="btn btn-outline-primary d-block mx-auto">
                <FormattedMessage  id={"app.button.return_to_List"}
                                   defaultMessage="Retour à la liste"
                                   description=" Button - Return to list"
                />

              </Link>
              */}
              <button onClick={() => this.props.history.goBack()} className="btn btn-outline-primary d-block mx-auto">
                <FormattedMessage  id={"app.button.return"}
                                   defaultMessage="Retour "
                                   description=" Button - Return "
                />

              </button>

            </div>

          </div>
          <div className="category-detail-products">
              { item  && <CarouselProductSuppliers productId={item["id"]}/>}
          </div>


        </div>

      </Fragment>

    );
  }

  renderLinks = (type, items) => {
    if (Array.isArray(items)) {
      return items.map((item, i) => (
        <div key={i}>{this.renderLinks(type, item)}</div>
      ));
    }

    return (
      <Link to={`../../${type}/show/${encodeURIComponent(items['id'])}`}>
        {items['@id'] ? items['@id'] : "Voir le détail"}
      </Link>
    );
  };
}

const mapStateToProps = state => ({
  retrieved: state.product.show.retrieved,
  error: state.product.show.error,
  loading: state.product.show.loading,
  eventSource: state.product.show.eventSource,
});

const mapDispatchToProps = dispatch => ({
  retrieve: id => dispatch(retrieve(id)),
  reset: eventSource => dispatch(reset(eventSource))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Show);
