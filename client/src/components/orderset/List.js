import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { list, reset } from '../../actions/orderset/list';
import {FormattedMessage, injectIntl } from "react-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container } from "reactstrap";
import {
  Paper
} from "@material-ui/core";
import {toastError} from "../../layout/ToastMessage";
import TableSort from "./TableSort";
import {SpinnerLoading} from "../../layout/Spinner";

class List extends Component {
  static propTypes = {
    retrieved: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    eventSource: PropTypes.instanceOf(EventSource),
    list: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired
  };

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
          { loading && <SpinnerLoading message={"Chargement de l'historique des commandes"}/>}
          { retrieved && retrieved['hydra:member'] && (
            <Paper>
              { console.log("List - retrieved ",retrieved)}
              <TableSort my_orders={retrieved['hydra:member']} />
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
)(List);
