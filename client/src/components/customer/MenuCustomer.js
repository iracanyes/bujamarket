/**
 * Author: iracanyes
 * Date: 23/06/20
 * Description: Sidebar left -  Menu for customers
 */
import React, { Component, Fragment, useState } from 'react';
import { connect } from "react-redux";
import { withRouter, NavLink } from "react-router-dom";
import {FormattedMessage, injectIntl} from "react-intl";
import { logout } from "../../actions/user/login";
import { getProfileImage, reset } from "../../actions/image/profile";
import clsx from 'clsx';
import {
  FaIdCard,
  BsCloudDownload,
  MdRateReview,
  BiBuildingHouse,
  FaUserShield,
  FaUserCog,
  FaUserLock,
  FaUserAltSlash,
  FaSignOutAlt,
  FaShoppingCart,
  FaShip, FaComments, RiChatPrivateLine, BiChevronDown, BiChevronRight, FaCommentDollar, FaCommentsDollar
} from "react-icons/all";
import {
  Avatar,
  CircularProgress,
  Fab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  ListSubheader, IconButton,
} from "@material-ui/core";
import {  withStyles, withTheme } from "@material-ui/core/styles";
import { orange, amber } from "@material-ui/core/colors";
import {dark} from "@material-ui/core/styles/createPalette";
import {BiChevronLeft, BiChevronRightCircle} from "react-icons/bi";

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  menuLink: {
    textDecoration: 'unset',
    display: 'flex',
    flexDirection: 'row',
    color: dark[500],
    "&:hover": {
      textDecoration: 'unset'
    }
  },
  menuIcon: {
    fontSize: '1.6rem',
    minWidth: 'unset',
    color: orange[700]
  },
  menuItemText: {
    display: 'flex',
    color: 'black',
    alignItems: 'center',
    marginLeft: theme.spacing(1),
    "& span.MuiTypography-body1": {
      fontFamily: 'Nunito',
      fontSize: '1rem'
    },
    "& h6.MuiTypography-h6": {
      fontFamily: 'Nunito',
    }
  },
  menuSubItemText: {
    display: 'flex',
    color: 'black',
    alignItems: 'center',
    marginLeft: theme.spacing(1),
    "& span.MuiTypography-body1": {
      fontFamily: 'Nunito',
      fontSize: '0.9rem'
    }

  },
  menuCollapse: {
    paddingLeft: theme.spacing(1)
  },
  circularProgressRoot: {
    display: 'inline-flex',
    alignItems: 'center',
    paddingLeft: 0.25
  },
  circularProgressWrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonAvatar: {
    backgroundColor: orange[500],
    "&:hover": {
      backgroundColor: orange[700]
    }
  },
  fabProgress: {
    color: orange[500],
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  buttonProgress: {
    color:orange[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
});

class MenuCustomer extends Component
{
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      loggingIn: false
    };

    this.toggleOpen = this.toggleOpen.bind(this);
  }

  componentDidMount() {

    if(this.props.retrievedImage === null)
      this.props.getProfileImage(this.props.history, this.props.location);

    this.props.loggingIn && this.setState({loggingIn: true});
  }

  componentWillUnmount() {
    this.props.reset(this.props.eventSource)
  }

  toggleOpen = (listItem) => {
    this.setState(state => ({
      ...state,
      open: state.open === listItem ? "0" : listItem
    }));
  }

  render() {
    const { open } = this.state;
    const { classes, retrievedImage, loading } = this.props;

    console.log('MenuCustomer - classes', classes);

    const user = localStorage.getItem('token') !== null ? JSON.parse(atob(localStorage.getItem('token').split(".")[1])) : null;

    const buttonClassname = clsx({
      [classes.buttonAvatar]: retrievedImage,
    });

    return (
      <Fragment>
        <List
          component={'nav'}
          aria-labelledby={'nested-list-subheader'}
          subheader={
            <ListSubheader>
              <Typography
                variant={'subtitle1'}
                id={'nested-list-subheader'}
              >
                <FormattedMessage
                  id={'app.menu.customer'}
                  defaultMessage={'Menu Client'}
                  description={'Menu - Customers'}
                />
              </Typography>
            </ListSubheader>
          }
          className={classes.root}
        >
          <ListItem
            button
            className={classes.circularProgressRoot}
            onClick={() => this.toggleOpen('1')}
          >
            <div className={'d-flex flex-row w-100'}>
              <ListItemAvatar className={classes.circularProgressWrapper}>
                <Fab
                  aria-label={'profile'}
                  className={buttonClassname}
                >
                  {/*retrievedImage ? <Avatar alt={user.name} src={retrievedImage} /> : <BsCloudDownload/>*/}
                  {retrievedImage ? <Avatar alt={user.name} src={retrievedImage} /> : <BsCloudDownload/>}
                </Fab>
                {true && <CircularProgress size={56} color={'secondary'} className={classes.fabProgress}/>}
              </ListItemAvatar>
              <ListItemText className={classes.menuItemText}>
                <Typography variant={"h6"} className={classes.itemTextTypography}>
                  <FormattedMessage id={"app.button.profile"} />
                </Typography>
              </ListItemText>
              <IconButton>
                {this.state.open === '1' ? <BiChevronDown/> : <BiChevronRight/>}
              </IconButton>
            </div>

          </ListItem>
          <Collapse in={open === "1"} timeout={'auto'} unmountOnExit className={classes.menuCollapse}>
            <List component={'div'} disablePadding>
              <ListItem button>
                <NavLink
                  to={{pathname: "/profile", state: { from : window.location.pathname }}}
                  className={classes.menuLink}
                >
                  <ListItemIcon className={classes.menuIcon}>
                    <FaIdCard/>
                  </ListItemIcon>
                  <ListItemText className={classes.menuSubItemText}>
                    <FormattedMessage id={"app.button.profile_information"} defaultMessage={"Informations de profil"} description={"Button - Profil informations"} />
                  </ListItemText>
                </NavLink>
              </ListItem>
              <ListItem button>
                <NavLink
                  to={{pathname: "/profile/addresses", state: { from : window.location.pathname }}}
                  className={classes.menuLink}
                >
                  <ListItemIcon className={classes.menuIcon}>
                    <BiBuildingHouse/>
                  </ListItemIcon>
                  <ListItemText className={classes.menuSubItemText}>
                    <FormattedMessage id={"app.button.your_addresses"} defaultMessage={"Vos adresses"} description={"Button - Update data"} />
                  </ListItemText>
                </NavLink>
              </ListItem>
              <ListItem button>
                <NavLink
                  to={{pathname: "/profile/update", state: { from : window.location.pathname }}}
                  className={classes.menuLink}
                >
                  <ListItemIcon className={classes.menuIcon}>
                    <FaUserCog/>
                  </ListItemIcon>
                  <ListItemText className={classes.menuSubItemText}>
                    <FormattedMessage id={"app.button.your_personal_information"} defaultMessage={"Vos informations personnelles"} description={"Button - Your personal information"} />
                  </ListItemText>
                </NavLink>
              </ListItem>
              <ListItem button>
                <NavLink
                  to={{pathname: "/profile/update_password", state: { from : window.location.pathname }}}
                  className={classes.menuLink}
                >
                  <ListItemIcon className={classes.menuIcon}>
                    <FaUserLock/>
                  </ListItemIcon>
                  <ListItemText className={classes.menuSubItemText}>
                    <FormattedMessage id={"app.button.update_password"} defaultMessage={"Modifier le mot de passe"} description={"Button - Update password"} />
                  </ListItemText>
                </NavLink>
              </ListItem>
              <ListItem button>
                <NavLink
                  to={{pathname: "/unsubscribe", state: { from : window.location.pathname }}}
                  className={classes.menuLink}
                >
                  <ListItemIcon className={classes.menuIcon}>
                    <FaUserAltSlash/>
                  </ListItemIcon>
                  <ListItemText className={classes.menuSubItemText}>
                    <FormattedMessage id={"app.unsubscribe"} defaultMessage={"Désinscription"} description={"Button - Unsubscribe"} />
                  </ListItemText>
                </NavLink>
              </ListItem>
              <ListItem button>
                <NavLink
                  to={{pathname: "/logout", state: { from : window.location.pathname }}}
                  className={classes.menuLink}
                >
                  <ListItemIcon className={classes.menuIcon}>
                    <FaSignOutAlt/>
                  </ListItemIcon>
                  <ListItemText className={classes.menuSubItemText}>
                    <FormattedMessage id={"app.button.logout"} defaultMessage={"Déconnexion"} description={"Button - Logout"} />
                  </ListItemText>
                </NavLink>
              </ListItem>
            </List>
          </Collapse>
          <ListItem button>
            <NavLink
              to={{pathname: "/my_orders/", state: { from : window.location.pathname }}}
              className={classes.menuLink}
            >
              <ListItemIcon className={classes.menuIcon}>
                <FaShoppingCart/>
              </ListItemIcon>
              <ListItemText className={classes.menuItemText}>
                <FormattedMessage id={"app.button.my_orders"} defaultMessage={"Mes commandes"} description={"Button - All orders"} />
              </ListItemText>
            </NavLink>
          </ListItem>
          <ListItem button>
            <NavLink
              to={{pathname: "/shippers/", state: { from : window.location.pathname }}}
              className={classes.menuLink}
            >
              <ListItemIcon className={classes.menuIcon}>
                <FaShip/>
              </ListItemIcon>
              <ListItemText className={classes.menuItemText}>
                <FormattedMessage id={"app.button.shippers"} defaultMessage={"Expéditeurs"} description={"Button - Shippers"} />
              </ListItemText>
            </NavLink>
          </ListItem>
          <ListItem button>
            <NavLink
              to={{pathname: "/my_comments/", state: { from : window.location.pathname }}}
              className={classes.menuLink}
            >
              <ListItemIcon className={classes.menuIcon}>
                <FaCommentsDollar/>
              </ListItemIcon>
              <ListItemText className={classes.menuItemText}>
                <FormattedMessage id={"app.comments"} defaultMessage={"Commentaires"} description={"Button - Comments"} />
              </ListItemText>
            </NavLink>
          </ListItem>
          <ListItem button onClick={() => this.toggleOpen('2')}>
            <ListItemIcon className={classes.menuIcon}>
              <FaComments/>
            </ListItemIcon>
            <ListItemText className={classes.menuItemText}>
              <FormattedMessage id={"app.chat"} defaultMessage={"Chat"} description={"App - Chat"} />
            </ListItemText>
            <IconButton>
              {this.state.open === '2' ? <BiChevronDown/> : <BiChevronRight/>}
            </IconButton>
          </ListItem>
          <Collapse in={open === "2"} timeout={'auto'} unmountOnExit className={classes.menuCollapse}>
            <List component={'div'} disablePadding>
              <ListItem button>
                <NavLink
                  to={{pathname: "/chat/admin", state: { from : window.location.pathname }}}
                  className={classes.menuLink}
                >
                  <ListItemIcon className={classes.menuIcon}>
                    <RiChatPrivateLine/>
                  </ListItemIcon>
                  <ListItemText className={classes.menuSubItemText}>
                    <FormattedMessage id={"app.chat.admin"} defaultMessage={"Chat administrateur"} description={"Button -  administrator chat"} />
                  </ListItemText>
                </NavLink>
              </ListItem>
              <ListItem button>
                <NavLink
                  to={{pathname: "/chat/suppliers", state: { from : window.location.pathname }}}
                  className={classes.menuLink}
                >
                  <ListItemIcon className={classes.menuIcon}>
                    <BiBuildingHouse/>
                  </ListItemIcon>
                  <ListItemText className={classes.menuSubItemText}>
                    <FormattedMessage id={"app.chat.customer"} defaultMessage={"Chat fournisseur"} description={"Button - customers' chat"} />
                  </ListItemText>
                </NavLink>
              </ListItem>
            </List>
          </Collapse>
        </List>
      </Fragment>
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withRouter(withStyles(styles, {withTheme: true})(MenuCustomer))));
