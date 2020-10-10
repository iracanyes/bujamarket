import React, {Component, Fragment } from "react";
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
    this.props.images.map(el => URL.revokeObjectURL(el.url));
    this.props.reset(this.props.eventSource);
  }

  render(){
    const { images, loading, error, comment } = this.props;

    (error && error.length > 0) && toastError(error);

    let retrieved = [];
    retrieved = images !== [] ? images.filter(el => el.id === this.props.id) : [];
    console.log('retrieved image', images);
    console.log('retrieved image', retrieved);

    return (
      <Fragment>
        {(retrieved !== [] && retrieved[0] && retrieved[0].id === this.props.id) ? (<Avatar src={retrieved[0].url} alt={comment.alt}/>) : (<Avatar src={null} alt={comment.alt}/>)}
      </Fragment>
    );
  }
}

let images = [];

const mapStateToProps = state => {
  const { retrieved, loading, error } = state.image.commentImage;
  // Ajouter l'image récupérée dans le tableau des images de client qui ont commenté le produit
  if(retrieved !== null && images.filter(el => el.id === retrieved.id).length === [].length)
    images.push(retrieved);

  return { images, loading, error };
};

const mapDispatchToProps = dispatch => ({
  getCustomerImage: (id, history, location) => dispatch(getCustomerImage(id, history, location)),
  reset: eventSource => dispatch(reset(eventSource))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CommentCustomerImage));
