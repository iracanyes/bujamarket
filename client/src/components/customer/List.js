import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { list, reset } from '../../actions/customer/list';
import { Card, CardText, CardTitle, Col, Row } from "reactstrap";
import { FormattedMessage } from "react-intl";

class List extends Component {
  static propTypes = {
    retrieved: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    eventSource: PropTypes.instanceOf(EventSource),
    deletedItem: PropTypes.object,
    list: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.list(
      this.props.match.params.page &&
        decodeURIComponent(this.props.match.params.page)
    );
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.page !== nextProps.match.params.page)
      nextProps.list(
        nextProps.match.params.page &&
          decodeURIComponent(nextProps.match.params.page)
      );
  }

  componentWillUnmount() {
    this.props.reset(this.props.eventSource);
  }

  showCustomers()
  {
    let items = [];

    const customers = this.props.retrieved && this.props.retrieved["hydra:member"];


    console.log("Résultats clients", customers);

    let rows = [];

    for(let i = 0; i < Math.ceil(customers.length / 12 ); i++)
    {

      let resultsPer4 = [];

      for(let j = 0; j < 12; j++)
      {
        console.log("Résultats produits " + j, customers[i * 12 + j]);

        if(customers[i * 12 + j])
        {

          resultsPer4.push(
            <Col key={"customers" + (i * 10 + j)} xs={"12"} sm="6" md="4" lg="3">
              <Card body className={" text-white bg-dark"}>
                <div className="card-img-custom">
                  <img src="https://picsum.photos/2000/3000" alt={customers[i * 10 + j]["image"]["alt"]} className="image img-fluid" style={{ width:"100%"}} />
                  <div className="middle">
                    <div className="btn btn-outline-info text">
                      <FormattedMessage  id={"app.page.customer.list.button.customize"}
                                         defaultMessage="Personnaliser"
                                         description="Customers list - button customize"
                      />
                    </div>
                  </div>
                </div>
                {/*
                <CardImg top className={"img-thumbnail"} width="100%" src="https://picsum.photos/2000/3000" alt={customers[i * 10 + j].images[0].alt} />
                */}
                <CardTitle>{customers[i * 10 + j]["username"]}</CardTitle>
                <CardText>
                  <p>
                    <span className="font-weight-bold">
                      <FormattedMessage  id={"app.page.customer.item.fullname"}
                                         defaultMessage="Nom complet"
                                         description="Customers item - Fullname"
                      />
                      &nbsp;:&nbsp;
                    </span>
                    {customers[i * 10 + j]["firstname"]} &nbsp; {customers[i * 10 + j]["lastname"]}
                  </p>
                  <p>
                    <span className="font-weight-bold">
                      <FormattedMessage  id={"app.page.customer.item.average.rating.made"}
                                         defaultMessage="Moyenne des votes"
                                         description="Customers item - Average rating made"
                      />
                      &nbsp;:&nbsp;
                    </span>
                    {customers[i * 10 + j]["averageRating"]}
                  </p>
                  <p>
                    <spa className="font-weight-bold">
                      <FormattedMessage  id={"app.page.customer.item.language"}
                                         defaultMessage="Langue préférée"
                                         description="Customers item - Language"
                      />
                      &nbsp;:&nbsp;
                    </spa>

                    {customers[i * 10 + j]["language"]}
                  </p>
                  <p>
                    <span className="font-weight-bold">
                      <FormattedMessage  id={"app.page.customer.item.currency"}
                                         defaultMessage="Devise utilisé"
                                         description="Customers item - Currency used"
                      />
                      &nbsp;:&nbsp;
                       :&nbsp;
                    </span>
                    {customers[i * 10 + j]["currency"]}
                  </p>
                </CardText>
                <Link
                  to={`show/${encodeURIComponent(customers[i * 10 + j]['@id'])}`}
                  className={"btn btn-outline-primary"}
                >
                  <FormattedMessage  id={"app.page.customer.list.button.see.detail"}
                                     defaultMessage="Voir le détail"
                                     description="Customers item - button 'see detail'"
                  />

                </Link>
              </Card>
            </Col>
          );
        }

      }

      rows.push(
        <Row
          key={"rows" + (i * 10)}
        >
          {resultsPer4}
        </Row>
      );
    }

    let index = 0;
    items.push(
      <div id="list-customers" key={index++}>
        {rows}
      </div>
    );

    return items;


  }

  render() {
    const items = this.props.retrieved && this.showCustomers();

    return (
      <div>
        <h1>
          <FormattedMessage  id={"app.customers.list.page.title"}
                             defaultMessage="Nos clients"
                             description="Customer list page - title"

          />
        </h1>

        {this.props.loading && (
          <div className="alert alert-info">Loading...</div>
        )}
        {this.props.deletedItem && (
          <div className="alert alert-success">
            {this.props.deletedItem['@id']} deleted.
          </div>
        )}
        {this.props.error && (
          <div className="alert alert-danger">{this.props.error}</div>
        )}

        <p>
          <Link
            to="create"
            className="btn btn-outline-primary"
          >
            <FormattedMessage  id={"app.customers.list.page.advanced.search.button"}
                               defaultMessage="Recherche avancée"
                               description="Customer list page - advanced search button"

            />

          </Link>
        </p>
        <div className="liste-card-by-4 list-img-middle-rounded">
          {items}
          {this.pagination()}
        </div>




      </div>
    );
  }

  pagination() {
    const view = this.props.retrieved && this.props.retrieved['hydra:view'];
    if (!view) return;

    const {
      'hydra:first': first,
      'hydra:previous': previous,
      'hydra:next': next,
      'hydra:last': last
    } = view;

    return (
      <nav aria-label="Page navigation">
        <Link
          to="."
          className={`btn btn-primary${previous ? '' : ' disabled'}`}
        >
          <span aria-hidden="true">&lArr;</span> First
        </Link>
        <Link
          to={
            !previous || previous === first ? '.' : encodeURIComponent(previous)
          }
          className={`btn btn-primary${previous ? '' : ' disabled'}`}
        >
          <span aria-hidden="true">&larr;</span> Previous
        </Link>
        <Link
          to={next ? encodeURIComponent(next) : '#'}
          className={`btn btn-primary${next ? '' : ' disabled'}`}
        >
          Next <span aria-hidden="true">&rarr;</span>
        </Link>
        <Link
          to={last ? encodeURIComponent(last) : '#'}
          className={`btn btn-primary${next ? '' : ' disabled'}`}
        >
          Last <span aria-hidden="true">&rArr;</span>
        </Link>
      </nav>
    );
  }

  renderLinks = (type, items) => {
    if (Array.isArray(items)) {
      return items.map((item, i) => (
        <div key={i}>{this.renderLinks(type, item)}</div>
      ));
    }

    return (
      <Link to={`../${type}/show/${encodeURIComponent(items)}`}>{items}</Link>
    );
  };
}

const mapStateToProps = state => {
  const {
    retrieved,
    loading,
    error,
    eventSource,
    deletedItem
  } = state.customer.list;
  return { retrieved, loading, error, eventSource, deletedItem };
};

const mapDispatchToProps = dispatch => ({
  list: page => dispatch(list(page)),
  reset: eventSource => dispatch(reset(eventSource))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(List);
