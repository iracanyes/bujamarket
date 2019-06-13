import React from 'react';
import { Route } from 'react-router-dom';
import { List, Create, Update, Show } from '../components/deliverydetail/';

export default [
  <Route path="/delivery_details/create" component={Create} exact key="create" />,
  <Route path="/delivery_details/edit/:id" component={Update} exact key="update" />,
  <Route path="/delivery_details/show/:id" component={Show} exact key="show" />,
  <Route path="/delivery_details/" component={List} exact strict key="list" />,
  <Route path="/delivery_details/:page" component={List} exact strict key="page" />
];
