import React,{ Component, Fragment} from "react";
import { connect } from "react-redux";
import { retrieve, reset } from "../../actions/supplier/show";
import {FormattedMessage} from "react-intl";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { getSupplierImage, reset as resetImage } from "../../actions/image/supplier";
import {toastError} from "../../layout/ToastMessage";
import SupplierImage from "../image/SupplierImage";
import {IconButton} from "@material-ui/core";

class SupplierShowWidget extends Component{

  componentDidMount() {
    if(localStorage.getItem("token") !== null){
      this.props.retrieve(this.props.supplierId, this.props.history);
    }

  }

  componentWillUnmount() {
    this.props.reset(this.props.eventSource);
    this.props.resetImage(this.props.eventSourceImage);
  }

  render() {
    const { retrieved, error } = this.props;

    const supplier = retrieved && retrieved;

    (error && error.length > 0) && toastError(error);

    return (
      <Fragment>
        {supplier && (
          <div>
            <div className="detail-vcard">
              <div className="detail-logo">
                <SupplierImage supplier={supplier}/>
              </div>
              {/* /.detail-logo */}

              <div className="detail-contact">
                <div className="detail-contact-email">
                  <i className="fa fa-envelope-o"></i> <a href={"mailto:"+ (supplier.contactEmail ?supplier.contactEmail : "#")}>{supplier.contactEmail}</a>
                </div>
                <div className="detail-contact-phone">
                  <i className="fa fa-mobile-phone"></i> <a href={"tel:#" + (supplier.contactPhoneNumber ? supplier.contactPhoneNumber : "#")}>{supplier.contactPhoneNumber}</a>
                </div>
                <div className="detail-contact-website">
                  <i className="fa fa-globe"></i> <a href={supplier.website !== "" ? supplier.website: "#"}>{supplier.website !== "" ? supplier.website : "Aucun site internet"}</a>
                </div>
                <div className="detail-contact-address">
                  <i className="fa fa-map-o"></i>
                  {supplier.addresses[0].street + " " + supplier.addresses[0].number}<br/>
                  {supplier.addresses[0].town + " " + supplier.addresses[0].state}<br/>
                  {supplier.addresses[0].zipCode+ " " + supplier.addresses[0].country}
                </div>
              </div>
              {/* /.detail-contact */}
            </div>
            {/* /.detail-vcard */}
            <div className="detail-follow">
              <h5>
                <FormattedMessage id={"app.page.supplier_product.follow_us"}
                                  defaultMessage={"Suivez-nous"}
                                  description={"Supplier product page - follow us"}
                />
              </h5>
              <div className="follow-wrapper">
                <IconButton className="follow-btn facebook" component={'a'}><FontAwesomeIcon icon={['fab',"facebook"]}/></IconButton>
                <IconButton className="follow-btn youtube" component={'a'}><FontAwesomeIcon icon={['fab',"youtube"]}/></IconButton>
                <IconButton className="follow-btn twitter" component={'a'}><FontAwesomeIcon icon={['fab',"twitter"]}/></IconButton>
                <IconButton component={'a'} className="follow-btn tripadvisor"><FontAwesomeIcon icon={['fab',"tripadvisor"]}/></IconButton>
                <IconButton className="follow-btn google-plus" component={'a'}><FontAwesomeIcon icon={['fab',"google-plus"]}/></IconButton>
              </div>
              {/* /.follow-wrapper */}
            </div>
            {/* /.detail-follow */}
          </div>
        )}

      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  const { retrieved, error, loading, eventSource } = state.supplier.show;

  return {
    retrieved, error, loading, eventSource,
  };
};

const mapDispatchToProps = dispatch => ({
  retrieve : (id, history) => dispatch(retrieve(id, history)),
  reset: eventSource => dispatch(reset(eventSource)),
  getSupplierImage: id => dispatch(getSupplierImage(id)),
  resetImage: eventSource => dispatch(resetImage(eventSource))
});

export default connect( mapStateToProps, mapDispatchToProps )(SupplierShowWidget);
