import React from 'react';
import { Route } from 'react-router-dom';
import { List, Create, Update, Show , Search} from '../components/product/';

export default [
  <Route path="/products/create" component={Create} exact key="create" />,
  <Route path="/products/edit/:id" component={Update} exact key="update" />,
  <Route path="/products/show/:id" component={Show} exact key="show" />,
  <Route path="/products/" component={List} exact strict key="list" />,
  <Route path="/products/:page" component={List} exact strict key="page" />,
  <Route path="/products" component={Search} exact key="search"/>
];
