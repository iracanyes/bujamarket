import React, { Component } from "react";
import { connect } from "react-redux";
import { getSupplierImage, reset } from "../../actions/image/supplier";
import {SpinnerLoading} from "../../layout/component/Spinner";
import { CardMedia } from "@material-ui/core";

class SupplierImage extends Component
{
  componentDidMount() {
    this.props.getSupplierImage(this.props.supplier.id);
  }

  componentWillUnmount() {
    this.props.reset(this.props.eventSource);
  }

  render(){
    const { supplier, suppliersImage, index } = this.props;


    if(this.props.loading || !suppliersImage[index])
      return <SpinnerLoading message={'Chargement image fournisseur'}/>
    else
      return (<CardMedia  image={suppliersImage[index]} alt={supplier.socialReason} title={supplier.socialReason}/>)
  }
}
const suppliersImage = [];
const mapStateToProps = state => {
  const { retrieved, loading, error, eventSource} = state.image.supplier;
  if(retrieved && !suppliersImage.includes(retrieved)){
    suppliersImage.push(retrieved);
  }
  return { suppliersImage, retrieved, loading, error, eventSource};
}

const mapDispatchToProps = dispatch => ({
  getSupplierImage: id => dispatch(getSupplierImage(id)),
  reset: eventSource => dispatch(reset(eventSource))
});

export default connect(mapStateToProps, mapDispatchToProps)(SupplierImage);
