/**
 * Date: 23/06/20
 * Description: Sidebar left -  Menu
 */
import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import {Typography, withStyles, withTheme} from "@material-ui/core";
import { MenuCustomer } from "../components/customer";
import { MenuSupplier } from "../components/supplier";
import {Drawer, IconButton} from "@material-ui/core";
import {MdMenu} from "react-icons/md";
import {
  BiChevronLeft,
  BiChevronRightCircle
} from "react-icons/bi";
import {Link} from "react-router-dom";
import {orange} from "@material-ui/core/colors";

const drawerWidth = 240;
const styles = theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 20,
    marginRight: 20,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
    position: 'relative'
  },
  title: {
    display: 'none',
    color: orange[500],
    position: 'absolute',
    left: 16,
    "&:hover": {
      textDecoration: 'unset',
      color: orange[700]
    },
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  titleText: {
    fontFamily: 'Carter One, cursive',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
});

class DrawerLeftMenu extends Component
{
  static propTypes = {
    connectedUser: PropTypes.object,
    classes: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      loggingIn: false,
      drawerOpen: false,
    };
  }

  handleDrawerOpen = () => {
    this.setState(state => ({
      ...state,
      drawerOpen: true
    }));
  };

  handleDrawerClose = () => {
    this.setState(state => ({
      ...state,
      drawerOpen: false
    }));
  };

  showMenu = (connectedUser, user) => {
    let menu = null;
    switch (true){
      case (Object.keys(connectedUser).length !== 0 && user && user.roles.includes('ROLE_CUSTOMER')):
        menu = <MenuCustomer/>;
        break;
      case (Object.keys(connectedUser).length !== 0 && user && user.roles.includes('ROLE_SUPPLIER')):
        menu = <MenuSupplier/>;
        break;
      default:
        menu = <div/>;
        break;
    }

    return menu;
  };

  render()
  {
    const { connectedUser, classes, theme } = this.props;
    console.log('DrawerLeftMenu  render - connectedUser', connectedUser);
    console.log('DrawerLeftMenu  render - theme', theme);

    const user = localStorage.getItem('token') !== null ? JSON.parse(atob(localStorage.getItem('token').split('.')[1])): null;
    console.log('DrawerLeftMenu  render - user', user);
    return (
      <Fragment>
        <IconButton
          className={classes.menuButton}
          color="inherit"
          aria-label="Open drawer"
          onClick={this.handleDrawerOpen}
        >
          <MdMenu />
        </IconButton>
        <Drawer
          variant={'persistent'}
          anchor={'left'}
          open={this.state.drawerOpen}
          className={classes.drawer}
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <div className={classes.drawerHeader}>
            <Link  className={classes.title} to={'/'}>
              <Typography  className={classes.titleText} variant="h5" color="inherit" noWrap>
                {process.env.REACT_APP_NAME}
              </Typography>
            </Link>
            <IconButton onClick={this.handleDrawerClose}>
              {theme.direction === 'ltr' ? <BiChevronLeft/> : <BiChevronRightCircle/>}
            </IconButton>
          </div>
          {this.showMenu(connectedUser, user)}
        </Drawer>
    </Fragment>
    );
  }
}

const mapStateToProps = state => {
  const { login: connectedUser } = state.user.authentication;
  return { connectedUser };
}

export default connect(mapStateToProps, null)(withTheme(withStyles(styles)(DrawerLeftMenu)));
