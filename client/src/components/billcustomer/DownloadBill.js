import React, {Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { download, reset } from "../../actions/billcustomer/download";
import {
  Tooltip,
  IconButton
} from "@material-ui/core";
import {
  ImCloudDownload
} from "react-icons/all";

class DownloadBill extends Component
{
  static propTypes = {
    url: PropTypes.string.isRequired,
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired
  };

  componentWillUnmount() {
    this.props.reset();
  }

  downloadBill(e)
  {
    e.preventDefault();
    this.props.download(this.props.url, this.props.history);
  }

  render(){
    return (
      <Tooltip title={'Télécharger la facture'} placement={'top'}>
        <IconButton
          color={'primary'}
          onClick={(e) => this.downloadBill(e)}
        >
          <ImCloudDownload color={'primary'}/>
        </IconButton>
      </Tooltip>
    );
  }
}

const mapStateToProps = state => {
  const { retrieved, error, loading } = state.billcustomer.download;
  return { retrieved, error, loading };
};
const mapDispatchToProps = dispatch => ({
  download: (url, history) => dispatch(download(url, history)),
  reset: () => dispatch(reset())
});
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(DownloadBill));
