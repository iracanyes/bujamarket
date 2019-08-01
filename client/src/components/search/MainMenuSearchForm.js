/**
 * Author: iracanyes
 * Date: 29/07/2019
 * Description: Main Menu - Search Form V2
 * En utilisant la méthode HOC de React pour transmettre les données de la recherche vers le composant d'ordre supérieur "App" qui transmet ensuite les données au composant d'affichage "SearchResults"
 */
import React, { Component, Fragment} from "react";
import { connect } from "react-redux";
import { Button, Form, FormGroup, Input } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import { injectIntl } from "react-intl";
import { list as listProduct, reset as resetProduct } from "../../actions/product/list";
import { list as listSupplier, reset as resetSupplier } from "../../actions/supplier/list";

class MainMenuSearchForm extends Component
{
  static propTypes = {
    retrievedProducts: PropTypes.object,
    loadingProducts: PropTypes.bool.isRequired,
    errorProducts: PropTypes.string,
    eventSourceProducts: PropTypes.instanceOf(EventSource),
    retrievedSuppliers: PropTypes.object,
    loadingSuppliers: PropTypes.bool.isRequired,
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
      searchType: "products",
      searchValue: "",
      searchResults: []
    };

    this.handleSearchValueChange = this.handleSearchValueChange.bind(this);
    this.handleSearchTypeChange = this.handleSearchTypeChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {

    this.state.searchType && this.props.listProduct( );


    /* Retarder l'envoie de la réponse de 3sec! */
    setTimeout(() => {
      let results = {
        searchType: "products",
        searchValue: "",
        searchResults: this.props.retrievedProducts["hydra:member"]
      };
      this.props.onSearch(results);
    }, 3000);

    /*
    if(this.props.retrievedProducts !== null)
    {
      setTimeout(() => {
        this.props.onSearch(this.props.retrievedProducts["hydra:member"]);
      }, 3000);
    }
    */


  }

  handleSearchTypeChange(e)
  {
    this.setState({searchType: e.target.value});

    console.log(e.target.name + " => " +  e.target.value);
    console.log("state : " + this.state.searchType);

    if(e.target.value === "suppliers")
    {
      this.props.listSupplier();

      setTimeout(() => {
        this.props.onSearch({
          searchType: this.state.searchType,
          searchValue: "",
          searchResults: this.props.retrievedSuppliers["hydra:member"]
        });
      }, 3000);

      console.log("Suppliers", this.props.retrievedSuppliers);
    }else
    {
      this.props.listProduct();

      setTimeout(() => {
        this.props.onSearch({
          searchType: this.state.searchType,
          searchValue: "",
          searchResults: this.props.retrievedProducts["hydra:member"]
        });
      }, 3000);
    }




  }

  handleSearchValueChange(e)
  {
    /* Traitement de l'input */

    this.setState({searchValue: e.target.value});

    if(this.state.searchType === "products")
    {
      const results = this.props.retrievedProducts["hydra:member"].filter(item => item.title === this.state.searchValue);

      this.props.onSearch({
        searchType: this.state.searchType,
        searchValue: this.state.searchValue,
        searchResults: results
      });
    }else
    {
      const results = this.props.retrievedSuppliers["hydra:member"].filter(item => item.socialReason === this.state.searchValue);

      this.props.onSearch({
        searchType: this.state.searchType,
        searchValue: this.state.searchValue,
        searchResults: results
      });
    }

  }

  handleSubmit(e)
  {
    /* Eviter l'envoi du formulaire */
    e.preventDefault();


  }

  render()
  {
    const { intl } = this.props;

    return (
      <Fragment>
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
    );
  }


}

const mapStateToProps = state => {
  const {
    retrieved: retrievedProducts,
    loading: loadingProducts,
    error: errorProducts,
    eventSource: eventSourceProducts
  } = state.product.list;

  const {
    retrieved: retrievedSuppliers,
    loading: loadingSuppliers,
    error: errorSuppliers,
    eventSource: eventSourceSuppliers,
  } = state.supplier.list;

  return { retrievedProducts, loadingProducts, errorProducts, eventSourceProducts,retrievedSuppliers,loadingSuppliers, errorSuppliers,  eventSourceSuppliers, };
};

const mapDispatchToProps = dispatch => ({
  listProduct: page => dispatch(listProduct(page)),
  resetProduct: eventSource => dispatch(resetProduct(eventSource)),
  listSupplier: page => dispatch(listSupplier(page)),
  resetSupplier: eventSource => dispatch(resetSupplier(eventSource))
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(MainMenuSearchForm));
