import React from 'react';
import { Route } from 'react-router-dom';
import { List } from '../components/orderdetail/';

export default [
  <Route path="/supplier_orders" component={List} exact strict key="list" />,
];
