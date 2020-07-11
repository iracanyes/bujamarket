import React from 'react';
import { Route } from 'react-router-dom';
import { List, Create, Update, Show, ValidateOrder } from '../components/orderset/';

export default [
  <Route path="/order_set/create" component={Create} exact key="create" />,
  <Route path="/order_set/edit/:id" component={Update} exact key="update" />,
  <Route path="/order_set/show/:id" component={Show} exact key="show" />,
  <Route path="/customer_orders/" component={List} exact strict key="list" />,
  <Route path={"/validate_order"} component={ValidateOrder} exact strict key="validate"/>,
  <Route path="/customer_orders/:page" component={List} exact strict key="page" />
];
