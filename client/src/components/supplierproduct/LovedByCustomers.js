import React, { Component, Fragment} from "react";
import { connect } from "react-redux";
import { withRouter} from "react-router-dom";
import { getBestRated, reset } from "../../actions/supplierproduct/getBestRated";
import {
  Box,
} from "@material-ui/core";
import SupplierProductGridList from "./SupplierProductGridList";
import {SpinnerLoading} from "../../layout/component/Spinner";
import {toastError} from "../../layout/component/ToastMessage";

class LovedByCustomers extends Component{

  componentDidMount() {
    this.props.getBestRated();
  }

  render() {
    const { retrieved, loading, error } = this.props;

    (error && error.length > 0) && toastError(error);
    return (
      <Fragment>
        {loading && (<SpinnerLoading message={"Chargement des produits préférés des clients"} />)}
        <Box id={'lovedByCustomers'}>
          {retrieved && (
            <SupplierProductGridList data={retrieved['hydra:member']}/>
          )}
        </Box>
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  const { retrieved, error, loading, eventSource } = state.supplierproduct.getBestRated;
  return { retrieved, error, loading, eventSource };
};

const mapDispatchToProps = dispatch => ({
  getBestRated: () => dispatch(getBestRated()),
  reset: eventSource => dispatch(reset(eventSource))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LovedByCustomers));
