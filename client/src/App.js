/**
 * Author: iracanyes
 * Date: 29/07/2019
 * Description:
 */
import React , { Component, Fragment } from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { reducer as form } from 'redux-form';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import history from './utils/history';
import {
  ConnectedRouter,
  connectRouter,
  routerMiddleware
} from 'connected-react-router';
import { StripeProvider } from 'react-stripe-elements';

/* Stylesheets */
import 'bootstrap/dist/css/bootstrap.css';
import './assets/scss/index.scss';
import {
  Navbar,
  NavbarBrand,
} from 'reactstrap';
/* @fortawesome/react-fontawesome */

import './config/FontAwesome';

/* Importation des reducers et des routes de l'appli */

/* Reducers */
// import reducers
import address from './reducers/address/';
import admin from './reducers/admin/';
import bankaccount from './reducers/bankaccount/';
import bill from './reducers/bill/';
import billcustomer from './reducers/billcustomer/';
import billrefund from './reducers/billrefund/';
import billsupplier from './reducers/billsupplier/';
import category from './reducers/category/';
import comment from './reducers/comment/';
import customer from './reducers/customer/';
import deliverydetail from './reducers/deliverydetail/';
import deliveryset from './reducers/deliveryset/';
import favorite from './reducers/favorite/';
import forum from './reducers/forum/';
import image from './reducers/image/';
import message from './reducers/message/';
import orderdetail from './reducers/orderdetail/';
import orderset from './reducers/orderset/';
import orderreturned from './reducers/orderreturned/';
import payment from './reducers/payment/';
import product from './reducers/product/';
import shipper from './reducers/shipper/';
import supplier from  './reducers/supplier/';
import supplierproduct from './reducers/supplierproduct';
import user from './reducers/user/';
import withdrawal from  './reducers/withdrawal/';

/* Routes */
//import routes
import addressRoutes from './routes/address';
import adminRoutes from './routes/admin';
import bankAccountRoutes from './routes/bankaccount';
import billRoutes from './routes/bill';
import billCustomerRoutes from './routes/billcustomer';
import billRefundRoutes from './routes/billrefund';
import billSupplierRoutes from './routes/billsupplier';
import categoryRoutes from './routes/category';
import commentRoutes from './routes/comment';
import customerRoutes from './routes/customer';
import deliveryDetailRoutes from './routes/deliverydetail';
import deliverySetRoutes from './routes/deliveryset';
import favoriteRoutes from './routes/favorite';
import forumRoutes from './routes/forum';
import imageRoutes from './routes/image';
import messageRoutes from './routes/message';
import orderDetailRoutes from './routes/orderdetail';
import orderSetRoutes from './routes/orderset';
import orderReturnedRoutes from './routes/orderreturned';
import paymentRoutes from './routes/payment';
import productRoutes from './routes/product';
import shipperRoutes from './routes/shipper';
import shoppingCartRoutes from './routes/shoppingcart';
import supplierRoutes from './routes/supplier';
import supplierProductRoutes from './routes/supplierproduct';
import userRoutes from './routes/user';
import withdrawalRoutes from './routes/withdrawal';
import pageRoutes from './routes/page';

/* Layout */
import Welcome from './Welcome';
import Homepage from './page/Homepage';
import MainMenuSearchForm from "./components/search/MainMenuSearchForm";
import MainMenu from "./layout/MainMenu";
import SearchResults from "./components/search/SearchResults";
import Error404Cat from "./page/Error404Cat";

/* Internationalisation : FormatJS/React-Intl */
import { IntlProvider} from "react-intl";
import { addLocaleData, messages, language } from "./config/internationalization.js";


/* chargement des données locales */
addLocaleData();





const store = createStore(
  combineReducers({
    router: connectRouter(history),
    form,
    address,
    admin,
    bankaccount,
    bill,
    billcustomer,
    billrefund,
    billsupplier,
    category,
    comment,
    customer,
    deliverydetail,
    deliveryset,
    favorite,
    forum,
    image,
    message,
    orderdetail,
    orderset,
    orderreturned,
    payment,
    product,
    shipper,
    supplier,
    supplierproduct,
    user,
    withdrawal
  }),
  applyMiddleware(routerMiddleware(history), thunk)
);


export class App extends Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      results: []
    };

    this.search = this.search.bind(this);
  }


  /* Permet de transmettre les résultats de recherche du composant MainMenuSearchForm vers le composant d'affichage des résultats SearchResults. Utilisation de la technique HOC - High Order Component */
  search(results)
  {
    this.setState({results: results});
  }



  render()
  {
    const { results } = this.state;


    return (
      <Provider store={store}>
        <IntlProvider locale={language} messages={messages[language]}>
          <StripeProvider apiKey={`${process.env.REACT_APP_STRIPE_PUBLIC_KEY}`}>
            <ConnectedRouter history={history}>
              <BrowserRouter>
                <div>
                  <header>
                    <Navbar color={"bg-primary"} dark expand={"lg"}   id="navbar-primary" className="navbar navbar-expand-lg navbar-dark bg-primary">
                      {/* Navbar brand*/}
                      <NavbarBrand href="/" className="col-lg-2">Buja Market</NavbarBrand>


                      <div className="main-menu-search-form col-lg-5">
                        <MainMenuSearchForm onSearch={this.search}/>
                      </div>


                      <MainMenu/>

                    </Navbar>
                  </header>

                  <main>
                    <aside id="aside-left">

                    </aside>
                    <section id="main-content" className="col col-lg-12">
                      <div id="search-results-component" className={'col-lg-9 mx-auto'}>
                        {results && (<SearchResults results={ results }/>)}

                      </div>

                      <div>
                        <Switch>
                          <Route path="/dev" component={Welcome} strict={true} exact={true}/>
                          <Route path="/" component={Homepage} strict={true} exact={true} />
                          {/* Add your routes here */}
                          { addressRoutes }
                          { adminRoutes }
                          { bankAccountRoutes }
                          { billRoutes }
                          { billCustomerRoutes }
                          { billRefundRoutes }
                          { billSupplierRoutes }
                          { categoryRoutes }
                          { commentRoutes }
                          { customerRoutes }
                          { deliveryDetailRoutes }
                          { deliverySetRoutes }
                          { favoriteRoutes }
                          { forumRoutes }
                          { imageRoutes }
                          { messageRoutes }
                          { orderDetailRoutes }
                          { orderReturnedRoutes }
                          { paymentRoutes }
                          { orderSetRoutes }
                          { productRoutes }
                          { shipperRoutes }
                          { shoppingCartRoutes }
                          { supplierRoutes }
                          { supplierProductRoutes }
                          { userRoutes }
                          { withdrawalRoutes }
                          {pageRoutes}

                        </Switch>


                      </div>

                    </section>
                  </main>
                </div>
              </BrowserRouter>
            </ConnectedRouter>
          </StripeProvider>
        </IntlProvider>
      </Provider>
    );
  }
}
