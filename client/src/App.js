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
/* MuiThemeProvider -  */
import { ThemeProvider, CssBaseline } from "@material-ui/core";
import { theme } from "./config/theme";

/* Layout */
import Welcome from './Welcome';
import Homepage from './page/Homepage';
import MainMenuSearchForm from "./components/search/MainMenuSearchForm";
import MainMenu from "./layout/MainMenu";
import SearchResults from "./components/search/SearchResults";
import DrawerLeftMenu from "./layout/DrawerLeftMenu";
import HomepageSlider from "./page/HomepageSlider";
import Footer from "./layout/Footer";
import LoginForm from "./components/user/LoginForm";
import RegisterForm from "./components/user/RegisterForm";
import MyAppBar from "./layout/MyAppBar";

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
      results: [],
      style: {
        main: {
          BackgroundImage: null
        }
      }
    };

    this.search = this.search.bind(this);
    this.setStyle = this.setStyle.bind(this);
  }

  /* Permet de transmettre les résultats de recherche du composant MainMenuSearchForm vers le composant d'affichage des résultats SearchResults. HOC - High Order Component */
  search(results)
  {
    this.setState({results: results});
  }

  setStyle(style)
  {
    this.setState(state => ({
      ...state,
      style: style
    }));
  }

  render()
  {
    const { results } = this.state;

    console.log('App render - results', results);

    /**
     * User's token
     * @type {any|null}
     */
    const user = localStorage.getItem("token") !== null ? JSON.parse(atob(localStorage.getItem("token").split('.')[1])) : null;

    const state = store.getState();
    const userConnected = user === null && state.user.authentication.login.token ? JSON.parse(atob(state.user.authentication.login.token.token.split('.')[1])) : null;

    return (
      <Provider store={store}>
        <IntlProvider locale={language} messages={messages[language]}>
          <ThemeProvider theme={theme}>
            <CssBaseline/>
            <ConnectedRouter history={history}>
              <Router history={history}>
                <div  style={{minHeight: "100vh"}}>
                  <header>
                    <MyAppBar onSearch={this.search} />
                  </header>
                  {/* HomepageSlider */}

                  { ( userConnected === null && user === null && results.length === 0 ) && (
                    <Route path={'/'} exact={true}>
                      <div id="homepage-slider">
                        <HomepageSlider />
                      </div>
                    </Route>
                  )}

                  {/* Main section  */}
                  <main style={{minHeight:"70vh", ...this.state.style.main }}>
                    <aside id="aside-left">
                      {/*
                        <Route
                          path={'/'}
                          strict={false}
                          exact={false}
                        >
                          <DrawerLeftMenu />
                        </Route>
                      */}
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
                      <div id="search-results-component" className={'mx-auto'}>
                        {results && (<SearchResults results={ results }/>)}
                      </div>

                      <div>
                        <Switch>

                          {process.env.REACT_APP_ENV === 'development' && (
                            <Route path="/dev" component={Welcome} strict={true} exact={true}/>
                          )}
                          <Route path="/" component={Homepage} strict={true} exact={true} />
                          <Route
                            path="/login"
                            setStyle={this.setStyle}
                            exact={true}
                            strict={true}
                            render={() => <LoginForm setStyle={this.setStyle} />}
                          />
                          <Route
                            path="/register"
                            exact={true}
                            strict={true}
                            render={() => <RegisterForm setStyle={this.setStyle} />}
                          />,
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
          </ThemeProvider>
        </IntlProvider>
      </Provider>
    );
  }
}
