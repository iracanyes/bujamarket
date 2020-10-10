/**
 * Date: 23/06/20
 * Description: Header menu
 */
import React, {Component, Fragment} from "react";
import { connect } from 'react-redux';
import { withRouter, NavLink as RRDNavLink } from "react-router-dom";
import {
  Collapse,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import {
  Tooltip,
  IconButton
} from "@material-ui/core";
import {BsPeopleCircle, FcAbout, GiGlassHeart, SiWechat, TiShoppingCart} from "react-icons/all";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage, injectIntl } from "react-intl";
import { logout } from "../actions/user/login";


class MainMenu extends Component
{
  constructor(props)
  {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.logout = this.logout.bind(this);
    this.state = {
      isOpen: true
    };

  }

  toggle()
  {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  logout()
  {
    this.props.logout();
  }

  render()
  {
    const { intl } = this.props;
    const  user  = localStorage.getItem('token') !== null ? JSON.parse(atob(localStorage.getItem('token').split('.')[1])) : null;


    return <Fragment>
      <NavbarToggler onClick={this.toggle} />
      <Collapse isOpen={this.state.isOpen} navbar>
        <Nav className="ml-auto w-100" navbar>
          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>
              <Tooltip
                placement={'top'}
                title={
                  user !== null
                    ? (user.name[0].toUpperCase() + user.name.slice(1))
                    : intl.formatMessage({
                      id:'app.button.profile',
                      defaultMessage:"Profil",
                      description:"Button - Profil"
                    })
                }
              >
                <IconButton color={'primary'}>
                  <BsPeopleCircle />
                </IconButton>
              </Tooltip>
            </DropdownToggle>
            <DropdownMenu  >
              { user ===  null && (
                <div className={'d-flex'}>
                  <DropdownItem>
                    <NavLink tag={RRDNavLink} to={{pathname:"/login", state: { from : window.location.pathname }}}>
                      <FontAwesomeIcon icon="user-check" className={"float-left"} />
                      <FormattedMessage  id={"app.button.sign_in"}
                                         defaultMessage="Connexion"
                                         description="Main menu profile submenu sign-in  navigation link"
                                         className="main-menu-sub-level-text"
                      />

                    </NavLink>
                  </DropdownItem>
                  <DropdownItem>
                    <NavLink tag={RRDNavLink} to={"/register"}>
                      <FontAwesomeIcon icon="sign-in-alt" />
                      <FormattedMessage  id={"app.button.register"}
                                         defaultMessage="Inscription"
                                         description="Button - Register"
                                         className="main-menu-sub-level-text"
                      />
                    </NavLink>
                  </DropdownItem>

                </div>
              )}

              {user !== null && (
                <div>
                  <DropdownItem>
                    <NavLink tag={RRDNavLink} to={"/profile"}>
                      <FontAwesomeIcon icon="user-edit" />
                      <FormattedMessage  id={"app.button.profile"}
                                         defaultMessage="Profil"
                                         description="Button - Profile"
                                         className="main-menu-sub-level-text"
                      />
                    </NavLink>
                  </DropdownItem>
                  <DropdownItem>
                    <NavLink tag={RRDNavLink} to={"/profile/parameters"}>
                      <FontAwesomeIcon icon="user-cog" />
                      <FormattedMessage  id={"app.button.configuration"}
                                         defaultMessage="Configuration"
                                         description="Button - Configuration"
                                         className="main-menu-sub-level-text"
                      />
                    </NavLink>
                  </DropdownItem>

                </div>
              )}
                <DropdownItem>
                  <NavLink tag={RRDNavLink} to={"/"} onClick={this.logout}>
                    <FontAwesomeIcon icon="sign-out-alt" />
                    <FormattedMessage  id={"app.button.logout"}
                                       defaultMessage="Déconnexion"
                                       description="Button - Logout"
                                       className="main-menu-sub-level-text"
                    />
                  </NavLink>
                </DropdownItem>

            </DropdownMenu>
          </UncontrolledDropdown>
          { user !== null && user.roles.includes('ROLE_CUSTOMER') && (
            <Fragment>
              <NavItem>
                <NavLink tag={RRDNavLink} to={"/favorites"}>
                  <Tooltip placement={'top'} title={intl.formatMessage({
                    id:'app.button.favorite',
                    defaultMessage:"Favoris",
                    description:"Button - Favorite"
                  })}>
                    <IconButton color={'primary'}>
                      <GiGlassHeart />
                    </IconButton>
                  </Tooltip>
                </NavLink>
              </NavItem>

              <NavItem>
                <NavLink tag={RRDNavLink} to={"/shopping_cart"}>
                  <Tooltip placement={'top'} title={intl.formatMessage({
                    id:'app.button.shopping_cart',
                    defaultMessage:"Panier de commande",
                    description:"Button - shopping cart"
                  })}>
                    <IconButton color={'primary'}>
                      <TiShoppingCart />
                    </IconButton>
                  </Tooltip>
                </NavLink>
              </NavItem>
            </Fragment>
          )}
          <NavItem>
            <NavLink tag={RRDNavLink} to={"/chat"}>
              <Tooltip
                placement={'top'}
                title={intl.formatMessage({
                  id:'app.button.chat',
                  defaultMessage:"Chat",
                  description:"Button - Chat"
                })}
              >
                <IconButton color={'primary'}>
                  <SiWechat />
                </IconButton>
              </Tooltip>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={RRDNavLink} to={"/about_us"}>
              <Tooltip
                placement={'top'}
                title={intl.formatMessage({
                  id:'app.button.about_us',
                  defaultMessage:"A propos de nous",
                  description:"Button - About us"
                })}
              >
                <IconButton color={'primary'}>
                  <FcAbout />
                </IconButton>
              </Tooltip>
            </NavLink>
          </NavItem>

        </Nav>
      </Collapse>
    </Fragment>
  }
}

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout())
});

export default withRouter(connect(null, mapDispatchToProps)(injectIntl(MainMenu)));
