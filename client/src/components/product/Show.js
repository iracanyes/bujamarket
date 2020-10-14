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
  CardHeader,
  CardBody,
  CardFooter,
  CardText,
} from "reactstrap";
import { FormattedMessage } from "react-intl";
import {SpinnerLoading} from "../../layout/Spinner";
import {toastError} from "../../layout/ToastMessage";

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
    const { retrieved, error, loading, deleted } = this.props;

    if (deleted) return <Redirect to=".." />;

    const item = retrieved ? retrieved : null;

    typeof error === "string" && toastError(error)
    return (
      <Fragment>
        <div id={"product-show"} className={'mt-5'}>

          {loading && (<SpinnerLoading message={"Chargement du produit"}/>)}

          <div className="show-detail">
            {item && (
              <Row>
                <Col lg={"6"}>
                  <img className={"img-fluid"}  src={item['url'] !== null ? item['url'] : 'https://dummyimage.com/600x400/000/ff2b00&text=indisponible'} alt={item["title"]}/>
                </Col>
                <Col lg={"6"}>

                  <Card>
                    <CardHeader>
                      <h3>
                        {item && item['title']}
                      </h3>
                      <p>
                        <span className="bold">Catégorie</span>
                        &nbsp;:&nbsp;
                        {item['category_name']}
                      </p>
                    </CardHeader>
                    <CardBody>
                      <h6 className={'bold'}>Résumé</h6>
                      <CardText>
                        {item['resume']}
                      </CardText>
                      <h6 className={'bold'}>Description détaillée</h6>
                      <CardText className={'card-text-description'}>
                        {item['description']}
                      </CardText>
                    </CardBody>
                    <CardFooter>
                      <span className="bold">
                        <FormattedMessage  id={"app.product.item.price_from"}
                                           defaultMessage="À partir de"
                                           description=" Product item - price from"
                        />
                      </span>
                      &nbsp;:&nbsp;
                      {parseFloat(item['minimumPrice']).toFixed(2)} €
                    </CardFooter>
                  </Card>
                </Col>
              </Row>

            )}
            <div className="col-lg-4 mx-auto my-5 category-control-buttons">
              <button onClick={() => this.props.history.goBack()} className="btn btn-outline-primary d-block mx-auto">
                <FormattedMessage  id={"app.button.return"}
                                   defaultMessage="Retour "
                                   description=" Button - Return "
                />
              </button>
            </div>
          </div>
          <div className="show-detail-list">
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
