/**
 * Author: iracanyes
 * Date: 29/07/2019
 * Description: Main Menu - Search Form V2
 * En utilisant la méthode HOC de React pour transmettre les paramètres de la recherche vers le composant d'ordre supérieur "App" qui transmet ensuite les paramètres au composant d'affichage "SearchResults".
 * Les données DB seront acccessibles  via l'état de l'application
 */
import React, { Component, Fragment} from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Button, Form, FormGroup, Input } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import { FormattedMessage, injectIntl } from "react-intl";
import { search as searchProduct, reset as resetProduct } from "../../actions/product/search";
import { search as searchSupplier, reset as resetSupplier } from "../../actions/supplier/search";

class MainMenuSearchForm extends Component
{
  static propTypes = {
    retrievedProducts: PropTypes.object,
    loadingProducts: PropTypes.bool,
    errorProducts: PropTypes.string,
    eventSourceProducts: PropTypes.instanceOf(EventSource),
    retrievedSuppliers: PropTypes.object,
    loadingSuppliers: PropTypes.bool,
    errorSuppliers: PropTypes.string,
    eventSourceSuppliers: PropTypes.instanceOf(EventSource),
    searchProduct: PropTypes.func,
    resetProduct: PropTypes.func,
    searchSupplier: PropTypes.func,
    resetSupplier: PropTypes.func,
    onSearch: PropTypes.func
  };


  constructor(props)
  {
    super(props);
    this.state = {
      disabled: true,
      searchType: "products",
      searchValue: "",
      searchParams: {},
      searchResults: []
    };


    this.handleSearchValueChange = this.handleSearchValueChange.bind(this);
    this.handleSearchTypeChange = this.handleSearchTypeChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleToggleAdvancedSearchButton = this.handleToggleAdvancedSearchButton.bind(this);
    this.showSearchResults = this.showSearchResults.bind(this);
  }

  componentDidMount() {

  }

  componentWillUnmount() {

    this.props.resetProduct();
    this.props.resetSupplier();
  }

  handleSearchTypeChange(e)
  {
    // Mettre à jour l'état du composant
    this.setState({"searchType": e.target.value});

  }

  handleSearchValueChange(e)
  {
    // Traitement de l'input
    this.setState({searchParams: {default: e.target.value } });


  }

  handleSubmit(e)
  {
    /* Eviter l'envoi du formulaire */
    e.preventDefault();

    // Affichage du composant de résultat
    this.showSearchResults();

    if(this.state.searchType === "products")
    {

      this.props.searchProduct(this.state.searchParams);

    }
    else{
      // Données de localisation au sein de l'application
      let prevRoute = this.props.location.search ? this.props.location.pathname + this.props.location.search :  this.props.location.pathname;


      this.props.searchSupplier(this.state.searchParams, this.props.history, {from : prevRoute, params: this.state} );

    }

    // Transmission des valeurs de recherche au composant de résultat par HOC
    this.props.onSearch({
      searchType: this.state.searchType,
      searchValue: this.state.searchValue,
      searchParams: this.state.searchParams
    });

  }

  handleToggleAdvancedSearchButton()
  {
    let element = document.getElementById("search-results-component");

    if(element.style.display === "none" || element.style.display === "")
    {
      element.style.display = "block";
    }else
    {
      element.style.display = "none";
    }

  }

  showSearchResults()
  {
    let element = document.getElementById("search-results-component");

    if(element.style.display === "none" || element.style.display === "")
    {
      element.style.display = "block";
    }
  }

  render()
  {
    const { intl } = this.props;


    return (
      <Fragment>
        <Form inline className="col-lg-12 px-0" onSubmit={this.handleSubmit}>
          <FormGroup className={'mr-0'}>
            <Input type="select"
                   name="searchType"
                   id="searchType"
                   className="custom-select"
                   value={this.state.searchType}
                   onChange={this.handleSearchTypeChange}
                   disabled={localStorage.getItem('token') === null ? 'disabled' : ""}
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
                 value={this.state.searchParams.title}
                 onChange={this.handleSearchValueChange}
                 onClick={this.reset}
          />
          <Button type="submit" outline color="light" className={"my-2 my-sm-0"} onClick={this.handleSubmit}>
            <FontAwesomeIcon icon="search" />
          </Button>
        </Form>
        <div id={"advanced-search-toggle-button"}>
          <button onClick={this.handleToggleAdvancedSearchButton} className="btn-advanced-search-toggle-button">
            <FormattedMessage  id={"app.header.search.form.advanced.button"}
                               defaultMessage="Recherche avancée"
                               description="Header - Main menu search form advanced button"
            />
          </button>
        </div>
      </Fragment>
    );
  }


}
/*
const mapStateToProps = state => {
  const {
    retrieved: retrievedProducts,
    loading: loadingProducts,
    error: errorProducts,
    eventSource: eventSourceProducts
  } = state.product.search;

  const {
    retrieved: retrievedSuppliers,
    loading: loadingSuppliers,
    error: errorSuppliers,
    eventSource: eventSourceSuppliers,
  } = state.supplier.list;

  return { retrievedProducts, loadingProducts, errorProducts, eventSourceProducts,retrievedSuppliers,loadingSuppliers, errorSuppliers,  eventSourceSuppliers, };
};
*/

const mapDispatchToProps = dispatch => ({
  searchProduct: searchParams => dispatch(searchProduct(searchParams)),
  resetProduct: eventSource => dispatch(resetProduct(eventSource)),
  searchSupplier: (searchParams, history, locationState) => dispatch(searchSupplier(searchParams,history, locationState)),
  resetSupplier: eventSource => dispatch(resetSupplier(eventSource))
});

export default withRouter(injectIntl(connect(null, mapDispatchToProps)(MainMenuSearchForm)));
