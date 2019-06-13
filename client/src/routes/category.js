import React from 'react';
import { Route } from 'react-router-dom';
import { List, Create, Update, Show } from '../components/category/';

export default [
  <Route path="/categories/create" component={Create} exact key="create" />,
  <Route path="/categories/edit/:id" component={Update} exact key="update" />,
  <Route path="/categories/show/:id" component={Show} exact key="show" />,
  <Route path="/categories/" component={List} exact strict key="list" />,
  <Route path="/categories/:page" component={List} exact strict key="page" />
];
