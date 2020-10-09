import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import HalfRating from "./Rating";
import {
  Button
} from "@material-ui/core";
import {create, reset} from "../../actions/comment/create";
import { FormattedMessage } from "react-intl";
import {GrValidate} from "react-icons/all";

class Form extends Component {
  static propTypes = {
    supplierProductId: PropTypes.number.isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.createComment = this.createComment.bind(this);
  }

  createComment(e){
    e.preventDefault();
    const data = new FormData(document.getElementById("create-comment"));
    // Display the key/value pairs
    for (var pair of data.entries()) {
      console.log(pair[0]+ ', ' + pair[1]);
    }
    data.append('supplierProductId', this.props.supplierProductId.toString());

    const values = {
      "supplierProductId": this.props.supplierProductId,
      "orderDetailId": this.props.orderDetailId,
      "content": data.get('content'),
      "rating": parseFloat(data.get('rating'))
    };

    console.log('submit - values', values);

    if(this.props.supplierProductId)
      this.props.create(values, this.props.history, this.props.location);
  }

  renderField = data => {
    data.input.className = 'form-control';

    const isInvalid = data.meta.touched && !!data.meta.error;
    if (isInvalid) {
      data.input.className += ' is-invalid';
      data.input['aria-invalid'] = true;
    }

    if (this.props.error && data.meta.touched && !data.meta.error) {
      data.input.className += ' is-valid';
    }

    return (
      <div className={`form-group`}>
        <label
          htmlFor={`comment_${data.input.name}`}
          className="form-control-label"
        >
          {data.input.name}
        </label>
        <input
          {...data.input}
          type={data.type}
          step={data.step}
          required={data.required}
          placeholder={data.placeholder}
          id={`comment_${data.input.name}`}
        />
        {isInvalid && <div className="invalid-feedback">{data.meta.error}</div>}
      </div>
    );
  };

  render() {
    return (
      <form
        id={'create-comment'}
        name={'comment'}
        onSubmit={this.createComment}
      >
        <div className="flex flex-column">
          <div className={'flex'}>
            <label htmlFor={'content'}>Message</label>
            <textarea name={'content'} required={true} placeholder={'Vos avis nous intéresse...'}/>
          </div>
          <div className={'flex'}>
            <label>
              <FormattedMessage
                id={"app.product_rating"}
                defaultMessage={'Evaluation du produit'}
              />
              &nbsp;:&nbsp;
            </label>
            <HalfRating name={'rating'} />
          </div>
        </div>
        <Button
          variant={'outlined'}
          type="submit"
          className="text-success"
          startIcon={<GrValidate className={'text-success'}/>}
        >
          <FormattedMessage
            id={"app.button.validate"}
            defaultMessage={'Valider'}
          />
        </Button>
      </form>
    );
  }
}

const mapStateToProps = state => {
  const { created, error, loading } = state.comment.create;
  return { created, error, loading };
};

const mapDispatchToProps = dispatch => ({
  create: (values, history, location) => dispatch(create(values, history, location)),
  reset: () => dispatch(reset())
});

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({
  form: 'comment',
  enableReinitialize: true,
  keepDirtyOnReinitialize: true
})(withRouter(Form)));
