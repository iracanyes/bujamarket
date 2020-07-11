import React,{ Component, Fragment} from "react";
import { connect } from "react-redux";
import { retrieve, reset } from "../../actions/supplier/show";
import {FormattedMessage} from "react-intl";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { getSupplierImage, reset as resetImage } from "../../actions/image/supplier";
import { SpinnerLoading } from "../../layout/Spinner";

class SupplierShowWidget extends Component{
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if(localStorage.getItem("token") !== null)
      this.props.retrieve(this.props.supplierId, this.props.history);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(this.props.retrieved && !this.props.retrievedImage)
      this.props.getSupplierImage(this.props.retrieved.image.id);
  }

  componentWillUnmount() {
    this.props.reset(this.props.eventSource);
    this.props.resetImage(this.props.eventSourceImage);
  }

  render() {
    const { retrieved, error, loading, retrievedImage } = this.props;

    const supplier = retrieved && retrieved;

    retrievedImage && console.log('image', retrievedImage);

    return (
      <Fragment>
        {supplier && (
          <div>
            <div className="detail-vcard">
              <div className="detail-logo">
                {!this.props.retrievedImage
                  ? <SpinnerLoading message={"Chargement de l'image"} />
                  : <img src={this.props.retrievedImage} alt={supplier.image.alt} title={supplier.image.title}/>
                }

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
                <a className="follow-btn facebook" href="#"><FontAwesomeIcon icon={['fab',"facebook"]}/></a>
                <a className="follow-btn youtube" href="#"><FontAwesomeIcon icon={['fab',"youtube"]}/></a>
                <a className="follow-btn twitter" href="#"><FontAwesomeIcon icon={['fab',"twitter"]}/></a>
                <a className="follow-btn tripadvisor" href="#"><FontAwesomeIcon icon={['fab',"tripadvisor"]}/></a>
                <a className="follow-btn google-plus" href="#"><FontAwesomeIcon icon={['fab',"google-plus"]}/></a>
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
  const { retrieved: retrievedImage, error: errorImage, loading: loadingImage, eventSource: eventSourceImage } = state.image.supplier;

  return {
    retrieved, error, loading, eventSource,
    retrievedImage, loadingImage, errorImage, eventSourceImage
  };
};

const mapDispatchToProps = dispatch => ({
  retrieve : (id, history) => dispatch(retrieve(id, history)),
  reset: eventSource => dispatch(reset(eventSource)),
  getSupplierImage: id => dispatch(getSupplierImage(id)),
  resetImage: eventSource => dispatch(resetImage(eventSource))
});

export default connect( mapStateToProps, mapDispatchToProps )(SupplierShowWidget);
