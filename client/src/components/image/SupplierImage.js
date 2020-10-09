import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { getSupplierImage, reset } from "../../actions/image/supplier";
import {SpinnerLoading} from "../../layout/Spinner";

class SupplierImage extends Component
{
  componentDidMount() {
    this.props.getSupplierImage(this.props.supplier.id);
  }

  componentWillUnmount() {
    this.props.reset(this.props.eventSource);
  }

  render(){
    const { retrieved, supplier } = this.props;

    if(this.props.loading)
      return <SpinnerLoading message={'Chargement image fournisseur'}/>
    else
      return (<img src={retrieved} alt={supplier.image.alt} title={supplier.image.title}/>)
  }
}

const mapStateToProps = state => {
  const { retrieved, loading, error, eventSource} = state.image.supplier;

  return { retrieved, loading, error, eventSource};
}

const mapDispatchToProps = dispatch => ({
  getSupplierImage: id => dispatch(getSupplierImage(id)),
  reset: eventSource => dispatch(reset(eventSource))
});

export default connect(mapStateToProps, mapDispatchToProps)(SupplierImage);
