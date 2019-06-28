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
  DropdownItem,
  Button,
  Form,
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import ReactDOM from "react-dom";
import {Switch} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from "react-intl";
import SearchForm from '../components/page/SearchForm';


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
      <Navbar color={"bg-primary"} dark expand={"lg"}   id="navbar-primary" className="navbar navbar-expand-lg navbar-dark bg-primary">
        {/* Navbar brand*/}
        <NavbarBrand href="/" className="col-lg-2">Buja Market</NavbarBrand>

        {/*
        <SearchForm/>
        */}

        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                <FontAwesomeIcon icon="user-alt" className="menu-top-l1"/>
                <FormattedMessage  id={"app.main_menu.profile.title"}
                                   defaultMessage="Profil"
                                   description="Main menu profil button text"
                />

              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem>
                  <NavLink href="/login">
                    <FontAwesomeIcon icon="user-check" />
                    <FormattedMessage  id={"app.main_menu.profile.sub_menu.sign_in.title"}
                                       defaultMessage="Connexion"
                                       description="Main menu profile submenu sign-in button text"
                    />

                  </NavLink>
                </DropdownItem>
                <DropdownItem>
                  <NavLink href='/signin'>
                    <FontAwesomeIcon icon="sign-in-alt" />
                    <FormattedMessage  id={"app.main_menu.profile.sub_menu.sign_in.title"}
                                       defaultMessage="Inscription"
                                       description="Main menu profile submenu register button text"
                    />
                  </NavLink>
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem>
                  <NavLink href="/profile">
                    <FontAwesomeIcon icon="user-edit" />
                    <FormattedMessage  id={"app.main_menu.profile.sub_menu.profiletitle"}
                                       defaultMessage="Profil"
                                       description="Main menu profile submenu profile button text"
                    />
                  </NavLink>
                </DropdownItem>
                <DropdownItem>
                  <NavLink href="/profile">
                    <FontAwesomeIcon icon="user-cog" />
                    Configuration
                  </NavLink>
                </DropdownItem>
                <DropdownItem>
                  <NavLink href="/logout">
                    <FontAwesomeIcon icon="sign-out-alt" />
                    Logout
                  </NavLink>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            <NavItem>
              <NavLink href="/favorites">
                <FontAwesomeIcon icon="heart" className="menu-top-l1" />
                Favorites
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/favorites">
                <FontAwesomeIcon icon="shopping-cart" className="menu-top-l1" />
                Shopping cart
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/chat">
                <FontAwesomeIcon icon="comments" className="menu-top-l1" />
                Chat
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/apropos">
                <FontAwesomeIcon icon="heart" className="menu-top-l1" />
                A propos
              </NavLink>
            </NavItem>

          </Nav>
        </Collapse>
        {/*
                <a className="navbar-brand col-lg-2" href="#">MaDocIT</a>

                <button className="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarMainDropdown" aria-controls="navbarMainDropdown" aria-expanded="false"
                        aria-label="Menu principal">
                    <span className="navbar-toggler-icon"></span>
                </button>
                */}
        {/*
                <div className="col-lg-7 collapse navbar-collapse" id="navbarMainDropdown">
                    <ul className="navbar-nav">
                        <li className="nav-item active">
                            <a className="nav-link" href={"homepage"} onClick={()=> this.props.push("/home")}><i className="fa fa-fw fa-home"></i>Accueil<span
                                className="sr-only">(current)</span></a>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="documentation"
                               id="navbarDropdownMenuLink2" data-toggle="dropdown" aria-haspopup="true"
                               aria-expanded="false">
                                <i className="fas fa-layer-group"></i>Documentation
                            </a>
                            <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink2">
                                <a className="dropdown-item" href="categories" onClick={()=> this.props.push('/categories') }>Catégories</a>
                                <a className="dropdown-item" href="themes" onClick={()=> this.props.push('/themes') }>Thèmes</a>
                                <a className="dropdown-item" href="videos" onClick={()=> this.props.push('/videos') }>Videos</a>
                            </div>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="chat" onClick={()=> this.props.push('/chat')}><i className="far fa-comments"></i>Chat</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="contact" onClick={() => this.props.push('/apropos')}><i className="fas fa-at"></i>A propos</a>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="documentation.html"
                               id="navbarDropdownMenuProfileMain" data-toggle="dropdown" aria-haspopup="true"
                               aria-expanded="false">
                                <i className="fas fa-user"></i>Membre
                            </a>
                            <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuProfileMain">
                                <a className="dropdown-item" href="login.html" onClick={() => this.props.push('/login')}>Connexion</a>
                                <a className="dropdown-item" href="profile.html" onClick={()=> this.props.push('/profile')}>Profile</a>
                                <a className="dropdown-item" href="article.html" onClick={() => this.props.push('/logout')}>Déconnexion</a>
                            </div>
                        </li>
                    </ul>
                </div>
                */}

      </Navbar>
    </Fragment>
  }
}

const mapStateToProps = state => ({
  search: state.router.location.search
});

ReactDOM.render(
  <MainMenu/>,
  document.getElementsByTagName("header")[0]
);


export default connect(mapStateToProps)(MainMenu);
