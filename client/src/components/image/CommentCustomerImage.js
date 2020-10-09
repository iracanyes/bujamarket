import React, {Component } from "react";
import { connect } from "react-redux";
import { getCustomerImage, reset } from "../../actions/image/commentImage";
import {toastError} from "../../layout/ToastMessage";
import {SpinnerLoading} from "../../layout/Spinner";
import {withRouter} from "react-router-dom";
import { Avatar } from "@material-ui/core";

class CommentCustomerImage extends Component
{
  componentDidMount() {
    this.props.getCustomerImage(this.props.id, this.props.history, this.props.location);
  }

  componentWillUnmount() {
    this.props.reset(this.props.eventSource);
  }

  render(){
    const { retrieved, loading, error, comment } = this.props;

    (error && error.length > 0) && toastError(error);

    if(loading)
      return <SpinnerLoading message={'Chargement image client'}/>
    else
      return <Avatar src={retrieved} alt={comment.alt}/>
  }
}

const mapStateToProps = state => {
  const { retrieved, loading, error } = state.image.commentImage;
  return { retrieved, loading, error };
};

const mapDispatchToProps = dispatch => ({
  getCustomerImage: (id, history, location) => dispatch(getCustomerImage(id, history, location)),
  reset: eventSource => dispatch(reset(eventSource))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CommentCustomerImage));
