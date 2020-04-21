import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { retrieve, reset } from '../../actions/category/show';
import CarouselCategoryProducts from "./CarouselCategoryProducts";
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
    reset: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.retrieve(decodeURIComponent(this.props.match.params.id));
  }

  componentWillUnmount() {
    this.props.reset(this.props.eventSource);
  }


  render() {

    const item = this.props.retrieved;

    return (
      <div id={"category-show"} className={'col-lg-8 mx-auto'}>
        <h1>
          <FormattedMessage  id={"app.page.category.title"}
                             defaultMessage="Catégorie"
                             description=" Page category - title"
          />
           &nbsp;:&nbsp;
          {item && item['name']}
        </h1>

        {this.props.loading && (

          <Spinner color="primary" role={"status"} style={{ width: '3rem', height: '3rem',position: 'absolute', left: '50%', top: '50%' }} type={"grow"} />

        )}
        {this.props.error && (
          <div className="alert alert-danger" role="alert">
            <span className="fa fa-exclamation-triangle" aria-hidden="true" />{' '}
            {this.props.error}
          </div>
        )}


        <div className="category-detail">
          {item && (
            <Row>
              <Col lg={"6"}>
                <img className={"img-fluid"}  src={item['image']['url']} alt={item["name"]}/>
              </Col>
              <Col lg={"6"}>
                <Card>
                  <CardBody>
                    <CardText>
                        {item['description']}
                    </CardText>
                  </CardBody>
                  <CardFooter>
                    Platform fee &nbsp;:&nbsp;
                    {item['platformFee']} %
                  </CardFooter>
                </Card>
              </Col>
            </Row>

          )}
          <div className="col-lg-4 mx-auto my-5 category-control-buttons">
            <button onClick={() => this.props.history.goBack()} className="btn btn-outline-primary d-block mx-auto">
              <FormattedMessage  id={"app.button.return"}
                                 defaultMessage="Retour "
                                 description="Button - Return "
              />

            </button>

          </div>

        </div>
        <div className="category-detail-products">
          { item && <CarouselCategoryProducts id={item["id"]}/>}
        </div>


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
      <Link to={`../../${type}/show/${encodeURIComponent(items["id"])}`}>
        {items["@id"]}
      </Link>
    );
  };
}

const mapStateToProps = state => ({
  retrieved: state.category.show.retrieved,
  error: state.category.show.error,
  loading: state.category.show.loading,
  eventSource: state.category.show.eventSource
});

const mapDispatchToProps = dispatch => ({
  retrieve: id => dispatch(retrieve(id)),
  reset: eventSource => dispatch(reset(eventSource))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Show);
