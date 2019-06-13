import React from 'react';
import { Route } from 'react-router-dom';
import { List, Create, Update, Show } from '../components/image/';

export default [
  <Route path="/images/create" component={Create} exact key="create" />,
  <Route path="/images/edit/:id" component={Update} exact key="update" />,
  <Route path="/images/show/:id" component={Show} exact key="show" />,
  <Route path="/images/" component={List} exact strict key="list" />,
  <Route path="/images/:page" component={List} exact strict key="page" />
];
