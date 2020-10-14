import React from 'react';
import { Route } from 'react-router-dom';
import { List, /*Update,*/ Show } from '../components/product/';

export default [
  <Route path="/products/show/:id" component={Show} exact key="show" />,
  <Route path="/products" component={List} exact strict key="list" />,
  <Route path="/products?page=:page" component={List} exact strict key="page" />,
];
