import React from 'react';
import { Route } from 'react-router-dom';
import { List, Create, Update, Show } from '../components/payment/';

export default [
  <Route path="/payments/create" component={Create} exact key="create" />,
  <Route path="/payments/edit/:id" component={Update} exact key="update" />,
  <Route path="/payments/show/:id" component={Show} exact key="show" />,
  <Route path="/payments/" component={List} exact strict key="list" />,
  <Route path="/payments/:page" component={List} exact strict key="page" />
];
