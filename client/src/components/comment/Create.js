import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Form from './Form';
import { create, reset } from '../../actions/comment/create';
import {toastError} from "../../layout/component/ToastMessage";

class Create extends Component {
  static propTypes = {
    supplierProductId: PropTypes.number.isRequired,
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    created: PropTypes.object,
    create: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired
  };


  componentWillUnmount() {
    this.props.reset();
  }



  render() {
    const { handleCommented, created, error } = this.props;

    typeof(error) === "string" && toastError(error);

    if(created){
      handleCommented.setCommented(true);
      handleCommented.setOpen(false);
    }

    return (
      <Fragment>
        <h6>Votre avis nous intéresse</h6>
        <Form supplierProductId={this.props.supplierProductId} orderDetailId={this.props.orderDetailId} values={this.props.item} />
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  const { created, error, loading } = state.comment.create;
  return { created, error, loading };
};

const mapDispatchToProps = dispatch => ({
  create: values => dispatch(create(values)),
  reset: () => dispatch(reset())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Create));
