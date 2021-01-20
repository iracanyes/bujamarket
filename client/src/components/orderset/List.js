import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import PropTypes from 'prop-types';
import { list, reset } from '../../actions/orderset/list';
import {FormattedMessage } from "react-intl";
import { Container } from "reactstrap";
import {
  Paper
} from "@material-ui/core";
import {toastError} from "../../layout/component/ToastMessage";
import TableSort from "./TableSort";
import {SpinnerLoading} from "../../layout/component/Spinner";

class List extends Component {
  static propTypes = {
    retrieved: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    eventSource: PropTypes.instanceOf(EventSource),
    list: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.validateOrder = this.validateOrder.bind(this);
  }

  componentDidMount() {
    this.props.list(
      this.props.match.params.page &&
        decodeURIComponent(this.props.match.params.page),
      this.props.history,
      this.props.location
    );
  }

  componentDidUpdate(nextProps) {
    if (this.props.match.params.page !== nextProps.match.params.page)
      nextProps.list(
        nextProps.match.params.page &&
          decodeURIComponent(nextProps.match.params.page),
        nextProps.history,
        nextProps.location
      );
  }

  componentWillUnmount() {
    this.props.reset(this.props.eventSource);
  }

  validateOrder(order)
  {
    /* Redirection vers la page de paiement  */
    sessionStorage.removeItem('my_order');
    sessionStorage.setItem('my_order', JSON.stringify(order));
    this.props.history.push({pathname:'../validate_order', state: {from: this.props.location.pathname ,  params : {orderSet: order}}});
  }


  render() {
    const { loading, retrieved, error } = this.props;

    typeof error === "string" && error.length > 0 && toastError(error);


    return (
      <div>
        <Container>
          <h1>
            <FormattedMessage
              id={'app.order.history'}
              defaultMessage={"Historique des commandes"}
              description={"Order - History"}
            />
          </h1>

          {/*<Rating name='a' precision={1} defaultValue={2} />*/}
          { loading && <SpinnerLoading message={"Chargement de l'historique des commandes"}/>}
          { retrieved && retrieved['hydra:member'] && (
            <Paper>
              <TableSort my_orders={retrieved['hydra:member']} validateOrder={this.validateOrder} />
            </Paper>

          )}

        </Container>
      </div>
    );
  }


}

const mapStateToProps = state => {
  const {
    retrieved,
    loading,
    error,
    eventSource,
    deletedItem
  } = state.orderset.list;
  return { retrieved, loading, error, eventSource, deletedItem };
};

const mapDispatchToProps = dispatch => ({
  list: (page, history, location) => dispatch(list(page, history, location)),
  reset: eventSource => dispatch(reset(eventSource))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(List));
