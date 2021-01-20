/**
 * Author: iracanyes
 * Date: 23/06/20
 * Description: Sidebar left -  Menu for customers
 */
import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { withRouter, NavLink as RRDNavLink } from "react-router-dom";
import {FormattedMessage, injectIntl} from "react-intl";
import {
  Button,
  Navbar,
  NavLink,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem, CardImg
} from 'reactstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { logout } from "../../actions/user/login";
import {SpinnerLoading} from "../../layout/component/Spinner";
import { getProfileImage, reset } from "../../actions/image/profile";
import {MdRateReview} from "react-icons/all";

class SidebarLeftMenu extends Component
{
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      loggingIn: false
    };
  }

  componentDidMount() {

    if(this.props.retrievedImage === null)
      this.props.getProfileImage(this.props.history, this.props.location);

    this.props.loggingIn && this.setState({loggingIn: true});
  }

  componentWillUnmount() {
    this.props.reset(this.props.eventSource)
  }


  render()
  {
    const { retrievedImage, loading } = this.props;

    const user = localStorage.getItem('token') !== null ? JSON.parse(atob(localStorage.getItem('token').split(".")[1])) : null;

    return <Fragment>
      { user !== null  && (
        <Navbar dark color={"dark"} className={"bg-dark navbar-left"}>
          {/*- Menu - Avatar -*/}
          { retrievedImage && (
            <Button outline className={'py-3'}>
              <picture className={'d-flex mx-auto'}>
                { loading && <SpinnerLoading message={"Chargement de l'image de profil"} />}
                { retrievedImage && <CardImg src={ retrievedImage } alt={user.name} className={'img-thumbnail rounded-circle'} />}
              </picture>
              <div>{user.name}</div>
            </Button>
          )}
          {/*-- Menu - Profil --*/}
          <UncontrolledButtonDropdown>
            {/*-- Menu - profile --*/}
            <DropdownToggle outline className={'text-primary'} >
              <FontAwesomeIcon icon={"home"} className={"mr-2"}/>
              <FormattedMessage id={"app.button.profile"} />
            </DropdownToggle>
            <DropdownMenu className={'bg-dark text-secondary'}>
              <DropdownItem>
                <NavLink tag={RRDNavLink} to={{pathname: "/profile", state: { from : window.location.pathname }}}>
                  <FontAwesomeIcon icon={"id-card"}  className={"mr-2"}/>
                  <FormattedMessage id={"app.button.profile_information"} defaultMessage={"Informations de profil"} description={"Button - Profil informations"} />
                </NavLink>
              </DropdownItem>
              <DropdownItem divider></DropdownItem>
              <DropdownItem header>
                <FontAwesomeIcon icon={"users-cog"}  className={"mr-2"}/>
                <FormattedMessage id={"app.button.update_data"} defaultMessage={"Mise à jour des données"} description={"Button - Update data"}/>
              </DropdownItem>
              <DropdownItem divider></DropdownItem>
              <DropdownItem>
                <NavLink tag={RRDNavLink} to={{pathname: "/profile/addresses", state: { from : window.location.pathname }}}>
                  <FontAwesomeIcon icon={"house-user"}  className={"mr-2"}/>
                  <FormattedMessage id={"app.button.your_addresses"} defaultMessage={"Vos adresses"} description={"Button - Update addresses"}/>
                </NavLink>
              </DropdownItem>
              <DropdownItem>
                <NavLink tag={RRDNavLink} to={{pathname: "/profile/update", state: { from : window.location.pathname }}}>
                  <FontAwesomeIcon icon={"user-shield"}  className={"mr-2"}/>
                  <FormattedMessage id={"app.button.your_personal_information"} defaultMessage={"Vos informations personnelles"} description={"Button - Your personal information"}/>
                </NavLink>
              </DropdownItem>
              <DropdownItem>
                <NavLink tag={RRDNavLink} to={{pathname: "/profile/update_password", state: { from : window.location.pathname }}}>
                  <FontAwesomeIcon icon={"user-lock"}  className={"mr-2"}/>
                  <FormattedMessage id={"app.button.update_password"} defaultMessage={"Modifier le mot de passe"} description={"Button - Update password"}/>
                </NavLink>
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem>
                <NavLink tag={RRDNavLink} to={{pathname: "/unsubscribe", state: { from : this.props.location.pathname}}}>
                  <FontAwesomeIcon icon={"user-alt-slash"}  className={"mr-2"}/>
                  <FormattedMessage
                    id={"app.unsubscribe"}
                    defaultMessage={"Désinscription"}
                    description={'Button - Unsubscribe'}
                  />
                </NavLink>
              </DropdownItem>
              <DropdownItem>
                <NavLink tag={RRDNavLink} to={{pathname: "/logout"}}>
                  <FontAwesomeIcon icon={"sign-out-alt"}  className={"mr-2"}/>
                  <FormattedMessage
                    id={"app.button.logout"}
                    defaultMessage={"Dé-connexion"}
                  />
                </NavLink>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledButtonDropdown>
          {/*-- End Menu - Profil --*/}
          {/*-- Menu - orders --*/}
          <NavLink
            tag={RRDNavLink}
            to={{pathname: "/my_orders/", state: { from : window.location.pathname }}}
            className={'w-100 p-0'}
          >
            <Button className={'btn btn-outline-secondary w-100'}>
              <FontAwesomeIcon icon={"shopping-cart"} className={"mr-2"}/>
              <FormattedMessage id={"app.button.my_orders"} defaultMessage={"Mes commandes"} description={"Button - All orders"}/>
            </Button>
          </NavLink>
          {/*-- End Menu - orders --*/}
          {/*-- Menu - Shipper --*/}
          <NavLink
            tag={RRDNavLink}
            to={{pathname: "/shippers/", state: { from : window.location.pathname }}}
            className={'w-100 p-0'}
          >
            <Button className={'btn btn-outline-secondary w-100'}>
              <FontAwesomeIcon icon={"ship"} className={"mr-2"} />
              <FormattedMessage id={"app.button.shippers"} defaultMessage={"Expéditeurs"} description={"Button - Shippers"}/>
            </Button>
          </NavLink>
          {/*-- End Menu - Shipper --*/}
          {/*-- Menu - Comment --*/}
          <NavLink
            tag={RRDNavLink}
            to={{pathname: "/my_comments/", state: { from : window.location.pathname }}}
            className={'w-100 p-0'}
          >
            <Button className={'btn btn-outline-secondary w-100'}>
              <MdRateReview  className={"mr-2"}/>
              <FormattedMessage id={"app.comments"} />
            </Button>
          </NavLink>
          {/*-- End Menu - Comment --*/}
          {/*-- Menu - Chat --*/}
          <UncontrolledButtonDropdown>
            <DropdownToggle outline className={'text-primary'}>
              <FontAwesomeIcon icon={"comments"} className={"mr-2"}/>
              <FormattedMessage
                id={"app.chat"}
                defaultMessage={"Chat"}
                description={"App - Chat"}
              />
            </DropdownToggle>
            <DropdownMenu className={'bg-dark text-secondary'} >
              <DropdownItem>
                <NavLink tag={RRDNavLink} to={{pathname: "/chat/admin", state: { from : window.location.pathname }}}>
                  <FontAwesomeIcon icon={"comments"} className={"mr-2"} />
                  <FormattedMessage
                    id={"app.admin.chat"}
                    defaultMessage={"Chat administrateur"}
                    description={"App - platform administrator chat"}
                  />
                </NavLink>
              </DropdownItem>
              <DropdownItem>
                <NavLink tag={RRDNavLink} to={{pathname: "/chat/customers", state: { from : window.location.pathname }}}>
                  <FontAwesomeIcon icon={"comments"} className={"mr-2"} />
                  <FormattedMessage
                    id={"app.customer.chat"}
                    defaultMessage={"Chat client"}
                    description={"App - customers' chat"}
                  />
                </NavLink>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledButtonDropdown>
          {/*-- End Menu - Chat --*/}
        </Navbar>
      )}
    </Fragment>;
  }
}

const mapStateToProps = state => {
  const { retrieved, loading, error, eventSource } = state.image.profile;
  const { user, loggedIn, loggingIn } = state.user.authentication;
  return { retrievedImage: retrieved, loading, error, eventSource, user, loggedIn, loggingIn };
};

const mapDispatchToProps = dispatch => ({
  getProfileImage: (history, location) => dispatch(getProfileImage(history, location)),
  logout: () => dispatch(logout()),
  reset: eventSource => dispatch(reset(eventSource))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(injectIntl(SidebarLeftMenu)));
