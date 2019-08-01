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
import { injectIntl } from "react-intl";

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
    // Empêche le bouton click de soumettre le formulaire
    e.preventDefault();


    switch(this.state.searchType)
    {
      case "suppliers":
        this.state.searchValue &&

          this.props.history.push("suppliers?socialReason=" + decodeURIComponent(this.state.searchValue));

        break;
      case "products":
        this.state.searchValue &&
          this.props.history.push("products?title=" + decodeURIComponent(this.state.searchValue));
        break;
      default:
        this.state.searchValue &&
          this.props.history.push("products?title=" + decodeURIComponent(this.state.searchValue));

    }

    window.location.reload();



  }

  render()
  {
    const { intl } = this.props;

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
              { intl.formatMessage({
                id:"app.header.search_form.search_type.products",
                defaultMessage: "Produits",
                description: "Header search form : search type product"
              }) }
            </option>
            <option value="suppliers">
              {intl.formatMessage({
                id: "app.header.search_form.search_type.suppliers",
                defaultMessage: "Fournisseurs",
                description: "Header search form : search type suppliers"
              })}
            </option>
          </Input>
        </FormGroup>
        <Input className="form-control col-lg-8"
               type='search'
               aria-label='Search'
               placeholder={intl.formatMessage({
                 id:"app.search_form.search_input.text",
                 defaultMessage: "Recherche",
                 description: "Header search form search input placeholder"
               })}
               value={this.state.searchValue}
               onChange={this.handleSearchValueChange}
               onClick={this.reset}
        />
        <Button type="submit" outline color="primary" className={"my-2 my-sm-0"}>
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

export default withRouter(injectIntl(connect(null, mapDispatchToProps )(SearchForm)));
