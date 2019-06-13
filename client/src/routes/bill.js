import React from 'react';
import { Route } from 'react-router-dom';
import { List, Create, Update, Show } from '../components/bill/';

export default [
  <Route path="/bills/create" component={Create} exact key="create" />,
  <Route path="/bills/edit/:id" component={Update} exact key="update" />,
  <Route path="/bills/show/:id" component={Show} exact key="show" />,
  <Route path="/bills/" component={List} exact strict key="list" />,
  <Route path="/bills/:page" component={List} exact strict key="page" />
];
