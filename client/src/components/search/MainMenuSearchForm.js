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
import { FormattedMessage, injectIntl } from "react-intl";
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

  /* Variable marquant le montage/démontage de l'application
  * Permet d'éviter les memory leaks en transmettant les données alors que le composant est démonté
  * */
  _isMounted = false;

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
    this.handleToggleAdvancedSearchButton = this.handleToggleAdvancedSearchButton.bind(this);
    this.showSearchResults = this.showSearchResults.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    this.state.searchType && this.props.listProduct( );




    /* Fonction à exécuter par intervalle de temps (1sec) pour vérifier que les valeurs ont été reçus par le composant avant leur transmission au composant d'ordre supérieur */
    /* ATTENTION: le nom de variable contenant l'intervalle doit être "intervalForRetrieved" */
    let waitForRetrieved = (interval) =>
    {

      const items = this.props.retrievedProducts;

      /* Si les valeurs sont acquis par le composant, on les transmet au composant d'ordre supérieur via la fonction (onSearch) reçu comme propriété du composant */
      console.log("Main Menu Search Form - Items", items);

      if( typeof items !== "undefined"  && items !== null && this._isMounted)
      {
        let results = {
          searchType: "products",
          searchValue: "",
          searchResults: items["hydra:member"]
        };
        this.props.onSearch(results);
        clearInterval(interval);

      }
    };

    /* Interval d'exécution d'une fonction d'attente des valeurs (1sec) */
    let intervalForRetrieved = setInterval(() => {waitForRetrieved(intervalForRetrieved)}, 2000);

    /*
    setTimeout(() => {
      let results = {
        searchType: "products",
        searchValue: "",
        searchResults: this.props.retrievedProducts["hydra:member"]
      };
      this.props.onSearch(results);
    }, 3000);
    */
  }

  componentWillUnmount() {
    /* Marque le composant comme démonté */
    this._isMounted = false;

    /* On supprime l'interval d'exécution s'il y en a  */
    clearInterval();
  }

  handleSearchTypeChange(e)
  {
    /*  */
    this.setState({"searchType": e.target.value});

    /* Affichage du composant de résultat */
    this.showSearchResults();

    console.log(e.target.name + " => " +  e.target.value);
    console.log("state.searchType : " + this.state.searchType);

    let searchTypeValue = e.target.value;



    if(searchTypeValue === "suppliers")
    {
      this.props.listSupplier();

      setTimeout(() => {
        this.props.onSearch({
          searchType: this.state.searchType,
          searchValue: "",
          searchResults: this.props.retrievedSuppliers["hydra:member"]
        });
      }, 3000);

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

    /* Affichage du composant de résultat */
    this.showSearchResults();

    if(this.state.searchType === "products")
    {
      console.log("SearchType : ", this.state.searchType);
      console.log("SearchValue (state): ", this.state.searchValue);
      console.log("SearchValue (event): ", e.target.value);

      console.log("Produits - Resultat avant filtrage", this.props.retrievedProducts["hydra:member"] );

      const results = this.props.retrievedProducts["hydra:member"].filter(item => item.title.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1 );

      console.log("Produits - Resultat après filtrage", results );

      this.props.onSearch({
        searchType: this.state.searchType,
        searchValue: this.state.searchValue,
        searchResults: results
      });
    }else
    {
      console.log("SearchType : ", this.state.searchType);
      console.log("SearchValue (state): ", this.state.searchValue);
      console.log("SearchValue (event): ", e.target.value);

      console.log("Produits - Resultat avant filtrage", this.props.retrievedProducts["hydra:member"] );

      const results = this.props.retrievedSuppliers["hydra:member"].filter(item => item["socialReason"].toLowerCase().indexOf(e.target.value.toLowerCase()) > -1);

      console.log("Produits - Resultat après filtrage", results );

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
        <Form inline className="col-lg-12" onSubmit={this.handleSubmit}>
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
          <Button type="submit" outline color="light" className={"my-2 my-sm-0"}>
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
