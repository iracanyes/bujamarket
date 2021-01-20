import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { retrieve, reset } from '../../actions/category/show';
import CarouselCategoryProducts from "./CarouselCategoryProducts";
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
import {SpinnerLoading} from "../../layout/component/Spinner";
import {toastError} from "../../layout/component/ToastMessage";

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
    const user = localStorage.getItem('token') !== null ? JSON.parse(atob(localStorage.getItem('token').split('.')[1])) : null;


    typeof this.props.error === "string" && toastError(this.props.error);

    return (
      <div id={"category-show"} className={'mt-5'}>
        {this.props.loading && (
          <SpinnerLoading message={'Chargement de la catégorie'} />
        )}

        {item && (
          <div className="show-detail">
            <Row>
              <Col lg={"6"}>
                <img className={"img-fluid"}  src={item['image']['url']} alt={item["name"]}/>
              </Col>
              <Col lg={"6"}>

                <Card>
                  <CardHeader>
                    <h3>
                      {item && item['name'] }
                    </h3>
                  </CardHeader>
                  <CardBody>
                    <CardText>
                        {item['description']}
                    </CardText>
                  </CardBody>
                  { (user !== null && user.roles.includes('ROLE_SUPPLIER')) && (
                    <CardFooter>
                      Platform fee &nbsp;:&nbsp;
                      {item['platformFee']} %
                    </CardFooter>
                  )}

                </Card>
              </Col>
            </Row>
            <div className="col-lg-4 mx-auto my-5 category-control-buttons">
              <button onClick={() => this.props.history.goBack()} className="btn btn-outline-primary d-block mx-auto">
                <FormattedMessage  id={"app.button.return"}
                                   defaultMessage="Retour "
                                   description="Button - Return "
                />

              </button>

            </div>
          </div>
        )}
        <div className="show-detail-list">
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
