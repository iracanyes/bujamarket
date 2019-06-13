import React from 'react';
import { Route } from 'react-router-dom';
import { List, Create, Update, Show } from '../components/orderreturned/';

export default [
  <Route path="/order_returned/create" component={Create} exact key="create" />,
  <Route path="/order_returned/edit/:id" component={Update} exact key="update" />,
  <Route path="/order_returned/show/:id" component={Show} exact key="show" />,
  <Route path="/order_returned/" component={List} exact strict key="list" />,
  <Route path="/order_returned/:page" component={List} exact strict key="page" />
];
