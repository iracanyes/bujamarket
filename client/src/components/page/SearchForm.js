/**
 * Author: iracanyes
 * Date: 25/06/19
 * Description: Main Menu : Search bar
 */
import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Button, Form, FormGroup, Input } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { search as searchProduct, reset as resetProduct }from "../../actions/product/search";
import { search as searchSupplier, reset as resetSupplier } from "../../actions/supplier/search";
import { withRouter } from "react-router-dom";

class SearchForm extends Component
{
  static propTypes = {
    eventSource: PropTypes.instanceOf(EventSource),
    searchProduct: PropTypes.func.isRequired,
    resetProduct: PropTypes.func,
    searchSupplier: PropTypes.func.isRequired,
    resetSupplier: PropTypes.func,
    push: PropTypes.func
  };

  constructor(props)
  {
    super(props);

    this.state = {
      searchType: 'products',
      searchValue: ''
    };

    this.handleSearchTypeChange = this.handleSearchTypeChange.bind(this);
    this.handleSearchValueChange = this.handleSearchValueChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);


  }

  handleSearchTypeChange(event)
  {
    this.setState({searchType: event.target.value});
  }

  handleSearchValueChange(event)
  {
    this.setState({searchValue: event.target.value });

  }

  handleSubmit(e)
  {
    e.preventDefault();

    const MIME_TYPE =  "application/ld+json";
    let headers = new Headers({
      "Content-Type": MIME_TYPE,
      "Accept": MIME_TYPE
    }) ;






    switch(this.state.searchType)
    {
      case "suppliers":
        this.state.searchValue &&

          this.props.history.push("suppliers?socialReason=" + decodeURIComponent(this.state.searchValue));

        break;
      default:
        this.state.searchValue &&
          this.props.history.push("products?title=" + decodeURIComponent(this.state.searchValue));

    }



  }

  render()
  {
    return <Fragment>
      <Form inline className="col-lg-5" onSubmit={this.handleSubmit}>
        <FormGroup>
          <Input type="select"
                 name="searchType"
                 id="searchType"
                 className="custom-select"
                 value={this.state.searchType}
                 onChange={this.handleSearchTypeChange}
          >
            <option value="products">
              Produits
            </option>
            <option value="suppliers">
              Fournisseurs
            </option>
          </Input>
        </FormGroup>
        <Input className="form-control col-lg-8" type='search' aria-label='Search' placeholder="Recherche" value={this.state.searchValue} onChange={this.handleSearchValueChange}/>
        <Button outline color="primary" className={"my-2 my-sm-0"}>
          <FontAwesomeIcon icon="search" />
        </Button>
      </Form>
    </Fragment>
  }

}

const mapDispatchToProps = dispatch => ({
  searchProduct: (page, options) => dispatch(searchProduct(page, options)),
  resetProduct: eventSource => dispatch(resetProduct(eventSource)),
  searchSupplier: (page, options) => dispatch(searchSupplier(page, options)),
  resetSupplier: eventSource => dispatch(resetSupplier(eventSource))
});

export default withRouter(connect(null, mapDispatchToProps )(SearchForm));