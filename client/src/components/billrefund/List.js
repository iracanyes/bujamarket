import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { list, reset } from '../../actions/billrefund/list';
import { FormattedMessage } from "react-intl";
import { CardTitle, Col, Row, Table } from "reactstrap";

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
        <h1>
          <FormattedMessage  id={"app.bill.refunds.list.page.title"}
                             defaultMessage="Factures - remboursement"
                             description="Bill refund list page - title"

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
          <Link to="create" className="btn btn-outline-primary">
            <FormattedMessage  id={"app.refunds.list.page.advanced.search.button"}
                               defaultMessage="Recherche avancée"
                               description="Bill refunds list page - advanced search button"

            />
          </Link>
        </p>

        <Table dark hover className={"table-list-image"}>
          <thead>
          <tr>
            <th>#</th>
            <th>
              <FormattedMessage  id={"app.bill.refunds.item.reference"}
                                 defaultMessage="Référence"
                                 description="Bill refunds item - reference"

              />
            </th>
            <th>
              <FormattedMessage  id={"app.bill.refunds.table.detailed.info"}
                                 defaultMessage="Informations détaillées"
                                 description="Bill refunds table - detailed informations"

              />
            </th>
          </tr>
          </thead>
          <tbody>
          {this.props.retrieved && this.props.retrieved["hydra:member"].map(item => (
            <tr>
              <th scope="row">{item["id"]}</th>
              <td className={"table-td-image-circle col-lg-2"}>
                <Link to={`../suppliers/show/${encodeURIComponent(item["id"])}`}>
                  <CardTitle className={"bold mx-auto"}>
                    {item["reference"]}
                  </CardTitle>
                </Link>
              </td>
              <td>
                <Row>
                  <Col>
                    <p className="bold">
                      <span>
                          <FormattedMessage  id={"app.bill.refunds.item.reason"}
                                             defaultMessage="Raison"
                                             description="Bill refunds item - reason"
                          />
                        &nbsp;:&nbsp;
                      </span>
                      {item["reason"]}
                    </p>
                    <p className="bold">
                      <span>
                          <FormattedMessage  id={"app.bill.refunds.item.status"}
                                             defaultMessage="Status"
                                             description="Bill refunds item - status"

                          />
                        &nbsp;:&nbsp;
                        </span>
                      {item["status"]}
                    </p>
                    <p className="bold">
                      <span>
                          <FormattedMessage  id={"app.bill.refunds.item.date.created"}
                                             defaultMessage="Date de création"
                                             description="Bill refunds item - date created"

                          />
                        &nbsp;:&nbsp;
                      </span>
                      {new Date(item["dateCreated"]).toLocaleString('fr-FR')}
                    </p>
                    <p className="bold">
                      <span>
                          <FormattedMessage  id={"app.bill.refunds.item.date.payment"}
                                             defaultMessage="Date du paiement"
                                             description="Bill refunds item - date payment"
                          />
                        &nbsp;:&nbsp;
                        </span>
                      {new Date(item["datePayment"]).toLocaleString('fr-FR')}
                    </p>
                    <p className="bold">
                      <span>
                          <FormattedMessage  id={"app.bill.refunds.item.currency.used"}
                                             defaultMessage="Devise utilisée"
                                             description="Bill refunds item - currency used"
                                             className="main-menu-top-level-text"
                          />
                        &nbsp;:&nbsp;
                        </span>
                      {item["currencyUsed"]}

                    </p>
                    <p className="bold">
                      <span>
                        <FormattedMessage  id={"app.bill.refunds.item.vat.rate.used"}
                                           defaultMessage="Taux de TVA"
                                           description="Bill refunds item - VAT rate used"
                        />
                        &nbsp;:&nbsp;
                        </span>
                      {item["vatRateUsed"]} %
                    </p>
                  </Col>
                  <Col>
                    <p className="bold">
                      <span>
                          <FormattedMessage  id={"app.bill.refunds.item.additional.cost"}
                                             defaultMessage="Coût additionnel"
                                             description="Bill refunds item - additional cost"
                          />
                        &nbsp;:&nbsp;
                      </span>
                      {item["additionalCost"]} &euro;
                    </p>
                    <p className="bold">
                      <span>
                          <FormattedMessage  id={"app.bill.refunds.item.additional.fee"}
                                             defaultMessage="Frais additionnel"
                                             description="Bill refunds item - additional fee"
                          />
                        &nbsp;:&nbsp;
                      </span>
                      {item["additionalFee"]} %
                    </p>

                    <p className="bold">
                      <span>
                          <FormattedMessage  id={"app.bill.refunds.item.total.excl.tax"}
                                             defaultMessage="Total HTVA"
                                             description="Bill refunds item - total exclude tax"
                          />
                        &nbsp;:&nbsp;
                      </span>
                      {item["totalExclTax"]} &euro;
                    </p>
                    <p className="bold">
                      <span>
                          <FormattedMessage  id={"app.bill.refunds.item.total.incl.tax"}
                                             defaultMessage="Total TVAC"
                                             description="Bill refunds item - total include tax"
                          />
                        &nbsp;:&nbsp;
                      </span>
                      {item["totalInclTax"]} &euro;
                    </p>
                    <p className="bold">
                      <span>
                          <FormattedMessage  id={"app.bill.refunds.item.additional.info"}
                                             defaultMessage="Informations additionnelles"
                                             description="Bill refunds item - additional information"
                          />
                          &nbsp;:
                      </span>
                      <br/>
                      {item["additionalInformation"]}
                    </p>
                    <p className="bold">
                      <span>
                          <FormattedMessage  id={"app.bill.refunds.item.description"}
                                             defaultMessage="Description"
                                             description="Bill refunds item - description"
                          />
                          &nbsp;:
                      </span>
                      <br/>
                      {item["description"]}
                    </p>

                  </Col>
                </Row>
              </td>
            </tr>)
          )}

          </tbody>
        </Table>

        {/*
        <table className="table table-responsive table-striped table-hover">
          <thead>
            <tr>
              <th>id</th>
              <th>status</th>
              <th>dateCreated</th>
              <th>datePayment</th>
              <th>currencyUsed</th>
              <th>vatRateUsed</th>
              <th>totalExclTax</th>
              <th>totalInclTax</th>
              <th>url</th>
              <th>payment</th>
              <th>totalShippingCost</th>
              <th>additionalCost</th>
              <th>additionalFee</th>
              <th>additionalInformation</th>
              <th>customer</th>
              <th>orderGlobal</th>
              <th colSpan={2} />
            </tr>
          </thead>
          <tbody>
            {this.props.retrieved &&
              this.props.retrieved['hydra:member'].map(item => (
                <tr key={item['@id']}>
                  <th scope="row">
                    <Link to={`show/${encodeURIComponent(item['@id'])}`}>
                      {item['@id']}
                    </Link>
                  </th>
                  <td>{item['status']}</td>
                  <td>{item['dateCreated']}</td>
                  <td>{item['datePayment']}</td>
                  <td>{item['currencyUsed']}</td>
                  <td>{item['vatRateUsed']}</td>
                  <td>{item['totalExclTax']}</td>
                  <td>{item['totalInclTax']}</td>
                  <td>{item['url']}</td>
                  <td>{this.renderLinks('payments', item['payment'])}</td>
                  <td>{item['totalShippingCost']}</td>
                  <td>{item['additionalCost']}</td>
                  <td>{item['additionalFee']}</td>
                  <td>{item['additionalInformation']}</td>
                  <td>{this.renderLinks('customers', item['customer'])}</td>
                  <td>{this.renderLinks('order_globals', item['orderGlobal'])}</td>
                  <td>
                    <Link to={`show/${encodeURIComponent(item['@id'])}`}>
                      <span className="fa fa-search" aria-hidden="true" />
                      <span className="sr-only">Show</span>
                    </Link>
                  </td>
                  <td>
                    <Link to={`edit/${encodeURIComponent(item['@id'])}`}>
                      <span className="fa fa-pencil" aria-hidden="true" />
                      <span className="sr-only">Edit</span>
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        */}

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
  } = state.billrefund.list;
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
