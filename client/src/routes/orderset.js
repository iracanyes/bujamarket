import React from 'react';
import { Route } from 'react-router-dom';
import { List, Create, Update, Show } from '../components/orderset/';

export default [
  <Route path="/order_sets/create" component={Create} exact key="create" />,
  <Route path="/order_sets/edit/:id" component={Update} exact key="update" />,
  <Route path="/order_sets/show/:id" component={Show} exact key="show" />,
  <Route path="/order_sets/" component={List} exact strict key="list" />,
  <Route path="/order_sets/:page" component={List} exact strict key="page" />
];
