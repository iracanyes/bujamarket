import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { list, reset } from '../../actions/supplier/list';
import {
  Table,
  Row,
  Col,
  CardImg,
  CardTitle,

} from "reactstrap";
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

  render() {
    return (
      <div>
        <h1>Nos fournisseurs</h1>

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
          <Link to="create" className="btn btn-primary">
            Recherche avancée
          </Link>
        </p>

        <Table dark hover className={"table-list-image"}>
          <thead>
          <tr>
            <th>#</th>
            <th>Nom commerciale</th>
            <th>Informations détaillées</th>
          </tr>
          </thead>
          <tbody>
          {this.props.retrieved && this.props.retrieved["hydra:member"].map(item => (
            <tr>
              <th scope="row">{item["id"]}</th>
              <td className={"table-td-image-circle col-lg-2"}>
                <Link to={`../suppliers/show/${encodeURIComponent(item["id"])}`}>
                  <CardTitle className={"bold mx-auto"}>
                    {item["brandName"]}
                  </CardTitle>

                  <CardImg
                    circle
                    src="https://picsum.photos/2000/3000"
                    alt={item.image.alt}
                    className={"d-block mx-auto"}
                  />
                </Link>


              </td>
              <td>
                <Row>
                  <Col>
                    <p className="bold">
                      <span>
                          <FormattedMessage  id={"app.products.list.item.socialReason"}
                                             defaultMessage="Raison sociale"
                                             description="Product item - social reason"

                          /> : {item["socialReason"]}
                        </span>

                    </p>
                    <p className="bold">
                      <span>
                          <FormattedMessage  id={"app.products.list.item.website"}
                                             defaultMessage="Site web"
                                             description="Product item - site web"

                          /> : <a href={"www." + item["website"]}>www.{item["website"]}</a>
                        </span>

                    </p>
                    <p className="bold">
                      <span>
                          <FormattedMessage  id={"app.products.item.contact.fullname"}
                                             defaultMessage="Nom complet"
                                             description="Product item - Nom complet de la personne de contact"
                                             className="main-menu-top-level-text"
                          /> : {item["contactFullname"]}
                        </span>

                    </p>
                    <p className="bold">
                      <span>
                          <FormattedMessage  id={"app.products.item.contact.phone.number"}
                                             defaultMessage="Numéro de téléphone"
                                             description="Product item - numéro de téléphone"
                                             className="main-menu-top-level-text"
                          /> : {item["contactPhoneNumber"]}
                        </span>

                    </p>
                    <p className="bold">
                      <span>
                          <FormattedMessage  id={"app.products.item.contact.email"}
                                             defaultMessage="E-mail"
                                             description="Product list - numéro de registre de commerce"
                                             className="main-menu-top-level-text"
                          /> : {item["contactEmail"]}
                        </span>

                    </p>
                  </Col>
                  <Col>
                    <p className="bold">
                      <span>
                          <FormattedMessage  id={"app.products.list.trade.register.number"}
                                             defaultMessage="Numéro de registre de commerce"
                                             description="Product list - numéro de registre de commerce"
                                             className="main-menu-top-level-text"
                          /> : {item["tradeRegisterNumber"]}
                        </span>

                    </p>
                    <p className="bold">
                      <span>
                          <FormattedMessage  id={"app.products.list.value.added.tax"}
                                             defaultMessage="Numéro de TVA"
                                             description="Product list - numéro de TVA"
                                             className="main-menu-top-level-text"
                          /> : {item["vatNumber"]}
                        </span>

                    </p>

                  </Col>
                </Row>
              </td>
            </tr>)
          )}

          </tbody>
        </Table>


        {this.pagination()}
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
      <Link to={`../${type}/show/${encodeURIComponent(items["id"])}`}>{items["id"]}</Link>
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
  } = state.supplier.list;
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
