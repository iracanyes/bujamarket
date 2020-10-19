/**
 * Author: iracanyes
 * Date: 29/07/2019
 * Description:
 */
import React , { Component } from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { reducer as form } from 'redux-form';
import { Switch, Route, Router } from 'react-router-dom';
import history from './utils/history';
import {
  ConnectedRouter,
  connectRouter,
  routerMiddleware
} from 'connected-react-router';


/* Stylesheets */
import 'bootstrap/dist/css/bootstrap.css';
import './assets/scss/index.scss';
import {
  Navbar,
  NavbarBrand,
} from 'reactstrap';

/* @fortawesome/react-fontawesome */
import './config/FontAwesome';

/* React-toastify */
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"

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
import shoppingcart from "./reducers/shoppingcart";
import user from './reducers/user/';
import usertemp from './reducers/usertemp/';
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



/* Internationalisation : FormatJS/React-Intl */
import { IntlProvider} from "react-intl";
import { addLocaleData, messages, language } from "./config/internationalization.js";

/* Layout */
import Welcome from './Welcome';
import Homepage from './page/Homepage';
import MainMenuSearchForm from "./components/search/MainMenuSearchForm";
import MainMenu from "./layout/MainMenu";
import SearchResults from "./components/search/SearchResults";
import SidebarLeftMenu from "./layout/SidebarLeftMenu";
import HomepageSlider from "./page/HomepageSlider";
import Footer from "./layout/Footer";

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
    shoppingcart,
    supplier,
    supplierproduct,
    user,
    usertemp,
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

  /* Permet de transmettre les résultats de recherche du composant MainMenuSearchForm vers le composant d'affichage des résultats SearchResults. HOC - High Order Component */
  search(results)
  {
    this.setState({results: results});
  }

  render()
  {
    const { results } = this.state;

    const user = localStorage.getItem("token") !== null ? JSON.parse(atob(localStorage.getItem("token").split('.')[1])) : null;

    console.log('store', store);
    const state = store.getState();
    console.log('state', state);
    console.log('user connected', state.user.authentication.login.token);
    const userConnected = user === null && state.user.authentication.login.token !== null ? JSON.parse(atob(state.user.authentication.login.token.token.split('.')[1])) : null;

    return (
      <Provider store={store}>
        <IntlProvider locale={language} messages={messages[language]}>
          <ConnectedRouter history={history}>
            <Router history={history}>
              <div  style={{minHeight: "100vh"}}>
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
                {/* HomepageSlider */}
                { user === null && userConnected === null && (
                  <Route path={'/'} exact={true}>
                    <div id="homepage-slider">
                      <HomepageSlider />
                    </div>
                  </Route>
                ) }
                {/* Main section  */}
                <main>
                  <aside id="aside-left">
                    <Route
                      path={'/'}
                      strict={false}
                      exact={false}
                    >
                      { ( (user !== null || userConnected !== null) && user.roles.includes('ROLE_MEMBER') ) && <SidebarLeftMenu /> }
                    </Route>
                  </aside>
                  <section id="main-content" className="col col-lg-8 mx-2">
                    <ToastContainer
                      limit={5}
                      position="top-right"
                      type={"default"}
                      autoClose={10000}
                      hideProgressBar={false}
                      newestOnTop={true}
                      rtl={false}
                      closeOnClick
                      pauseOnFocusLoss
                      draggable
                      pauseOnHover
                    />
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
                        { pageRoutes }

                      </Switch>
                    </div>
                  </section>
                  <aside>

                  </aside>
                </main>
                <footer className={"pt-5 pb-3 bg-primary"}>
                  <Footer />
                </footer>
              </div>

            </Router>
          </ConnectedRouter>
        </IntlProvider>
      </Provider>
    );
  }
}
