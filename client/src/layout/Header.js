/**
 * Author: iracanyes
 * Date: 23/06/19
 * Description:
 */
import React, {Component, Fragment} from "react";
import {ConnectedRouter, push} from 'connected-react-router';
import {connect, Provider} from 'react-redux';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from "react-intl";
import SearchForm from '../components/page/SearchForm';
import MainMenu from "./MainMenu";


export default class Header extends Component
{
  constructor(props)
  {
    super(props);

  }


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


