import React from 'react';
import { Route } from 'react-router-dom';
import { List, Create, Update, Show } from '../components/orderglobal/';

export default [
  <Route path="/order_globals/create" component={Create} exact key="create" />,
  <Route path="/order_globals/edit/:id" component={Update} exact key="update" />,
  <Route path="/order_globals/show/:id" component={Show} exact key="show" />,
  <Route path="/order_globals/" component={List} exact strict key="list" />,
  <Route path="/order_globals/:page" component={List} exact strict key="page" />
];
