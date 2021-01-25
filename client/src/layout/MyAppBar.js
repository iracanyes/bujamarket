/**
 * Author: iracanyes
 * Description: Application Navigation to bar
 */
import React from 'react';
import PropTypes from 'prop-types';
import {
  AppBar,
  Badge,
  Menu,
  MenuItem,
  Toolbar,
  IconButton,
  Typography,
  Tooltip,
  Button
} from "@material-ui/core";
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import {
  MdAccountCircle,
  MdMailOutline,
  MdNotifications,
  MdMoreVert
} from "react-icons/md";
import {
  AiOutlineLogin
} from "react-icons/ai";
import {
  RiUserSettingsFill,
  RiUserFollowFill,
  RiUserSearchFill,
  RiLogoutCircleRLine
} from "react-icons/ri";
import { injectIntl, FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import MainMenuSearchForm from "../components/search/MainMenuSearchForm";
import DrawerLeftMenu from "./DrawerLeftMenu";
import { list, reset } from "../actions/favorite/list";
import {logout} from "../actions/user/login";
import {GiCrownedHeart, TiShoppingCart} from "react-icons/all";
import { orange } from "@material-ui/core/colors";
import {ButtonLink} from "./component/ButtonLink";

const styles = theme => ({
  root: {
    width: '100%',
  },
  appBar: {
    backgroundColor: orange[500]
  },
  grow: {
    flexGrow: 1,
  },
  hide: {
    display: 'none',
  },
  menuButton: {
    marginLeft: 20,
    marginRight: 20,
  },
  title: {
    fontFamily: 'Carter One, cursive',
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(9),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing(),
    paddingRight: theme.spacing(),
    paddingBottom: theme.spacing(),
    paddingLeft: theme.spacing(10),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  subMenuRight: {
    "& .MuiMenu-paper": {
      top: 64,
      right: 16,
      backgroundColor: orange[500]
    },
    "& .MuiMenu-list": {
      padding: 0
    }
  },
  subMenuContent: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: orange[500],
  },
  menuLink: {
    fontFamily: 'Montserrat',
    color: "white",
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    "&:hover":{
      color: "white",
      textDecoration: 'none'
    }
  }
});

class MyAppBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      mobileMoreAnchorEl: null,
      drawerOpen: false,
    };
  }


  handleProfileMenuOpen = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
    this.handleMobileMenuClose();
  };

  handleMobileMenuOpen = event => {
    this.setState({ mobileMoreAnchorEl: event.currentTarget });
  };

  handleMobileMenuClose = () => {
    this.setState({ mobileMoreAnchorEl: null });
  };

  handleDrawerOpen = () => {
    this.setState(state => ({ ...state, drawerOpen: true}));
  };

  handleDrawerClose = () => {
    this.setState(state => ({ ...state, drawerOpen: true}));
  };

  render() {
    const { anchorEl, mobileMoreAnchorEl } = this.state;
    const { classes, intl, user } = this.props;
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const connectedUser = localStorage.getItem('token') !== null ? JSON.parse(atob(localStorage.getItem('token').split(".")[1])) : null;
    const nbShoppingCart = localStorage.getItem('shopping_cart') !== null ? JSON.parse(localStorage.getItem('shopping_cart')).length : 0;

    const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        className={classes.subMenuRight}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
      >
        {!connectedUser && (
          <div className={classes.subMenuContent}>
            <MenuItem onClick={this.handleMenuClose}>
              <Link
                to={'../../login'}
                component={ButtonLink}
                className={classes.menuLink}
                startIcon={<AiOutlineLogin className={'mx-auto'}/>}
              >
                <FormattedMessage
                  id={'app.page.user.login.title'}
                  defaultMessage={'Connexion'}
                />

              </Link>
            </MenuItem>
            <MenuItem onClick={this.handleMenuClose}>
              <Link
                to={'../../register'}
                component={ButtonLink}
                className={classes.menuLink}
                startIcon={<RiUserFollowFill/>}
              >
                <FormattedMessage
                  id={'app.page.user.register.title'}
                  defaultMessage={'Inscription'}
                />
              </Link>
            </MenuItem>
          </div>
        )}
        {connectedUser &&  (
          <div className={classes.subMenuContent}>
            <MenuItem onClick={this.handleMenuClose}>
              <Link
                to={'../../my_account'}
                component={ButtonLink}
                className={classes.menuLink}
                startIcon={<RiUserSearchFill/>}
              >
                <FormattedMessage
                  id={"app.my_account"}
                  defaultMessage={"Mon compte"}
                />
              </Link>
            </MenuItem>
            <MenuItem onClick={this.handleMenuClose}>
              <Link
                to={'../../profile'}
                component={ButtonLink}
                startIcon={<RiUserSettingsFill/>}
                className={classes.menuLink}
              >
                <FormattedMessage
                  id={"app.button.profile"}
                  defaultMessage={"Profil"}
                />
              </Link>
            </MenuItem>
            <MenuItem onClick={this.handleMenuClose}>
              <Button
                onClick={() => this.props.logout()}
                startIcon={<RiLogoutCircleRLine/>}
                className={classes.menuLink}
              >
                <FormattedMessage
                  id={"app.button.logout"}
                  defaultMessage={"Déconnexion"}
                />
              </Button>
            </MenuItem>
          </div>
        )}

      </Menu>
    );

    const renderMobileMenu = (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={isMobileMenuOpen}
        onClose={this.handleMenuClose}
      >
        {connectedUser && connectedUser.roles.includes('ROLE_CUSTOMER') && (
          <MenuItem onClick={this.handleMobileMenuClose}>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <TiShoppingCart />
              </Badge>
            </IconButton>
            <FormattedMessage
              id={"app.button.shopping_cart"}
              defaultMessage={"Panier de commande"}
              description={"App - Shopping cart"}
            />
          </MenuItem>
        )}
        {connectedUser && connectedUser.roles.includes('ROLE_CUSTOMER') && (
          <MenuItem onClick={this.handleMobileMenuClose}>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <GiCrownedHeart />
              </Badge>
            </IconButton>
            <FormattedMessage
              id={"app.button.favorite"}
              defaultMessage={"Favoris"}
              description={"App - Favorite"}
            />
          </MenuItem>
        )}
        <MenuItem onClick={this.handleMobileMenuClose}>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <MdMailOutline />
            </Badge>
          </IconButton>
          <FormattedMessage
            id={"app.messages"}
            defaultMessage={"Messages"}
            description={"App - Messages"}
          />
        </MenuItem>
        <MenuItem onClick={this.handleMobileMenuClose}>
          <IconButton color="inherit">
            <Badge badgeContent={11} color="secondary">
              <MdNotifications />
            </Badge>
          </IconButton>
          <FormattedMessage
            id={"app.notifications"}
            defaultMessage={"Notifications"}
            description={"App - Messages"}
          />
        </MenuItem>
        <MenuItem onClick={this.handleProfileMenuOpen}>
          <IconButton color="inherit">
            <MdAccountCircle />
          </IconButton>
          <p>Profile</p>
        </MenuItem>
      </Menu>
    );

    return (
      <div className={classes.root}>
        <AppBar className={classes.appBar} position="fixed">
          <Toolbar>
            <Link className={'appbar-title'} to={'/'}>
              <Typography className={classes.title} variant="h5" color="inherit" noWrap>
                {process.env.REACT_APP_NAME}
              </Typography>
            </Link>
            <DrawerLeftMenu />
            <div className={classes.grow} />
            <MainMenuSearchForm onSearch={this.props.onSearch}/>
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              {connectedUser && connectedUser.roles.includes('ROLE_CUSTOMER') && (
                <Tooltip title={intl.formatMessage({
                  id: "app.button.shopping_cart",
                  defaultMessage: "Panier de commande",
                  description: 'App - Shopping cart'
                })}>
                  <Link
                    to={"../../shopping_cart"}
                    className={classes.menuLink}
                  >
                    <IconButton color="inherit">
                      <Badge badgeContent={nbShoppingCart} color="secondary">
                        <TiShoppingCart />
                      </Badge>
                    </IconButton>
                  </Link>
                </Tooltip>
              )}
              {(user || connectedUser && connectedUser.roles.includes('ROLE_CUSTOMER')) && (
                <Tooltip
                  title={intl.formatMessage({
                    id: "app.button.favorite",
                    defaultMessage: "Favoris"
                  })}
                >
                  <Link
                    to={"../../favorites"}
                    className={classes.menuLink}
                  >
                    <IconButton color="inherit">
                      <Badge badgeContent={null} color="secondary">
                        <GiCrownedHeart />
                      </Badge>
                    </IconButton>
                  </Link>
                </Tooltip>
              )}
              <Tooltip
                title={intl.formatMessage({
                  id: 'app.messages',
                  defaultMessage: 'Messages',
                  description: 'App - Messages'
                })}
              >
                <IconButton color="inherit">
                  <Badge badgeContent={4} color="secondary">
                    <MdMailOutline />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Tooltip
                title={intl.formatMessage({
                  id: 'app.notification',
                  defaultMessage: 'Notification',
                  description: 'App - Notification'
                })}
              >
                <IconButton color="inherit">
                  <Badge badgeContent={17} color="secondary">
                    <MdNotifications />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Tooltip
                title={intl.formatMessage({
                  id: "app.button.profile",
                  defaultMessage: "Profil"
                })}
              >
                <IconButton
                  aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                  aria-haspopup="true"
                  onClick={this.handleProfileMenuOpen}
                  color="inherit"
                >
                  <MdAccountCircle />
                </IconButton>
              </Tooltip>

            </div>
            <div className={classes.sectionMobile}>
              <IconButton aria-haspopup="true" onClick={this.handleMobileMenuOpen} color="inherit">
                <MdMoreVert />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {renderMenu}
        {renderMobileMenu}
      </div>
    );
  }
}

MyAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
  list: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  eventSource: PropTypes.instanceOf(EventSource),
  retrieved: PropTypes.object,
  logout: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  const { user } = state.user.authentication;
  const { retrieved, eventSource } = state.favorite.list;
  return { user, retrieved, eventSource };
};
const mapDispatchToProps = dispatch => ({
  list: (page,history, location) => dispatch(list(page, history, location)),
  reset: (eventSource) => dispatch(reset(eventSource)),
  logout: () => dispatch(logout())
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withStyles(styles)(MyAppBar)));
