import React from 'react';
import { Route } from 'react-router-dom';
import { List, Create, Update, Show } from '../components/supplierproduct/';

export default [
  <Route path="/supplier_products/create" component={Create} exact key="create" />,
  <Route path="/supplier_products/edit/:id" component={Update} exact key="update" />,
  <Route path="/supplier_products/show/:id" component={Show} exact key="show" />,
  <Route path="/supplier_products/" component={List} exact strict key="list" />,
  <Route path="/supplier_products/:page" component={List} exact strict key="page" />
];
