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

class SearchForm extends Component
{
  static propTypes = {
    eventSource: PropTypes.instanceOf(EventSource),
    searchProduct: PropTypes.func.isRequired,
    resetProduct: PropTypes.func.isRequired
  };

  constructor(props)
  {
    super(props);

    this.state = {
      searchType: '',
      search: ''
    };

    this.handleSearchTypeChange = this.handleSearchTypeChange.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);


  }

  handleSearchTypeChange(event)
  {
    this.setState({searchType: event.target.value});
  }

  handleSearchChange(event)
  {
    this.setState({search: event.target.value });
  }

  handleSubmit()
  {
    if(this.state.searchType === "products")
    {
      this.props.search(
        "products",
        {
          "title":this.state.search, "resume":this.state.search
        })
      ;
    }

    if(this.state.searchType === "suppliers")
      this.props.search("suppliers", {"socialReason": this.state.search});
  }

  render()
  {
    return <Fragment>
      <Form inline className="col-lg-5">
        <FormGroup>
          <Input type="select"
                 name="searchType"
                 id="searchType"
                 className="custom-select"
                 value={this.state.searchType}
                 onChange={this.handleSearchTypeChange}
          >
            <option value="product">
              Produit
            </option>
            <option value="supplier">
              Fournisseur
            </option>
          </Input>
        </FormGroup>
        <Input className="form-control col-lg-8" type='search' aria-label='Search' placeholder="Recherche" value={this.state.search} onChange={this.handleSearchChange}/>
        <Button outline color="primary" className={"my-2 my-sm-0"}>
          <FontAwesomeIcon icon="search" />
        </Button>
      </Form>
    </Fragment>
  }

}

const mapDispatchToProps = dispatch => ({
  searchProduct: (page, options) => dispatch(searchProduct(page, options)),
  resetProduct: eventSource => dispatch(resetProduct(eventSource))
});

export default connect(mapDispatchToProps)(SearchForm);