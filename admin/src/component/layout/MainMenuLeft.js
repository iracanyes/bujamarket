import React, {Fragment, forwardRef, useState} from 'react';
import {
  useLogout
} from "react-admin";
import { MenuItemLink } from 'react-admin';
import {
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@material-ui/core";
import {
  Inbox,
  ExpandLess,
  ExpandMore,
  StarBorder,
  AccountCircleTwoTone,
  AccountBoxTwoTone,
  StorageTwoTone,
} from "@material-ui/icons";
import {
  AiTwotoneContainer,
  AiFillContainer,
  AiOutlineShoppingCart
} from "react-icons/ai";
import {
  BsFillInboxesFill,
  BsFillPersonLinesFill,
  BsImages
} from "react-icons/bs";
import {
  FaCommentsDollar,
  FaUserEdit,
  FaUserShield,
  FaRegImages,
  FaShippingFast,
  FaChartLine,
  FaRegChartBar,
  FaUserFriends,
  FaUsersCog,
  FaUsers,
  FaMapSigns,
  FaPlaceOfWorship
} from "react-icons/fa";
import {
  FcCustomerSupport,
  FcOnlineSupport
} from "react-icons/fc";
import {
  GiReturnArrow,
  GiCardboardBox,
  GiBuyCard,
  GiFactory,
  GiTreasureMap
} from "react-icons/gi";
import {
  GoPackage,
  GoSignOut
} from "react-icons/go";
import {
  GrCreditCard,
  GrMapLocation
} from "react-icons/gr";
import {
  IoMdImages,
  IoIosImage,
  IoIosImages
} from "react-icons/io";
import {
  MdDashboard,
  MdAssignmentReturn,
} from "react-icons/md";
import {
  RiLogoutBoxRLine,
  RiShipLine,
  RiRefund2Line,
  RiMapPinUserLine
} from "react-icons/ri";
import {
  TiShoppingCart
} from "react-icons/ti";

const MainMenuLeft = forwardRef((props, ref) => {
  const [open, setOpen ] = useState('-1.0');
  const logout = useLogout();

  const handleClick = (newOpen) => {
    setOpen(open === newOpen ? '-1.0' : newOpen);
  }

  return (
    <List
      component="nav"
      aria-labelledby="nested-list-subheader"
      className={"sidebar-nav-left"}
    >
      {/* Menu - Dashboard */}
      <ListItem
        button
        onClick={() => handleClick('1')}
        style={{ width: "100%"}}
      >
        <MenuItemLink
          to={'/'}
          primaryText={'Tableau de bord'}
          leftIcon={<MdDashboard />}
          style={{ width: "100%", padding: "0.5rem 0rem"}}
        />
      </ListItem>
      {/* Item - Profile */}
      <ListItem
        button
        onClick={() => handleClick('2')}
        style={{ flexDirection: "column"}}
      >
        <div style={{ display: "flex", flexDirection: "row", width: "100%"}}>
          <ListItemIcon>
            <BsFillPersonLinesFill />
          </ListItemIcon>
          <ListItemText primary={'Profile'}/>
          { open === "2" ? <ExpandLess/> : <ExpandMore/>}
        </div>
        <div>
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
              <MenuItemLink to={'/update_profile'} primaryText={'Mise à jour du profil'} leftIcon={<FaUserEdit/>} sidebarIsOpen={open === "2"}/>
              <MenuItemLink to={'/update_password'} primaryText={'Mise à jour du mot de passe'} leftIcon={<FaUserShield/>} sidebarIsOpen={open === "2"}/>
              <MenuItemLink to={'/logout'} primaryText={'Déconnexion'} leftIcon={<RiLogoutBoxRLine/>} sidebarIsOpen={open === "2"}/>
            </List>
          </Collapse>
        </div>
      </ListItem>
      {/* Item - Products */}
      <ListItem
        button
        onClick={() => handleClick('3')}
        style={{ flexDirection: "column"}}
      >
        <div style={{ display: "flex", flexDirection: "row", width: "100%"}}>
          <ListItemIcon>
            <StorageTwoTone />
          </ListItemIcon>
          <ListItemText primary={'Products'}/>
          { open === "3" ? <ExpandLess/> : <ExpandMore/>}
        </div>
        <div>
          <Collapse in={open === "3"} timeout="auto" unmountOnExit>
            <List
              component={'div'}
              disablePadding
              subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  Tous les produits
                </ListSubheader>
              }
            >
              <MenuItemLink to={'/categories'} primaryText={'Catégories'} leftIcon={<BsFillInboxesFill/>} sidebarIsOpen={open === "3"}/>
              <MenuItemLink to={'/products'} primaryText={'Produits'} leftIcon={<AiFillContainer/>} sidebarIsOpen={open === "3"}/>
              <MenuItemLink to={'/supplier_products'} primaryText={'Produits fournisseurs'} leftIcon={<AiTwotoneContainer/>} sidebarIsOpen={open === "3"}/>
              <MenuItemLink to={'/comments'} primaryText={'Commentaires'} leftIcon={<FaCommentsDollar/>} sidebarIsOpen={open === "3"}/>
            </List>
          </Collapse>
        </div>
      </ListItem>
      {/* Menu - Image */}
      <ListItem
        button
        onClick={() => handleClick('4')}
        style={{ flexDirection: "column"}}
      >
        <div style={{ display: "flex", flexDirection: "row", width: "100%"}}>
          <ListItemIcon>
            <BsImages />
          </ListItemIcon>
          <ListItemText primary={'Images'}/>
          { open === "4" ? <ExpandLess/> : <ExpandMore/>}
        </div>
        <div>
          <Collapse in={open === "4"} timeout="auto" unmountOnExit>
            <List
              component={'div'}
              disablePadding
              subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  Toutes les images
                </ListSubheader>
              }
            >
              <MenuItemLink to={'/category_images'} primaryText={'Images des catégories'} leftIcon={<FaRegImages/>} sidebarIsOpen={open === "4"}/>
              <MenuItemLink to={'/product_images'} primaryText={'Images des produits'} leftIcon={<BsImages/>} sidebarIsOpen={open === "4"}/>
              <MenuItemLink to={'/supplier_images'} primaryText={'Avatar des fournisseurs'} leftIcon={<IoMdImages/>} sidebarIsOpen={open === "4"}/>
              <MenuItemLink to={'/customer_images'} primaryText={'Images des clients'} leftIcon={<IoIosImages/>} sidebarIsOpen={open === "4"}/>
            </List>
          </Collapse>
        </div>
      </ListItem>
      {/* Item - Orders */}
      <ListItem
        button
        onClick={() => handleClick('5')}
        style={{ flexDirection: "column"}}
      >
        <div style={{ display: "flex", flexDirection: "row", width: "100%"}}>
          <ListItemIcon>
            <TiShoppingCart />
          </ListItemIcon>
          <ListItemText primary={'Commandes'}/>
          { open === "5" ? <ExpandLess/> : <ExpandMore/>}
        </div>
        <div>
          <Collapse in={open === "5"} timeout="auto" unmountOnExit>
            <List
              component={'div'}
              disablePadding
              subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  Toutes les commandes
                </ListSubheader>
              }
            >
              <MenuItemLink to={'/orders'} primaryText={'Commandes'} leftIcon={<AiOutlineShoppingCart/>} sidebarIsOpen={open === "5"}/>
              <MenuItemLink to={'/returned_orders'} primaryText={'Commandes retournées'} leftIcon={<MdAssignmentReturn/>} sidebarIsOpen={open === "5"}/>
              <MenuItemLink to={'/withdrawals'} primaryText={'Commandes annulées'} leftIcon={<GiReturnArrow/>} sidebarIsOpen={open === "5"}/>
            </List>
          </Collapse>
        </div>
      </ListItem>
      {/* Item - Delivery */}
      <ListItem
        button
        onClick={() => handleClick('6')}
        style={{ flexDirection: "column"}}
      >
        <div style={{ display: "flex", flexDirection: "row", width: "100%"}}>
          <ListItemIcon>
            <FaShippingFast />
          </ListItemIcon>
          <ListItemText primary={'Livraison'}/>
          { open === "6" ? <ExpandLess/> : <ExpandMore/>}
        </div>
        <div>
          <Collapse in={open === "6"} timeout="auto" unmountOnExit>
            <List
              component={'div'}
              disablePadding
              subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  Toutes les livraisons
                </ListSubheader>
              }
            >
              <MenuItemLink to={'/delivery_tracking'} leftIcon={<GiTreasureMap/>} primaryText={'Suivi de livraison'} sidebarIsOpen={open === "6"}/>
              <MenuItemLink to={'/delivery_sets'} primaryText={'Livraisons par client'} leftIcon={<GoPackage/>} sidebarIsOpen={open === "6"}/>
              <MenuItemLink to={'/delivery_details'} primaryText={'Livraison par produit'} leftIcon={<GiCardboardBox/>} sidebarIsOpen={open === "6"}/>
              <MenuItemLink to={'/shippers'} primaryText={'Transporteur'} leftIcon={<RiShipLine/>} sidebarIsOpen={open === "6"}/>
            </List>
          </Collapse>
        </div>
      </ListItem>
      {/* Item - Finance */}
      <ListItem
        button
        onClick={() => handleClick('7')}
        style={{ flexDirection: "column"}}
      >
        <div style={{ display: "flex", flexDirection: "row", width: "100%"}}>
          <ListItemIcon>
            <FaChartLine />
          </ListItemIcon>
          <ListItemText primary={'Finance'}/>
          { open === "7" ? <ExpandLess/> : <ExpandMore/>}
        </div>
        <div>
          <Collapse in={open === "7"} timeout="auto" unmountOnExit>
            <List
              component={'div'}
              disablePadding
              subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  Toutes les transactions
                </ListSubheader>
              }
            >
              <MenuItemLink to={'/bank_accounts'} primaryText={'Comptes bancaires'} leftIcon={<GrCreditCard/>} sidebarIsOpen={open === "7"}/>
              <MenuItemLink to={'/payments'} primaryText={'Paiements'} leftIcon={<GiBuyCard/>} sidebarIsOpen={open === "7"}/>
              <MenuItemLink to={'/refunds'} primaryText={'Remboursement'} leftIcon={<RiRefund2Line/>} sidebarIsOpen={open === "7"}/>
              <MenuItemLink to={'/statistics'} primaryText={'Bilan'} leftIcon={<FaRegChartBar />} sidebarIsOpen={open === "7"}/>
            </List>
          </Collapse>
        </div>
      </ListItem>
      {/* Item - Members */}
      <ListItem
        button
        onClick={() => handleClick('8')}
        style={{ flexDirection: "column"}}
      >
        <div style={{ display: "flex", flexDirection: "row", width: "100%"}}>
          <ListItemIcon>
            <FaUsers />
          </ListItemIcon>
          <ListItemText primary={'Membres'}/>
          { open === "8" ? <ExpandLess/> : <ExpandMore/>}
        </div>
        <div>
          <Collapse in={open === "8"} timeout="auto" unmountOnExit>
            <List
              component={'div'}
              disablePadding
              subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  Tous nos membres
                </ListSubheader>
              }
            >
              <MenuItemLink to={'/admins'} primaryText={'Administrateurs'} leftIcon={<FaUsersCog/>} sidebarIsOpen={open === "8"}/>
              <MenuItemLink to={'/customers'} primaryText={'Clients'} leftIcon={<FaUserFriends/>} sidebarIsOpen={open === "8"}/>
              <MenuItemLink to={'/suppliers'} primaryText={'Fournisseurs'} leftIcon={<GiFactory/>} sidebarIsOpen={open === "8"}/>
            </List>
          </Collapse>
        </div>
      </ListItem>
      {/* Menu - Addresses */}
      <ListItem
        button
        onClick={() => handleClick('9')}
        style={{ flexDirection: "column"}}
      >
        <div style={{ display: "flex", flexDirection: "row", width: "100%"}}>
          <ListItemIcon>
            <GrMapLocation />
          </ListItemIcon>
          <ListItemText primary={'Adresses'}/>
          { open === "9" ? <ExpandLess/> : <ExpandMore/>}
        </div>
        <div>
          <Collapse in={open === "9"} timeout="auto" unmountOnExit>
            <List
              component={'div'}
              disablePadding
              subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  Tous les adresses
                </ListSubheader>
              }
            >
              <MenuItemLink to={'/customer_addresses'} primaryText={'Adresses de livraison'} leftIcon={<RiMapPinUserLine/>} sidebarIsOpen={open === "9"}/>
              <MenuItemLink to={'/supplier_addresses'} primaryText={'Adresse des fournisseurs'} leftIcon={<FaPlaceOfWorship/>} sidebarIsOpen={open === "9"}/>
              <MenuItemLink to={'/shipper_addresses'} primaryText={'Adresse des transporteurs'} leftIcon={<FaMapSigns/>} sidebarIsOpen={open === "9"}/>
            </List>
          </Collapse>
        </div>
      </ListItem>

      {/* Item - Customer/Supplier Relations */}
      <ListItem
        button
        onClick={() => handleClick('10')}
        style={{ flexDirection: "column"}}
      >
        <div style={{ display: "flex", flexDirection: "row", width: "100%"}}>
          <ListItemIcon>
            <FcCustomerSupport />
          </ListItemIcon>
          <ListItemText primary={'Forum'}/>
          { open === "10" ? <ExpandLess/> : <ExpandMore/>}
        </div>
        <div>
          <Collapse in={open === "10"} timeout="auto" unmountOnExit>
            <List
              component={'div'}
              disablePadding
              subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  Toutes les discussions
                </ListSubheader>
              }
            >
              <MenuItemLink to={'/customer_support'} primaryText={'Relation clients'} leftIcon={<FcCustomerSupport/>} sidebarIsOpen={open === "10"}/>
              <MenuItemLink to={'/supplier_support'} primaryText={'Relation fournisseurs'} leftIcon={<FcOnlineSupport/>} sidebarIsOpen={open === "10"}/>
            </List>
          </Collapse>
        </div>
      </ListItem>
      {/* Menu - Logout */}
      <ListItem
        button
        onClick={logout}
      >
        <ListItemIcon>
          <GoSignOut />
        </ListItemIcon>
        <ListItemText primary="Déconnexion" />
      </ListItem>

    </List>
  );
});
/*
const mapStateToProps = state => ({
  resources: getResources(state)
});
 */

export default MainMenuLeft;
