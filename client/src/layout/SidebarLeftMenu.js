/**
 * Author: iracanyes
 * Date: 23/06/19
 * Description: Sidebar Menu
 */
import React, { Component, Fragment } from 'react';
import {
    Nav,
    NavLink,
    UncontrolledDropdown,
    DropdownMenu,
    DropdownToggle,
    DropdownItem
} from 'reactstrap';

export default class SidebarLeftMenu extends Component
{
    render()
    {

        return <Fragment>
            <div className="menu">
                <Nav vertical>
                    <UncontrolledDropdown nav inNavbar>
                        <DropdownToggle nav caret >
                            <span style={{fontSize: "14px", color: "Dodgerblue"}}>
                              <i className="fas fa-user-circle"></i>
                            </span>
                            Profile
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem >
                                <span style={{fontSize: "14px", color: "Dodgerblue"}}>
                                  <i className="fas fa-sign-in-alt"></i>
                                </span>
                                Login
                            </DropdownItem>
                            <DropdownItem>
                                <span style={{fontSize: "14px", color: "Dodgerblue"}}>
                                  <i className="fas fa-sign-in-alt"></i>
                                </span>
                                Sign/out
                            </DropdownItem>
                            <DropdownItem divider/>
                            <DropdownItem>
                                <span style={{fontSize: "14px", color: "Dodgerblue"}}>
                                  <i className="fas fa-id-card"></i>
                                </span>
                                Activité
                            </DropdownItem>
                            <DropdownItem>

                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                    <UncontrolledDropdown nav inNavbar>
                        <DropdownToggle nav caret >
                            <span style={{fontSize: "14px", color: "Dodgerblue"}}>
                              <i className="fas fa-edit"></i>
                            </span>
                            Documentation
                        </DropdownToggle>
                        <DropdownMenu>
                            <ul>
                                <UncontrolledDropdown nav inNavbar>
                                    <DropdownToggle nav caret >
                                        Profile
                                    </DropdownToggle>
                                    <DropdownMenu right>
                                        <DropdownItem>
                                            Login
                                        </DropdownItem>
                                        <DropdownItem>
                                            Sign/out
                                        </DropdownItem>
                                        <DropdownItem divider/>
                                        <DropdownItem>
                                            Activité
                                        </DropdownItem>
                                        <DropdownItem>

                                        </DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                                <DropdownItem>
                                    <NavLink href={"#"} >Créer</NavLink>
                                </DropdownItem>
                                <DropdownItem>
                                    <NavLink href={"#"}>Mettre à jour</NavLink>
                                </DropdownItem>
                                <DropdownItem divider/>
                                <DropdownItem>
                                    <NavLink href={"#"} >Vos publications</NavLink>
                                </DropdownItem>
                                <DropdownItem>
                                    <NavLink href={"#"}>Supprimer</NavLink>
                                </DropdownItem>
                            </ul>

                        </DropdownMenu>
                    </UncontrolledDropdown>
                </Nav>
                {/*
                <ul className="nav flex-column">
                    <li className="nav-item">
                        <a className="nav-link active" href="documentation.html"><i className="fa fa-fw fa-home"></i>Documentation</a>
                    </li>
                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" href="#" id="subNavbarDropdownCategory" role="button"
                           data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i className="fas fa-boxes"></i>Catégories
                        </a>
                        <div className="dropdown-menu" aria-labelledby="subNavbarDropdownCategory">
                            <a className="dropdown-item" href="#">Action</a>
                            <a className="dropdown-item" href="#">Another action</a>
                            <a className="dropdown-item" href="#">Something else here</a>
                        </div>
                    </li>
                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" href="#" id="subNavbarDropdownTheme" role="button"
                           data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Thèmes
                        </a>
                        <div className="dropdown-menu" aria-labelledby="subNavbarDropdownTheme">
                            <a className="dropdown-item" href="#">Action</a>
                            <a className="dropdown-item" href="#">Another action</a>
                            <a className="dropdown-item" href="#">Something else here</a>
                        </div>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">Link</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link disabled" href="#">Disabled</a>
                    </li>
                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" href="#" id="subNavbarDropdownSubCategory" role="button"
                           data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Catégories
                        </a>
                        <div className="dropdown-menu" aria-labelledby="subNavbarDropdownSubCategory">
                            <a className="dropdown-item" href="#">Action</a>
                            <a className="dropdown-item" href="#">Another action</a>
                            <a className="dropdown-item" href="#">Something else here</a>
                        </div>
                    </li>
                </ul>
                */}
            </div>
        </Fragment>
    }
}

