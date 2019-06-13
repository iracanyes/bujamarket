import React from 'react';
import { Route } from 'react-router-dom';
import { List, Create, Update, Show } from '../components/orderdetail/';

export default [
  <Route path="/order_details/create" component={Create} exact key="create" />,
  <Route path="/order_details/edit/:id" component={Update} exact key="update" />,
  <Route path="/order_details/show/:id" component={Show} exact key="show" />,
  <Route path="/order_details/" component={List} exact strict key="list" />,
  <Route path="/order_details/:page" component={List} exact strict key="page" />
];
