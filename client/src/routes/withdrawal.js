import React from 'react';
import { Route } from 'react-router-dom';
import { List, Create, Update, Show } from '../components/withdrawal/';

export default [
  <Route path="/withdrawals/create" component={Create} exact key="create" />,
  <Route path="/withdrawals/edit/:id" component={Update} exact key="update" />,
  <Route path="/withdrawals/show/:id" component={Show} exact key="show" />,
  <Route path="/withdrawals/" component={List} exact strict key="list" />,
  <Route path="/withdrawals/:page" component={List} exact strict key="page" />
];
