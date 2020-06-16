/**
 * Author: iracanyes
 * Date: 23/06/20
 * Description: Sidebar left -  Menu
 */
import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { withRouter, NavLink as RRDNavLink } from "react-router-dom";
import {FormattedMessage, injectIntl} from "react-intl";
import {
  Button,
  Nav,
  Navbar,
  NavLink,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem, CardImg
} from 'reactstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { logout } from "../actions/user/login";
import {SpinnerLoading} from "./Spinner";
import {getProfileImage} from "../actions/image/profile";

class SidebarLeftMenu extends Component
{
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if(this.props.retrievedImage === null)
      this.props.getProfileImage();
  }

  render()
  {
    const { retrievedImage, loading, intl } = this.props;

    const user = localStorage.getItem('token') !== null && JSON.parse(atob(localStorage.getItem('token').split(".")[1]));

    return <Fragment>
      <Navbar dark color={"dark"} className={"bg-dark navbar-left"}>
        <UncontrolledButtonDropdown>
          { user && (
            <Button outline className={'py-3'}>
              <picture className={'d-flex mx-auto'}>
                { loading && <SpinnerLoading message={"Chargement de l'image de profil"} />}
                { retrievedImage && <CardImg src={ retrievedImage } alt={user.name} className={'img-thumbnail rounded-circle'} />}
              </picture>
              <div>{user.name}</div>
            </Button>
          )}
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
                <FormattedMessage id={"app.button.your_addresses"} defaultMessage={"Vos adresses"} description={"Button - Update data"}/>
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
              <NavLink tag={RRDNavLink} to={{pathname: "/logout"}}>
                <FontAwesomeIcon icon={"sign-out-alt"}  className={"mr-2"}/>
                <FormattedMessage id={"app.button.logout"} defaultMessage={"Dé-connexion"} />
              </NavLink>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledButtonDropdown>
        <UncontrolledButtonDropdown>
          <DropdownToggle outline className={'text-primary'}>
            <FontAwesomeIcon icon={"shopping-cart"} className={"mr-2"}/>
            <FormattedMessage id={"app.button.orders"} defaultMessage={"Commandes"} description={"Button - Orders"}/>
          </DropdownToggle>
          <DropdownMenu className={'bg-dark text-secondary'} >
            <DropdownItem header>
              <FontAwesomeIcon icon={"shopping-basket"} className={"mr-2"}/>
              <FormattedMessage id={"app.button.product_orders"} defaultMessage={"Commandes de produit"} description={"Button - Product orders"}/>
            </DropdownItem>
            <DropdownItem divider></DropdownItem>
            <DropdownItem>
              <NavLink tag={RRDNavLink} to={{pathname: "/orders", state: { from : window.location.pathname }}}>
                <FontAwesomeIcon icon={"shopping-cart"} className={"mr-2"}/>
                <FormattedMessage id={"app.button.all_orders"} defaultMessage={"Toutes les commandes"} description={"Button - All orders"}/>
              </NavLink>
            </DropdownItem>
            <DropdownItem>
              <NavLink tag={RRDNavLink} to={{pathname: "/orders/recent", state: { from : window.location.pathname }}}>
                <FontAwesomeIcon icon={"cart-plus"} className={"mr-2"}/>
                <FormattedMessage id={"app.button.new_orders"} defaultMessage={"Nouvelles commandes"} description={"Button - New orders"}/>
              </NavLink>
            </DropdownItem>
            <DropdownItem>
              <NavLink tag={RRDNavLink} to={{pathname: "/orders/pending", state: { from : window.location.pathname }}}>
                <FontAwesomeIcon icon={"dolly-flatbed"} className={"mr-2"}/>
                <FormattedMessage id={"app.button.pending_orders"} defaultMessage={"Commandes en cours"} description={"Button - Pending orders"}/>
              </NavLink>
            </DropdownItem>
            <DropdownItem>
              <NavLink tag={RRDNavLink} to={{pathname: "/orders/delivered", state: { from : window.location.pathname }}}>
                <FontAwesomeIcon icon={"truck-loading"} className={"mr-2"}/>
                <FormattedMessage id={"app.button.delivered_orders"} defaultMessage={"Commandes livrées"} description={"Button - Delivered orders"}/>
              </NavLink>
            </DropdownItem>
            <DropdownItem divider />
            <DropdownItem>
              <NavLink tag={RRDNavLink} to={{pathname: "/orders/complaint", state: { from : window.location.pathname }}}>
                <FontAwesomeIcon icon={"comments"}  className={"mr-2"}/>
                <FormattedMessage id={"app.button.orders_in_dispute"} defaultMessage={"Commandes en litiges"} description={"Button - Orders in dispute"}/>
              </NavLink>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledButtonDropdown>
        <UncontrolledButtonDropdown>
          <DropdownToggle outline className={'text-primary'}>
            <FontAwesomeIcon icon={"boxes"} className={"mr-2"}/>
            <FormattedMessage id={"app.button.deliveries"} defaultMessage={"Livraisons"} description={"Button - Deliveries"}/>
          </DropdownToggle>
          <DropdownMenu className={'bg-dark text-secondary'} >
            <DropdownItem header>
              <FontAwesomeIcon icon={"boxes"} className={"mr-2"}/>
              <FormattedMessage id={"app.button.product_deliveries"} defaultMessage={"Livraisons de vos produits"} description={"Button - Product deliveries"}/>
            </DropdownItem>
            <DropdownItem divider></DropdownItem>
            <DropdownItem>
              <NavLink tag={RRDNavLink} to={{pathname: "/deliveries", state: { from : window.location.pathname }}}>
                <FontAwesomeIcon icon={"boxes"} className={"mr-2"}/>
                <FormattedMessage id={"app.button.all_deliveries"} defaultMessage={"Toutes les livraisons"} description={"Button - All deliveries"}/>
              </NavLink>
            </DropdownItem>
            <DropdownItem>
              <NavLink tag={RRDNavLink} to={{pathname: "/delivery/pending", state: { from : window.location.pathname }}}>
                <FontAwesomeIcon icon={"shipping-fast"} className={"mr-2"}/>
                <FormattedMessage id={"app.button.pending_deliveries"} defaultMessage={"Livraisons en cours"} description={"Button - Pending deliveries"}/>
              </NavLink>
            </DropdownItem>
            <DropdownItem>
              <NavLink tag={RRDNavLink} to={{pathname: "/delivery/confirmed", state: { from : window.location.pathname }}}>
                <FontAwesomeIcon icon={"truck-loading"} className={"mr-2"}/>
                <FormattedMessage id={"app.button.confirmed_deliveries"} defaultMessage={"Livraisons confirmées"} description={"Button - Pending deliveries"}/>
              </NavLink>
            </DropdownItem>
            <DropdownItem>
              <NavLink tag={RRDNavLink} to={{pathname: "/delivery/tracking", state: { from : window.location.pathname }}}>
                <FontAwesomeIcon icon={"map-marker-alt"} className={"mr-2"} />
                <FormattedMessage id={"app.button.delivery_tracking"} defaultMessage={"Suivi des livraisons"} description={"Button - Shipper information"}/>
              </NavLink>
            </DropdownItem>
            <DropdownItem divider />
            <DropdownItem>
              <NavLink tag={RRDNavLink} to={{pathname: "/delivery/complaint", state: { from : window.location.pathname }}}>
                <FontAwesomeIcon icon={"comments"} className={"mr-2"}/>
                <FormattedMessage id={"app.button.disputed_deliveries"} defaultMessage={"Livraisons en litiges"} description={"Button - Disputed deliveries"}/>
              </NavLink>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledButtonDropdown>
        <UncontrolledButtonDropdown>
          <DropdownToggle outline className={'text-primary'}>
            <FontAwesomeIcon icon={"dollar-sign"}  className={"mr-2"}/>
            <FormattedMessage id={"app.button.payments"} defaultMessage={"Paiements"} description={"Button - Payments"}/>
          </DropdownToggle>
          <DropdownMenu className={'bg-dark text-secondary'} >
            <DropdownItem header>
              <FontAwesomeIcon icon={"money-check-alt"}  className={"mr-2"}/>
              <FormattedMessage id={"app.button.received_payments"} defaultMessage={"Paiments perçus sur la plateforme"} description={"Button - Received payments"}/>
            </DropdownItem>
            <DropdownItem divider></DropdownItem>
            <DropdownItem>
              <NavLink tag={RRDNavLink} to={{pathname: "/payments", state: { from : window.location.pathname }}}>
                <FontAwesomeIcon icon={"hand-holding-usd"} className={"mr-2"}/>
                <FormattedMessage id={"app.button.all_payments_received"} defaultMessage={"Ensemble des paiements perçus"} description={"Button - All payments received"}/>
              </NavLink>
            </DropdownItem>
            <DropdownItem>
              <NavLink tag={RRDNavLink} to={{pathname: "/pending_payments", state: { from : window.location.pathname }}}>
                <FontAwesomeIcon icon={"hand-holding-usd"} className={"mr-2"}/>
                <FormattedMessage id={"app.button.pending_payments"} defaultMessage={"Paiments en cours de traitement"} description={"Button - Pending payment"}/>
              </NavLink>
            </DropdownItem>
            <DropdownItem divider />
            <DropdownItem>
              <NavLink tag={RRDNavLink} to={{pathname: "/payments/conflict", state: { from : window.location.pathname }}}>
                <FontAwesomeIcon icon={"comments-dollar"} className={"mr-2"} />
                <FormattedMessage id={"app.button.disputed_payments"} defaultMessage={"Paiements en litiges"} description={"Button - Disputed payments"}/>
              </NavLink>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledButtonDropdown>
        <UncontrolledButtonDropdown>
          <DropdownToggle outline className={'text-primary'}>
            <FontAwesomeIcon icon={"shopping-cart"} className={"mr-2"}/>
            <FormattedMessage id={"app.button.products"} defaultMessage={"Produits"} description={"Button - Products"}/>
          </DropdownToggle>
          <DropdownMenu className={'bg-dark text-secondary'} >
            <DropdownItem header>
              <FontAwesomeIcon icon={"shopping-basket"} className={"mr-2"}/>
              <FormattedMessage id={"app.button.your_products"} defaultMessage={"Vos produits"} description={"Button - Your products"}/>
            </DropdownItem>
            <DropdownItem divider></DropdownItem>
            <DropdownItem>
              <NavLink tag={RRDNavLink} to={{pathname: "/my_products", state: { from : window.location.pathname }}}>
                <FontAwesomeIcon icon={"shopping-cart"} className={"mr-2"}/>
                <FormattedMessage id={"app.button.all_your_products"} defaultMessage={"Tous vos produits"} description={"Button - All your products"}/>
              </NavLink>
            </DropdownItem>
            <DropdownItem>
              <NavLink tag={RRDNavLink} to={{pathname: "/product/create", state: { from : window.location.pathname }}}>
                <FontAwesomeIcon icon={"cart-plus"} className={"mr-2"}/>
                <FormattedMessage id={"app.button.add_product"} defaultMessage={"Ajouter un produit"} description={"Button - Add product"}/>
              </NavLink>
            </DropdownItem>
            <DropdownItem>
              <NavLink tag={RRDNavLink} to={{pathname: "/orders/pending", state: { from : window.location.pathname }}}>
                <FontAwesomeIcon icon={"dolly-flatbed"} className={"mr-2"}/>
                <FormattedMessage id={"app.button.update_product"} defaultMessage={"Mettre à jour un produit"} description={"Button - Update product"}/>
              </NavLink>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledButtonDropdown>
        <UncontrolledButtonDropdown>
          <DropdownToggle outline className={'text-primary'}>
            <FontAwesomeIcon icon={"ship"} className={"mr-2"} />
            <FormattedMessage id={"app.button.shippers"} defaultMessage={"Expéditeurs"} description={"Button - Shippers"}/>
          </DropdownToggle>
          <DropdownMenu className={'bg-dark text-secondary'} >
            <DropdownItem header>
              <FontAwesomeIcon icon={"truck"} className={"mr-2"} />
              <FormattedMessage id={"app.button.product_deliveries"} defaultMessage={"Livraisons de vos produits"} description={"Button - Product deliveries"}/>
            </DropdownItem>
            <DropdownItem divider></DropdownItem>
            <DropdownItem>
              <NavLink tag={RRDNavLink} to={{pathname: "/shippers", state: { from : window.location.pathname }}}>
                <FontAwesomeIcon icon={"comments-dollar"} className={"mr-2"} />
                <FormattedMessage id={"app.button.shipper_information"} defaultMessage={"Informations sur nos expéditeurs"} description={"Button - Shipper information"}/>
              </NavLink>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledButtonDropdown>
        <UncontrolledButtonDropdown>
          <DropdownToggle outline className={'text-primary'}>
            <FontAwesomeIcon icon={"comments"} className={"mr-2"}/>
            <FormattedMessage id={"app.button.rating"} defaultMessage={"Évaluations"} description={"Button - Rating"}/>
          </DropdownToggle>
          <DropdownMenu className={'bg-dark text-secondary'} >
            <DropdownItem header>
              <FontAwesomeIcon icon={"inbox"} className={"mr-2"}/>
              <FormattedMessage id={"app.button.customer_reviews_on_your_products"} defaultMessage={"Avis des clients sur vos produits"} description={"Button - Customer reviews on your products"}/>
            </DropdownItem>
            <DropdownItem divider></DropdownItem>
            <DropdownItem>
              <NavLink tag={RRDNavLink} to={{pathname: "/comments", state: { from : window.location.pathname }}}>
                <FontAwesomeIcon icon={"comments"} className={"mr-2"} />
                <FormattedMessage id={"app.button.rating_and_reviews"} defaultMessage={"Évaluations et commentaires"} description={"Button - Rating and reviews"}/>
              </NavLink>
            </DropdownItem>
            <DropdownItem divider />
            <DropdownItem>
              <NavLink tag={RRDNavLink} to={{pathname: "/rating", state: { from : window.location.pathname }}}>
                <FontAwesomeIcon icon={"comments-dollar"} className={"mr-2"} />
                <span>Évaluations et commentaires</span>
              </NavLink>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledButtonDropdown>
      </Navbar>
    </Fragment>;
  }
}

const mapStateToProps = state => {
  const { retrieved, loading, error } = state.image.profile;
  return { retrievedImage: retrieved, loading, error };
};

const mapDispatchToProps = dispatch => ({
  getProfileImage: () => dispatch(getProfileImage()),
  logout: () => dispatch(logout())
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(injectIntl(SidebarLeftMenu)));
