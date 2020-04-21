import React, {Component, Fragment} from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {listBySupplierProductId, reset} from "../../actions/comment/list";
import Rating from "../../layout/Rating";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";

class SupplierProductCommentsWidget extends Component
{
  static propTypes = {
    retrieved: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    eventSource: PropTypes.instanceOf(EventSource),
    list: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired
  };

  componentDidMount() {

    if(localStorage.getItem('token'))
      this.props.list({supplier_product: decodeURIComponent(this.props.id)},'comments/supplier_product/',this.props.history );
  }

  componentWillUnmount() {
    this.props.reset(this.props.eventSource);
  }

  render()
  {
    const comments = this.props.retrieved && this.props.retrieved["hydra:member"] ;
    console.log("comments", comments);


    return (
      <div>
        <h2 id="reviews">Avis des clients</h2>
        <div className="reviews">

          {comments && comments.map((item, index) => (
            <div className="review bg-white" key={index}>
              <div className="review-image" id={"review-comments"}>
                <img src={item.url} alt={item.alt} />
              </div>
              {/* /.review-image */}

              <div className="review-inner">
                <div className="review-title">
                  <h2>{item.lastname}</h2>

                  <span className="report">
                      <span className="separator">&#8226;</span>
                    <i className="fa fa-flag" title="Report" data-toggle="tooltip" data-placement="top"></i>
                  </span>

                  <div className="review-overall-rating">
                    <span className="overall-rating-title">Avis client:</span>
                    <Rating rating={item.rating}/>
                  </div>
                  {/* /.review-rating */}
                </div>
                {/* /.review-title */}

                <div className="review-content-wrapper">
                  <div className="review-content">
                    <div className="review-pros">
                      <FontAwesomeIcon icon={faCommentDots} id={"comment-icon"}/>
                      <p>{item.content}</p>
                    </div>
                    {/* /.cons */}
                  </div>
                  {/* /.review-content */}
                  {/*
                  <div className="review-rating">
                    <dl>
                      <dt>Description</dt>
                      <dd>
                        <FontAwesomeIcon icon={["fas","star"]} />
                        <FontAwesomeIcon icon={["fas","star"]} />
                        <FontAwesomeIcon icon={["fas","star"]} />
                        <FontAwesomeIcon icon={["fas","star"]} />
                        <FontAwesomeIcon icon={["fas","star"]} />
                      </dd>
                      <dt>Délai de livraison</dt>
                      <dd>
                        <FontAwesomeIcon icon={["fas","star"]} />
                        <FontAwesomeIcon icon={["fas","star"]} />
                        <FontAwesomeIcon icon={["fas","star"]} />
                        <FontAwesomeIcon icon={["fas","star"]} />
                        <FontAwesomeIcon icon={["far","star"]} />
                      </dd>
                      <dt>Qualité produit</dt>
                      <dd>
                        <FontAwesomeIcon icon={["fas","star"]} />
                        <FontAwesomeIcon icon={["fas","star"]} />
                        <FontAwesomeIcon icon={["fas","star"]} />
                        <FontAwesomeIcon icon={["far","star"]} />
                        <FontAwesomeIcon icon={["far","star"]} />
                      </dd>
                      <dt>Atmosphere</dt>
                      <dd>
                        <FontAwesomeIcon icon={["fas","star"]} />
                        <FontAwesomeIcon icon={["fas","star"]} />
                        <FontAwesomeIcon icon={["fas","star"]} />
                        <FontAwesomeIcon icon={["far","star"]} />
                        <FontAwesomeIcon icon={["far","star"]} />
                      </dd>
                    </dl>
                  </div>
                   /.review-rating */}
                </div>
                {/* /.review-content-wrapper */}

              </div>
              {/* /.review-inner */}
            </div>
          ))}


          {/* /.review */}

        </div>
        {/* /.reviews */}
      </div>
    );
  }


}

const mapStateToProps = state => {
  const { retrieved, error, loading, eventSource} = state.comment.list;

  return { retrieved, error, loading, eventSource};
};

const mapDispatchToProps = dispatch => ({
  list: (options, page, history) => dispatch(listBySupplierProductId(options, page, history)),
  reset: eventSource => dispatch(reset(eventSource))
})

export default connect(mapStateToProps, mapDispatchToProps)(SupplierProductCommentsWidget);
