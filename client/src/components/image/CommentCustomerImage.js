import React, {Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCustomerImage, reset } from "../../actions/image/commentImage";
import {toastError} from "../../layout/component/ToastMessage";
import {withRouter} from "react-router-dom";
import { Avatar } from "@material-ui/core";

class CommentCustomerImage extends Component
{
  static propTypes = {
    id: PropTypes.number.isRequired,
    comment: PropTypes.object.isRequired,
    getCustomerImage: PropTypes.func,
    images: PropTypes.array,
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired
  };
  componentDidMount() {
    this.props.getCustomerImage(this.props.id, this.props.history, this.props.location);
  }

  componentWillUnmount() {
    this.props.images.map(el => URL.revokeObjectURL(el.url));
    this.props.reset(this.props.eventSource);
  }

  render(){
    const { images, error, comment } = this.props;

    (error && error.length > 0) && toastError(error);

    let retrieved = [];
    retrieved = images !== [] ? images.filter(el => el.id === this.props.id) : [];

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
