import React, { Component } from "react";
import { connect } from "react-redux";
import { getSupplierImage, reset } from "../../actions/image/supplier";
import {SpinnerLoading} from "../../layout/Spinner";
import {CardImg} from "reactstrap";

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
    console.log('suppliersImage', suppliersImage);

    if(this.props.loading || !suppliersImage[index])
      return <SpinnerLoading message={'Chargement image fournisseur'}/>
    else
      return (<CardImg  top width="100%" src={suppliersImage[index]} alt={supplier.image.alt} title={supplier.image.title}/>)
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
