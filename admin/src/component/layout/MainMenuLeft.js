import React,{ Fragment, Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { MenuItemLink, getResources } from 'react-admin';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import {
  Inbox,
  Drafts,
  Send,
  ExpandLess,
  ExpandMore,
  StarBorder,
  AssignmentReturnedTwoTone,
  AssignmentReturnTwoTone,
  CollectionsTwoTone,
  CancelPresentationTwoTone,
  CommentTwoTone,
  FavoriteTwoTone,
  LocalGroceryStoreTwoTone,
  LocalShippingTwoTone,
  LocationCityIcon,
  LocationOnTwoTone,
  PaymentTwoTone,
  PeopleAltTwoTone,
  QuestionAnswerTwoTone,
  AddShoppingCartTwoTone,
  HowToVoteTwoTone,
  ReceiptTwoTone,
  DirectionsBoatTwoTone,
  AssignmentTwoTone,
  AccountCircleTwoTone,
  ThumbsUpDownTwoTone,
  CategoryTwoTone,
  GroupAddTwoTone,
  AccountBoxTwoTone,
  MessageTwoTone, MonetizationOnTwoTone, AllInboxTwoTone, StorageTwoTone, QueueTwoTone,
} from "@material-ui/icons";

class MainMenuLeft extends Component{
  constructor(props) {
    super(props);

    this.state = {
      open: "-1.0"
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(open){
    this.setState(state => ({
      open: state.open === open ? '-1.0' : open
    }));
  }


  render(){
    const { open } = this.state;

    return (
      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        className={"sidebar-nav-left"}
      >
        {/* Menu - Dashboard */}
        <ListItem button  onClick={() => this.handleClick('1')}>
          <MenuItemLink to={'/'} primaryText={'Tableau de bord'} leftIcon={<PeopleAltTwoTone />}/>
        </ListItem>
        {/* Item - Profile */}
        <ListItem button onClick={() => this.handleClick('2')}>
          <ListItemIcon>
            <StorageTwoTone />
          </ListItemIcon>
          <ListItemText primary={'Profile'}/>
          { open === "2" ? <ExpandLess/> : <ExpandMore/>}
          <Collapse in={open === "2"} timeout="auto" unmountOnExit>
            <List
              component={'div'}
              disablePadding
              subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  Votre profil personnel
                </ListSubheader>
              }
            >
              <MenuItemLink to={'/profile'} primaryText={'Information de profil'} leftIcon={<AccountCircleTwoTone/>} sidebarIsOpen={open === "2"}/>
              <MenuItemLink to={'/update_profile'} primaryText={'Clients'} leftIcon={<AccountCircleTwoTone/>} sidebarIsOpen={open === "2"}/>
              <MenuItemLink to={'/logout'} primaryText={'Fournisseurs'} leftIcon={<AccountBoxTwoTone/>} sidebarIsOpen={open === "2"}/>
            </List>
          </Collapse>
        </ListItem>
        {/* Menu - Members */}
        <ListItem button  onClick={() => this.handleClick('3')}>
          <ListItemIcon>
            <PeopleAltTwoTone />
          </ListItemIcon>
          <ListItemText primary={'Membres'}/>
          { open === "3" ? <ExpandLess/> : <ExpandMore/>}
          <Collapse in={open === "3"} timeout="auto" unmountOnExit>
            <List
              component={'div'}
              disablePadding
              subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  Tous nos membres
                </ListSubheader>
              }
            >
              <MenuItemLink to={'admins'} primaryText={'Administrateurs'} leftIcon={<AccountCircleTwoTone/>} sidebarIsOpen={open === "3"}/>
              <MenuItemLink to={'customers'} primaryText={'Clients'} leftIcon={<AccountCircleTwoTone/>} sidebarIsOpen={open === "3"}/>
              <MenuItemLink to={'suppliers'} primaryText={'Fournisseurs'} leftIcon={<AccountBoxTwoTone/>} sidebarIsOpen={open === "3"}/>
            </List>
          </Collapse>
        </ListItem>
        {/* Item - Products */}
        <ListItem button onClick={() => this.handleClick('4')}>
          <ListItemIcon>
            <StorageTwoTone />
          </ListItemIcon>
          <ListItemText primary={'Products'}/>
          { open === "4" ? <ExpandLess/> : <ExpandMore/>}
          <Collapse in={open === "4"} timeout="auto" unmountOnExit>
            <List
              component={'div'}
              disablePadding
              subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  Tous nos produits
                </ListSubheader>
              }
            >
              <MenuItemLink to={'admins'} primaryText={'Administrateurs'} leftIcon={<AccountCircleTwoTone/>} sidebarIsOpen={open === "4"}/>
              <MenuItemLink to={'customers'} primaryText={'Clients'} leftIcon={<AccountCircleTwoTone/>} sidebarIsOpen={open === "4"}/>
              <MenuItemLink to={'suppliers'} primaryText={'Fournisseurs'} leftIcon={<AccountBoxTwoTone/>} sidebarIsOpen={open === "4"}/>
            </List>
          </Collapse>
        </ListItem>

        <ListItem button>
          <ListItemIcon>
            <Send />
          </ListItemIcon>
          <ListItemText primary="Sent mail" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <Drafts />
          </ListItemIcon>
          <ListItemText primary="Drafts" />
        </ListItem>
        <ListItem button onClick={() => this.handleClick('-1')}>
          <ListItemIcon>
            <Inbox />
          </ListItemIcon>
          <ListItemText primary="Inbox" />
          {open === "-1" ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={open === "-1"} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button className={"nav-item-nested"}>
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText primary="Starred" />
            </ListItem>

          </List>
        </Collapse>
      </List>
    );
  }
}
/*
const mapStateToProps = state => ({
  resources: getResources(state)
});

 */
export default MainMenuLeft;
