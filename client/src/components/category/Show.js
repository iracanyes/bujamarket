import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { retrieve, reset } from '../../actions/category/show';
import { del } from '../../actions/category/delete';
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
    reset: PropTypes.func.isRequired,
    deleteError: PropTypes.string,
    deleteLoading: PropTypes.bool.isRequired,
    deleted: PropTypes.object,
    del: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.retrieve(decodeURIComponent(this.props.match.params.id));
  }

  componentWillUnmount() {
    this.props.reset(this.props.eventSource);
  }

  del = () => {
    if (window.confirm('Are you sure you want to delete this item?'))
      this.props.del(this.props.retrieved);
  };

  render() {
    if (this.props.deleted) return <Redirect to=".." />;

    const item = this.props.retrieved;

    return (
      <div id={"category-show"}>
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
                <img className={"img-fluid"}  src="https://picsum.photos/1200/600" alt={item["name"]}/>
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
            <Link to={`/categories/`} className="btn btn-primary">
              <FormattedMessage  id={"app.button.return_to_List"}
                                 defaultMessage="Retour à la liste"
                                 description=" Button - Return to list"
              />

            </Link>
            {item && (
              <Link to={`/categories/update/${encodeURIComponent(item['id'])}`}
                    className="btn btn-warning"
              >
                <FormattedMessage  id={"app.button.edit"}
                                   defaultMessage="Éditer"
                                   description=" Button - Edit"
                />
              </Link>
            )}
            <button onClick={this.del} className="btn btn-danger">
              <FormattedMessage  id={"app.button.deklete"}
                                 defaultMessage="Supprimer"
                                 description=" Button - Delete"
              />
            </button>
          </div>

        </div>
        <div className="category-detail-products">
          { item && <CarouselCategoryProducts products={item["products"]}/>}
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
  eventSource: state.category.show.eventSource,
  deleteError: state.category.del.error,
  deleteLoading: state.category.del.loading,
  deleted: state.category.del.deleted
});

const mapDispatchToProps = dispatch => ({
  retrieve: id => dispatch(retrieve(id)),
  del: item => dispatch(del(item)),
  reset: eventSource => dispatch(reset(eventSource))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Show);
