import React from 'react';
import { Route } from 'react-router-dom';
import { List, Create, Update, Show } from '../components/deliveryset/';

export default [
  <Route path="/delivery_sets/create" component={Create} exact key="create" />,
  <Route path="/delivery_sets/edit/:id" component={Update} exact key="update" />,
  <Route path="/delivery_sets/show/:id" component={Show} exact key="show" />,
  <Route path="/delivery_sets/" component={List} exact strict key="list" />,
  <Route path="/delivery_sets/:page" component={List} exact strict key="page" />
];
