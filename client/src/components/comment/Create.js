import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Form from './Form';
import { create, reset } from '../../actions/comment/create';

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
    const { created, loading, error } = this.props;

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
