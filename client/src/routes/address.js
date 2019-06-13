import React from 'react';
import { Route } from 'react-router-dom';
import { List, Create, Update, Show } from '../components/address/';

export default [
  <Route path="/addresses/create" component={Create} exact key="create" />,
  <Route path="/addresses/edit/:id" component={Update} exact key="update" />,
  <Route path="/addresses/show/:id" component={Show} exact key="show" />,
  <Route path="/addresses/" component={List} exact strict key="list" />,
  <Route path="/addresses/:page" component={List} exact strict key="page" />
];
