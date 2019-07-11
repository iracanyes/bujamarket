/**
 * Author: iracanyes
 * Date: 23/06/19
 * Description: Header
 */
import React, {Component, Fragment} from "react";
import {
  Navbar,
  NavbarBrand,
} from 'reactstrap';
import SearchForm from '../components/page/SearchForm';
import MainMenu from "./MainMenu";



export default class Header extends Component
{

  render()
  {
    return <Fragment>
      <Navbar color={"bg-primary"} dark expand={"lg"}   id="navbar-primary" className="navbar navbar-expand-lg navbar-dark bg-primary">
        {/* Navbar brand*/}
        <NavbarBrand href="/" className="col-lg-2">Buja Market</NavbarBrand>


        <SearchForm/>


        <MainMenu/>

      </Navbar>
    </Fragment>
  }
}


