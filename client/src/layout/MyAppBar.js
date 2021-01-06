import React from 'react';
import PropTypes from 'prop-types';
import {
  AppBar,
  Badge,
  Drawer,
  Menu,
  MenuItem,
  Toolbar,
  IconButton,
  Typography
} from "@material-ui/core";
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import {
  MdAccountCircle,
  MdMailOutline,
  MdNotifications,
  MdMenu,
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
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import MainMenuSearchForm from "../components/search/MainMenuSearchForm";
import DrawerLeftMenu from "./DrawerLeftMenu";

const styles = theme => ({
  root: {
    width: '100%',
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
    const { classes } = this.props;
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        className={'menu-left-submenu'}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
      >
        <MenuItem onClick={this.handleMenuClose}>
          <Link to={'login'}>
            <AiOutlineLogin className={'mx-auto'}/>
            <FormattedMessage
              id={'app.page.user.login.title'}
              defaultMessage={'Connexion'}
            />

          </Link>
        </MenuItem>
        <MenuItem onClick={this.handleMenuClose}>
          <Link to={'register'}>
            <RiUserFollowFill className={'mx-auto'}/>
            <FormattedMessage
              id={'app.page.user.register.title'}
              defaultMessage={'Inscription'}
            />
          </Link>
        </MenuItem>
        <MenuItem onClick={this.handleMenuClose}>
          <Link to={'my_account'}>
            <RiUserSearchFill className={'mx-auto'}/>
            <FormattedMessage
              id={"app.my_account"}
              defaultMessage={"Mon compte"}
            />
          </Link>
        </MenuItem>
        <MenuItem onClick={this.handleMenuClose}>
          <Link to={'profile'}>
            <RiUserSettingsFill className={'mx-auto'}/>
            <FormattedMessage
              id={"app.button.profile"}
              defaultMessage={"Profil"}
            />
          </Link>
        </MenuItem>
        <MenuItem onClick={this.handleMenuClose}>
          <Link to={'logout'}>
            <RiLogoutCircleRLine className={'mx-auto'}/>
            <FormattedMessage
              id={"app.button.logout"}
              defaultMessage={"Déconnexion"}
            />
          </Link>
        </MenuItem>
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
        <MenuItem onClick={this.handleMobileMenuClose}>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <MdMailOutline />
            </Badge>
          </IconButton>
          <p>Messages</p>
        </MenuItem>
        <MenuItem onClick={this.handleMobileMenuClose}>
          <IconButton color="inherit">
            <Badge badgeContent={11} color="secondary">
              <MdNotifications />
            </Badge>
          </IconButton>
          <p>Notifications</p>
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
        <AppBar position="fixed">
          <Toolbar>
            <Link className={'appbar-title'} to={'/'}>
              <Typography className={classes.title} variant="h5" color="inherit" noWrap>
                {process.env.REACT_APP_NAME}
              </Typography>
            </Link>
            <DrawerLeftMenu />
            {/*
              <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <MdSearch />
                </div>
                <InputBase
                  placeholder="Search…"
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                />
              </div>
            */}
            <div className={classes.grow} />
            <MainMenuSearchForm onSearch={this.props.onSearch}/>
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              <IconButton color="inherit">
                <Badge badgeContent={4} color="secondary">
                  <MdMailOutline />
                </Badge>
              </IconButton>
              <IconButton color="inherit">
                <Badge badgeContent={17} color="secondary">
                  <MdNotifications />
                </Badge>
              </IconButton>
              <IconButton
                aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                aria-haspopup="true"
                onClick={this.handleProfileMenuOpen}
                color="inherit"
              >
                <MdAccountCircle />
              </IconButton>
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
};

export default injectIntl(withStyles(styles)(MyAppBar));
