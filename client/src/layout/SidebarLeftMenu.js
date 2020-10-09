/**
 * Date: 23/06/20
 * Description: Sidebar left -  Menu
 */
import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { SidebarLeftMenu as MenuCustomer } from "../components/customer";
import { SidebarLeftMenu as MenuSupplier } from "../components/supplier";

class SidebarLeftMenu extends Component
{
  static propTypes = {
    connectedUser: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      loggingIn: false
    };
  }

  render()
  {
    const { connectedUser } = this.props;

    console.log('connectedUser', connectedUser);
    //
    // const user = connectedUser.token ? JSON.parse(atob(connectedUser.token.split(".")[1])) : null;

    const user = localStorage.getItem('token') !== null ? JSON.parse(atob(localStorage.getItem('token').split('.')[1])): null;

    return <Fragment>

      {
        (connectedUser && (user && user.roles.includes('ROLE_CUSTOMER'))) && <MenuCustomer/>
      }
      {
        user && user.roles.includes('ROLE_SUPPLIER') && <MenuSupplier/>
      }
    </Fragment>;
  }
}

const mapStateToProps = state => {
  const { login: connectedUser } = state.user.authentication;
  return { connectedUser };
}

export default connect(mapStateToProps, null)(SidebarLeftMenu);
