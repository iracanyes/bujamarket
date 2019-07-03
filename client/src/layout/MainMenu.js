/**
 * Author: iracanyes
 * Date: 23/06/19
 * Description:
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from "react-intl";



class MainMenu extends Component
{
  constructor(props)
  {
    super(props);

    this.toggle = this.toggle.bind(this);
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

  render()
  {
    return <Fragment>

      <NavbarToggler onClick={this.toggle} />
      <Collapse isOpen={this.state.isOpen} navbar>
        <Nav className="ml-auto" navbar>
          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>

                <FontAwesomeIcon icon="user-alt" className="menu-top-l1"/>
                <FormattedMessage  id={"app.main_menu.profile.link"}
                                   defaultMessage="Profil"
                                   description="Main menu profil  navigation link"
                                   className="main-menu-top-level-text"
                />
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem>
                <NavLink tag={RRDNavLink} to={"/signin"}>
                  <FontAwesomeIcon icon="user-check" />
                  <FormattedMessage  id={"app.main_menu.profile.sub_menu.sign_in.link"}
                                     defaultMessage="Connexion"
                                     description="Main menu profile submenu sign-in  navigation link"
                                     className="main-menu-sub-level-text"
                  />

                </NavLink>
              </DropdownItem>
              <DropdownItem>
                <NavLink tag={RRDNavLink} to={"/register"}>
                  <FontAwesomeIcon icon="sign-in-alt" />
                  <FormattedMessage  id={"app.main_menu.profile.sub_menu.register.link"}
                                     defaultMessage="Inscription"
                                     description="Main menu profile submenu register  navigation link"
                                     className="main-menu-sub-level-text"
                  />
                </NavLink>
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem>
                <NavLink tag={RRDNavLink} to={"/register"}>
                  <FontAwesomeIcon icon="user-edit" />
                  <FormattedMessage  id={"app.main_menu.profile.sub_menu.profile.link"}
                                     defaultMessage="Profil"
                                     description="Main menu profile submenu profile  navigation link"
                                     className="main-menu-sub-level-text"
                  />
                </NavLink>
              </DropdownItem>
              <DropdownItem>
                <NavLink tag={RRDNavLink} to={"/profile/parameters"}>
                  <FontAwesomeIcon icon="user-cog" />
                  <FormattedMessage  id={"app.main_menu.profile.sub_menu.configuration.link"}
                                     defaultMessage="Configuration"
                                     description="Main menu profile submenu configuration navigation link"
                                     className="main-menu-sub-level-text"
                  />
                </NavLink>
              </DropdownItem>
              <DropdownItem>
                <NavLink tag={RRDNavLink} to={"/logout"}>
                  <FontAwesomeIcon icon="sign-out-alt" />
                  <FormattedMessage  id={"app.main_menu.profile.sub_menu.logout.link"}
                                     defaultMessage="Déconnexion"
                                     description="Main menu profile submenu logout navigation link"
                                     className="main-menu-sub-level-text"
                  />
                </NavLink>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          <NavItem>
            <NavLink tag={RRDNavLink} to={"/favorites/"}>
              <FontAwesomeIcon icon="heart" className="menu-top-l1" />
              <FormattedMessage  id={"app.main_menu.favorites.link"}
                                 defaultMessage="Favoris"
                                 description="Main menu favorite navigation link"
                                 className="main-menu-top-level-text"
              />
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={RRDNavLink} to={"/shopping_card"}>
              <FontAwesomeIcon icon="shopping-cart" className="menu-top-l1" />
              <FormattedMessage  id={"app.main_menu.shopping_card.link"}
                                 defaultMessage={"Panier de commande"}
                                 description="Main menu shopping card navigation link"
                                 className="main-menu-top-level-text"
              />
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={RRDNavLink} to={"/chat"}>
              <FontAwesomeIcon icon="comments" className="menu-top-l1" />
              <FormattedMessage  id={"app.main_menu.chat.link"}
                                 defaultMessage={"Chat"}
                                 description="Main menu Chat navigation link"
                                 className="main-menu-top-level-text"
              />
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={RRDNavLink} to={"/about_us"}>
              <FontAwesomeIcon icon="heart" className="menu-top-l1" />
              <FormattedMessage  id={"app.main_menu.about_us.link"}
                                 defaultMessage={"A propos de nous"}
                                 description="Main menu about us navigation link"
                                 className="main-menu-top-level-text"
              />
            </NavLink>
          </NavItem>

        </Nav>
      </Collapse>


    </Fragment>
  }
}


export default withRouter(connect()(MainMenu));
