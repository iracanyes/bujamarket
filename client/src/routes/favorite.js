import React from 'react';
import { Route } from 'react-router-dom';
import { List, Create, Update, Show } from '../components/favorite/';

export default [
  <Route path="/favorites/create" component={Create} exact key="create" />,
  <Route path="/favorites/edit/:id" component={Update} exact key="update" />,
  <Route path="/favorites/show/:id" component={Show} exact key="show" />,
  <Route path="/favorites/" component={List} exact strict key="list" />,
  <Route path="/favorites/:page" component={List} exact strict key="page" />
];
