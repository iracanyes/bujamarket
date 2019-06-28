/**
 * Author: iracanyes
 * Date: 23/06/19
 * Description:
 */
import React, { Component, Fragment } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink
} from 'reactstrap';

export default class MainMenu2 extends Component
{
    constructor(props)
    {
        super(props);

        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.state = {
            collapsed: false
        };
    }

    toggleNavbar()
    {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    render(){

        return (
            <div>
                <Navbar color={"faded"} light>
                    <NavbarBrand href={"/"} className={"mr-auto"}>MaDocIt</NavbarBrand>
                    <NavbarToggler onClick={this.toggleNavbar} className={"mr-2"}/>
                    <Collapse isOpen={this.state.collapse} navbar>
                        <Nav navbar>
                            <NavItem>
                                <NavLink href={"/homepage"}>Accueil</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href={"/docs"}>Documentation</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href={"/chats"}>Chatroom</NavLink>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Navbar>
            </div>
        );
    }
}


