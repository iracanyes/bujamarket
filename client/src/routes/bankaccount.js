import React from 'react';
import { Route } from 'react-router-dom';
import { List, Create, Update, Show } from '../components/bankaccount/';

export default [
  <Route path="/bank_accounts/create" component={Create} exact key="create" />,
  <Route path="/bank_accounts/edit/:id" component={Update} exact key="update" />,
  <Route path="/bank_accounts/show/:id" component={Show} exact key="show" />,
  <Route path="/bank_accounts/" component={List} exact strict key="list" />,
  <Route path="/bank_accounts/:page" component={List} exact strict key="page" />
];
