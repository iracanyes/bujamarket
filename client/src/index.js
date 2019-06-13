import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { reducer as form } from 'redux-form';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import {
  ConnectedRouter,
  connectRouter,
  routerMiddleware
} from 'connected-react-router';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import * as serviceWorker from './serviceWorker';


/* Import your reducers and routes here */

/* Reducers */
// import reducers
import address from './reducers/address/';
import admin from './reducers/admin/';
import bankaccount from './reducers/bankaccount/';
import bill from './reducers/bill/';
import category from './reducers/category/';
import comment from './reducers/comment/';
import deliverydetail from './reducers/deliverydetail/';
import deliveryglobal from './reducers/deliveryglobal/';
import favorite from './reducers/favorite/';
import forum from './reducers/forum/';
import image from './reducers/image/';
import message from './reducers/message/';
import orderdetail from './reducers/orderdetail/';
import orderglobal from './reducers/orderglobal/';
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
import Welcome from './Welcome';
import addressRoutes from './routes/address';
import adminRoutes from './routes/admin';
import bankAccountRoutes from './routes/bankaccount';
import billRoutes from './routes/bill';
import categoryRoutes from './routes/category';
import commentRoutes from './routes/comment';
import deliveryDetailRoutes from './routes/deliverydetail';
import deliveryGlobalRoutes from './routes/deliveryglobal';
import favoriteRoutes from './routes/favorite';
import forumRoutes from './routes/forum';
import imageRoutes from './routes/image';
import messageRoutes from './routes/message';
import orderDetailRoutes from './routes/orderdetail';
import orderGlobalRoutes from './routes/orderglobal';
import orderreturnedRoutes from './routes/orderreturned';
import paymentRoutes from './routes/payment';
import productRoutes from './routes/product';
import shipperRoutes from './routes/shipper';
import supplierRoutes from './routes/supplier';
import supplierProductRoutes from './routes/supplierproduct';
import userRoutes from './routes/user';
import withdrawalRoutes from './routes/withdrawal';

const history = createBrowserHistory();
const store = createStore(
  combineReducers({
    router: connectRouter(history),
    form,
    address,
    admin,
    bankaccount,
    bill,
    category,
    comment,
    deliverydetail,
    deliveryglobal,
    favorite,
    forum,
    image,
    message,
    orderdetail,
    orderglobal,
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

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <BrowserRouter>
        <Switch>
          <Route path="/" component={Welcome} strict={true} exact={true}/>
          {/* Add your routes here */}
          { addressRoutes }
          { adminRoutes }
          { bankAccountRoutes }
          { billRoutes }
          { categoryRoutes }
          { commentRoutes }
          { deliveryDetailRoutes }
          { deliveryGlobalRoutes }
          { favoriteRoutes }
          { forumRoutes }
          { imageRoutes }
          { messageRoutes }
          { orderDetailRoutes }
          { orderGlobalRoutes }
          { orderreturnedRoutes }
          { paymentRoutes }
          { productRoutes }
          { shipperRoutes }
          { supplierRoutes }
          { supplierProductRoutes }
          { userRoutes }
          { withdrawalRoutes }

          <Route render={() => <h1>Not Found</h1>} />
        </Switch>
      </BrowserRouter>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
